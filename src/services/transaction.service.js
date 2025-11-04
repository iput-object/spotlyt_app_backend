const { Transaction } = require("../models");
const ApiError = require("../utils/ApiError");


const createTransaction = async (transactionData) => {
  return await Transaction.create(transactionData);
};


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


const getTransactionById = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Transaction not found");
  }
  return transaction;
};


const updateTransactionStatus = async (transactionId, status) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Transaction not found");
  }

  transaction.status = status;
  await transaction.save();
  return transaction;
};


const logCommissionPayout = async ({ taskId, userId, amount, orderId }) => {
  return await Transaction.create({
    transactionType: "withdraw",
    status: "paid",
    amount,
    gateway: "internal",
    transactionId: `commission_${taskId}_${Date.now()}`,
    performedBy: userId,
    acceptedBy: userId,
  });
};

const logRefund = async ({ orderId, userId, amount }) => {
  return await Transaction.create({
    transactionType: "refund",
    status: "paid",
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
