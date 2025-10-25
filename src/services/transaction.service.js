const { Transaction } = require("../models");

/**
 * Create a transaction record
 * @param {Object} transactionData
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionData) => {
  return await Transaction.create(transactionData);
};

/**
 * Query transactions with pagination
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options (limit, page, sort, populate)
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
  const query = {};

  for (const key of Object.keys(filter)) {
    if (
      (key === "transactionType" || key === "status" || key === "gateway") &&
      filter[key] !== ""
    ) {
      query[key] = filter[key];
    } else if (key === "transactionId" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" };
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const transactions = await Transaction.paginate(query, options);
  return transactions;
};

/**
 * Get transaction by ID
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  return transaction;
};

/**
 * Update transaction status
 * @param {ObjectId} transactionId
 * @param {string} status - "pending" | "completed" | "failed"
 * @returns {Promise<Transaction>}
 */
const updateTransactionStatus = async (transactionId, status) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  transaction.status = status;
  await transaction.save();
  return transaction;
};

/**
 * Log commission payout when task is approved
 * @param {Object} taskData - { taskId, userId, amount, orderId }
 * @returns {Promise<Transaction>}
 */
const logCommissionPayout = async ({ taskId, userId, amount, orderId }) => {
  return await Transaction.create({
    transactionType: "withdraw",
    status: "completed",
    amount,
    gateway: "internal",
    transactionId: `commission_${taskId}_${Date.now()}`,
    performedBy: userId,
    acceptedBy: userId, // Self-accepted for commission
  });
};

/**
 * Log refund transaction
 * @param {Object} refundData - { orderId, userId, amount }
 * @returns {Promise<Transaction>}
 */
const logRefund = async ({ orderId, userId, amount }) => {
  return await Transaction.create({
    transactionType: "refund",
    status: "completed",
    amount,
    gateway: "stripe",
    transactionId: `refund_${orderId}_${Date.now()}`,
    performedBy: userId,
    acceptedBy: null,
  });
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  updateTransactionStatus,
  logCommissionPayout,
  logRefund,
};
