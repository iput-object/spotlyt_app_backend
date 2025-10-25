const { Task, Transaction, Order, Service } = require("../models");
const transactionService = require("./transaction.service");

/**
 * Check if any task has been deployed (approved) for an order
 * @param {ObjectId} orderId
 * @returns {Promise<boolean>}
 */
const isTaskDeployed = async (orderId) => {
  const task = await Task.findOne({ order: orderId, status: "approved" });
  return !!task;
};

/**
 * Create a new order with payment transaction
 * @param {Object} orderData
 * @returns {Promise<Order>}
 */
const createOrder = async (orderData) => {
  // Validate service exists and get pricing
  const service = await Service.findById(orderData.service);
  if (!service) {
    throw new Error("Service not found");
  }

  // Calculate total amount
  const totalAmount = service.servicePrice * orderData.quantity;
  orderData.amount = totalAmount;

  // Create payment transaction (mocked for now with stripe)
  const payment = await transactionService.createTransaction({
    transactionType: "order",
    status: "completed", // In production, this would be "pending" until payment gateway confirms
    amount: totalAmount,
    gateway: "stripe",
    transactionId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    performedBy: orderData.orderedBy,
    acceptedBy: orderData.orderedBy, // For orders, user pays themselves
  });

  if (!payment) {
    throw new Error("Transaction failed");
  }

  orderData.transaction = payment._id;
  orderData.status = "pending";

  const order = await Order.create(orderData);
  return order;
};

/**
 * Query orders with pagination
 * @param {ObjectId} userId
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
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

/**
 * Get all orders (admin view)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
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

/**
 * Get order by ID with populated fields
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("service")
    .populate("orderedBy", "fullName email")
    .populate("transaction");

  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

/**
 * Revoke/cancel an order and issue refund
 * @param {ObjectId} orderId
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */
const revokeOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Verify ownership
  if (order.orderedBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to revoke this order");
  }

  // Check if order can be cancelled
  if (order.status === "completed") {
    throw new Error("Cannot cancel completed order");
  }

  if (order.status === "cancelled") {
    throw new Error("Order already cancelled");
  }

  // Check if any tasks have been approved
  const hasApprovedTasks = await isTaskDeployed(orderId);
  if (hasApprovedTasks) {
    throw new Error("Cannot cancel order with approved tasks");
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

/**
 * Get order statistics for a user
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
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

/**
 * Update order (admin only)
 * @param {ObjectId} orderId
 * @param {Object} updateData
 * @returns {Promise<Order>}
 */
const updateOrder = async (orderId, updateData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Prevent updating certain fields if order has approved tasks
  if (updateData.status === "cancelled") {
    const hasApprovedTasks = await isTaskDeployed(orderId);
    if (hasApprovedTasks) {
      throw new Error("Cannot cancel order with approved tasks");
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
