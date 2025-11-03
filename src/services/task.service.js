const { Task, User, Order, Service } = require("../models");
const transactionService = require("./transaction.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Check if user can claim a task for an order
 * @param {ObjectId} orderId
 * @param {ObjectId} userId
 * @returns {Promise<boolean>}
 */
const canClaimTask = async (orderId, userId) => {
  const [user, order] = await Promise.all([
    User.findOne({ _id: userId, isApproved: true }),
    Order.findById(orderId).populate("orderedBy"),
  ]);

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

  // Check if order is still open
  if (order.status === "completed" || order.status === "cancelled") {
    throw new ApiError(httpStatus.FORBIDDEN, "Order is closed");
  }

  const taskClaimed = await Task.findOne({
    order: orderId,
    claimedBy: userId,
  });

  if (
    taskClaimed.status === "approved" ||
    taskClaimed.status === "submitted" ||
    taskClaimed.status === "reserved"
  ) {
    throw new ApiApiError(
      httpStatus.FORBIDDEN,
      httpStatus.FORBIDDEN,
      "Your already Occupied the Task!"
    );
  }

  const claimedCount = await Task.countDocuments({ order: orderId });
  if (claimedCount >= order.quantity) {
    throw new ApiError(httpStatus.FORBIDDEN, "All tasks have been claimed");
  }

  return true;
};

/**
 * Claim a task for an order
 * @param {ObjectId} orderId
 * @param {ObjectId} userId
 * @returns {Promise<Task>}
 */
const claimTask = async (orderId, userId) => {
  await canClaimTask(orderId, userId);

  const task = await Task.create({
    order: orderId,
    claimedBy: userId,
    status: "reserved",
    reservedAt: new Date(),
  });

  // Update order status to inProgress if first task claimed
  await Order.findByIdAndUpdate(orderId, { status: "inProgress" });

  return task;
};

/**
 * Submit a task with proof (screenshot)
 * @param {ObjectId} taskId
 * @param {ObjectId} userId
 * @param {string} screenshotUrl
 * @returns {Promise<Task>}
 */
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

/**
 * Approve a task and credit commission to worker
 * @param {ObjectId} taskId
 * @param {ObjectId} adminId
 * @returns {Promise<Task>}
 */
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

/**
 * Reject a task with reason
 * @param {ObjectId} taskId
 * @param {ObjectId} adminId
 * @param {string} reason
 * @returns {Promise<Task>}
 */
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

/**
 * Check if all tasks for an order are approved and close order
 * @param {ObjectId} orderId
 * @returns {Promise<void>}
 */
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

/**
 * Manually close a task (admin action)
 * @param {ObjectId} taskId
 * @param {ObjectId} adminId
 * @returns {Promise<Task>}
 */
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

/**
 * Auto-expire reserved tasks that haven't been submitted within time limit
 * @param {number} hoursLimit - Hours before expiration (default 24)
 * @returns {Promise<number>} - Number of expired tasks
 */
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

/**
 * Auto-close orders where all tasks are either approved or expired
 * @returns {Promise<number>} - Number of closed orders
 */
const autoCloseOrders = async () => {
  // Find all inProgress orders
  const orders = await Order.find({ status: "inProgress" });

  let closedCount = 0;

  for (const order of orders) {
    const totalTasks = order.quantity;
    const tasks = await Task.find({ order: order._id });

    const finishedTasks = tasks.filter(
      (t) => t.status === "approved" || t.status === "expired"
    ).length;

    // If all tasks are finished (approved or expired), close the order
    if (finishedTasks >= totalTasks) {
      const approvedCount = tasks.filter((t) => t.status === "approved").length;

      // Mark as completed if at least one task was approved, otherwise cancelled
      order.status = approvedCount > 0 ? "completed" : "cancelled";
      await order.save();
      closedCount++;
    }
  }

  return closedCount;
};

/**
 * Query tasks with pagination
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
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

/**
 * Get task by ID with populated fields
 * @param {ObjectId} taskId
 * @returns {Promise<Task>}
 */
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

const queryAvailableTasks = async (employeeId, filter, options) => {
  const query = {};

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") query[key] = filter[key];
  }

  const Orders = await Order.paginate(query, options);
  const claimableOrders = [];

  for (const order of Orders.results) {
    try {
      await canClaimTask(order._id, employeeId);
      claimableOrders.push(order);
    } catch (err) {
      // Not claimable, skip
    }
  }

  return {
    ...Orders,
    results: claimableOrders,
    totalResults: claimableOrders.length,
    totalPages: Math.ceil(claimableOrders.length / Orders.limit) || 1,
  };
};

module.exports = {
  canClaimTask,
  claimTask,
  submitTask,
  approveTask,
  rejectTask,
  closeTask,
  checkAndCloseOrder,
  autoExpireReservedTasks,
  autoCloseOrders,
  queryTasks,
  getTaskById,
  queryAvailableTasks,
};
