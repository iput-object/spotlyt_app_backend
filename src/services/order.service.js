const { Task, Transaction, Order, Service } = require("../models");
const { createSub } = require("../utils/stripe");
const transactionService = require("./transaction.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const isTaskDeployed = async (orderId) => {
  const task = await Task.findOne({ order: orderId, status: "approved" });
  return !!task;
};

const createOrder = async (orderData) => {
  // Validate service exists and get pricing
  const service = await Service.findById(orderData.service);
  if (!service) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service not found");
  }

  // Calculate total amount
  const totalAmount = service.servicePrice * orderData.quantity;
  orderData.amount = totalAmount;

  // console.log({ orderData, service });

  // const stripeRes = await createSub({
  //   title: service.title,
  //   quantity: orderData.quantity,
  //   price: service.servicePrice,
  // });
  // console.log(stripeRes.url);
  // // Create payment transaction (mocked for now with stripe)
  // const payment = await transactionService.createTransaction({
  //   transactionType: "order",
  //   status: stripeRes.payment_status, // In production, this would be "pending" until payment gateway confirms
  //   amount: totalAmount,
  //   gateway: "stripe",
  //   transactionId: stripeRes.id,
  //   performedBy: orderData.orderedBy,
  //   acceptedBy: orderData.orderedBy, // For orders, user pays themselves
  // });

  // Create payment transaction (mocked for now with stripe)
  const payment = await transactionService.createTransaction({
    transactionType: "order",
    status: "paid", // In production, this would be "pending" until payment gateway confirms
    amount: totalAmount,
    gateway: "stripe",
    transactionId: `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    performedBy: orderData.orderedBy,
    acceptedBy: orderData.orderedBy, // For orders, user pays themselves
  });

  if (!payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Transaction failed");
  }

  orderData.transaction = payment._id;
  orderData.status = "pending";

  const order = await Order.create(orderData);
  // return { ...order.toObject(), payment_url: stripeRes.url };
  return order;
};

const queryOrders = async (userId, filter, options) => {
  const query = { orderedBy: userId };

  for (const key of Object.keys(filter)) {
    if (key === "status" && filter[key] !== "") {
      query[key] = filter[key];
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const orders = await Order.paginate(query, options);
  return orders;
};

const queryAllOrders = async (filter, options) => {
  const query = {};

  for (const key of Object.keys(filter)) {
    if (key === "status" && filter[key] !== "") {
      query[key] = filter[key];
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const orders = await Order.paginate(query, options);
  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("service")
    .populate("orderedBy", "fullName email")
    .populate("transaction");

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
  }
  return order;
};

const revokeOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
  }

  // Verify ownership
  if (order.orderedBy.toString() !== userId.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not authorized to revoke this order"
    );
  }

  // Check if order can be cancelled
  if (order.status === "completed") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot cancel completed order");
  }

  if (order.status === "cancelled") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order already cancelled");
  }

  // Check if any tasks have been approved
  const hasApprovedTasks = await isTaskDeployed(orderId);
  if (hasApprovedTasks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel order with approved tasks"
    );
  }

  // Expire all reserved/submitted tasks
  await Task.updateMany(
    { order: orderId, status: { $in: ["reserved", "submitted"] } },
    { $set: { status: "expired" } }
  );

  // Create refund transaction
  await transactionService.logRefund({
    orderId: order._id,
    userId: order.orderedBy,
    amount: order.amount,
  });

  order.status = "cancelled";
  await order.save();

  return order;
};

const getUserOrderStats = async (userId) => {
  const stats = await Order.aggregate([
    { $match: { orderedBy: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  return stats;
};

const updateOrder = async (orderId, updateData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
  }

  // Prevent updating certain fields if order has approved tasks
  if (updateData.status === "cancelled") {
    const hasApprovedTasks = await isTaskDeployed(orderId);
    if (hasApprovedTasks) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot cancel order with approved tasks"
      );
    }
  }

  Object.assign(order, updateData);
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  queryAllOrders,
  getOrderById,
  revokeOrder,
  isTaskDeployed,
  getUserOrderStats,
  updateOrder,
};
