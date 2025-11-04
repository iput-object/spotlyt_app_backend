const { Task, User, Order, Service } = require("../models");
const transactionService = require("./transaction.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const paginateArray = require("../utils/pagination");

const canClaimTask = async (order, userId) => {
  const user = await User.findOne({ _id: userId, isApproved: true });

  if (!user) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not verified or doesn't exist"
    );
  }

  if (!order) {
    throw new ApiError(httpStatus.FORBIDDEN, "Order not found");
  }

  // Prevent order owner from claiming their own tasks
  if (order.orderedBy._id.toString() === userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Cannot claim your own order");
  }

  if (order.status === "completed" || order.status === "cancelled") {
    throw new ApiError(httpStatus.FORBIDDEN, "Order is closed");
  }

  const taskClaimed = await Task.findOne({
    order: order._id,
    claimedBy: userId,
  });

  if (!taskClaimed) {
    return true;
  }

  if (taskClaimed.status === "submitted" || taskClaimed.status === "reserved") {
    throw new ApiError(httpStatus.FORBIDDEN, "Your already Occupied the Task!");
  }

  if (order.quantity == 0) {
    throw new ApiError(httpStatus.FORBIDDEN, "All tasks have been claimed");
  }

  return true;
};

const claimTask = async (orderId, userId) => {
  await canClaimTask(orderId, userId);

  const task = await Task.create({
    order: orderId,
    claimedBy: userId,
    status: "reserved",
    reservedAt: new Date(),
  });

  await Order.findByIdAndUpdate(orderId, { status: "inProgress" });

  return task;
};

const submitTask = async (taskId, userId, screenshotUrl) => {
  const task = await Task.findOne({ _id: taskId, claimedBy: userId });

  if (!task)
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Task not found or not owned by user"
    );
  if (task.status !== "reserved")
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Task already submitted or closed"
    );

  task.status = "submitted";
  task.screenshotUrl = screenshotUrl;
  task.submittedAt = new Date();

  await task.save();
  return task;
};

const approveTask = async (taskId, adminId) => {
  const task = await Task.findById(taskId).populate({
    path: "order",
    populate: { path: "service" },
  });

  if (!task) throw new ApiError(httpStatus.FORBIDDEN, "Task not found");
  if (task.status !== "submitted")
    throw new ApiError(httpStatus.FORBIDDEN, "Task not submitted yet");

  const service = task.order.service;
  const commission = service.serviceCommission;

  task.status = "approved";
  task.approvedBy = adminId;
  task.approvedAt = new Date();
  task.commissionAmount = commission;

  await task.save();

  // Credit commission to worker's balance
  await User.findByIdAndUpdate(task.claimedBy, {
    $inc: { balance: commission },
  });

  // Log commission payout transaction
  await transactionService.logCommissionPayout({
    taskId: task._id,
    userId: task.claimedBy,
    amount: commission,
    orderId: task.order._id,
  });

  // Check if all tasks are approved and close order if needed
  await checkAndCloseOrder(task.order._id);

  return task;
};

const rejectTask = async (taskId, adminId, reason) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(httpStatus.FORBIDDEN, "Task not found");
  if (task.status !== "submitted")
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only submitted tasks can be rejected"
    );

  task.status = "rejected";
  task.approvedBy = adminId;
  task.rejectedReason = reason || "Invalid proof";
  task.approvedAt = new Date();

  await task.save();
  return task;
};

const checkAndCloseOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) return;

  const totalTasks = order.quantity;
  const approvedTasks = await Task.countDocuments({
    order: orderId,
    status: "approved",
  });

  // If all tasks are approved, mark order as completed
  if (approvedTasks >= totalTasks) {
    order.status = "completed";
    await order.save();
  }
};

const closeTask = async (taskId, adminId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(httpStatus.FORBIDDEN, "Task not found");

  if (task.status === "approved" || task.status === "expired") {
    throw new ApiError(httpStatus.FORBIDDEN, "Task already closed");
  }

  task.status = "expired";
  task.approvedBy = adminId;
  task.approvedAt = new Date();

  await task.save();
  return task;
};

const autoExpireReservedTasks = async (hoursLimit = 24) => {
  const expirationTime = new Date(Date.now() - hoursLimit * 60 * 60 * 1000);

  const result = await Task.updateMany(
    {
      status: "reserved",
      reservedAt: { $lt: expirationTime },
    },
    {
      $set: {
        status: "expired",
        approvedAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
};

const queryTasks = async (filter, options) => {
  const query = {};

  for (const key of Object.keys(filter)) {
    if (key === "status" && filter[key] !== "") {
      query[key] = filter[key];
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const tasks = await Task.paginate(query, options);
  return tasks;
};

const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate("claimedBy", "fullName email")
    .populate({
      path: "order",
      populate: { path: "service orderedBy" },
    })
    .populate("approvedBy", "fullName email");

  if (!task) throw new ApiError(httpStatus.FORBIDDEN, "Task not found");
  return task;
};

const queryClaimableTasks = async (employeeId, filter, options) => {
  const query = {};
  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") query[key] = filter[key];
  }

  const allOrders = await Order.find(query).populate("orderedBy");
  const claimableOrders = [];

  for (const order of allOrders) {
    try {
      const claimedCount = await Task.countDocuments({
        order: order._id,
        status: { $nin: ["rejected", "expired"] },
      });

      // Calculate remaining
      const remaining = Math.max(order.quantity - claimedCount, 0);
      order.quantity = remaining;
      const canClaim = await canClaimTask(order, employeeId);
      if (canClaim) claimableOrders.push(order);
    } catch (_) {}
  }

  return paginateArray(claimableOrders, options);
};

const queryEmployeeTasks = async (employeeId, filter, options) => {
  const query = { claimedBy: employeeId };
  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") query[key] = filter[key];
  }

  return await Task.paginate(query, options);
};
module.exports = {
  canClaimTask,
  claimTask,
  submitTask,
  approveTask,
  rejectTask,
  closeTask,
  checkAndCloseOrder,
  queryTasks,
  getTaskById,
  queryClaimableTasks,
  queryEmployeeTasks,
};
