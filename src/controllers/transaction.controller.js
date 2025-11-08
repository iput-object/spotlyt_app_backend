const httpStatus = require("http-status");
const { transactionService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const pick = require("../utils/pick");

const queryTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "transactionType",
    "status",
    "gateway",
    "performedBy",
    "transactionId",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const transactions = await transactionService.queryTransactions(
    filter,
    options
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Transactions Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data: transactions,
    })
  );
});

const queryUserTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "transactionType",
    "status",
    "gateway",
    "transactionId",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const transactions = await transactionService.queryTransactions(
    req.user.id,
    filter,
    options
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Transactions Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data: transactions,
    })
  );
});

const getTransactionById = catchAsync(async (req, res) => {
  const transactionId = req.params.transactionId;
  const transaction = await transactionService.getTransactionById(
    transactionId
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Transaction Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: transaction,
    })
  );
});

const updateTransactionStatus = catchAsync(async (req, res) => {
  const transactionId = req.params.transactionId;
  const { status } = req.body;
  const transaction = await transactionService.updateTransactionStatus(
    transactionId,
    status
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Transaction Status Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: transaction,
    })
  );
});

const createTransaction = catchAsync(async (req, res) => {
  const transactionData = req.body;
  transactionData.performedBy = req.user.id;
  const transaction = await transactionService.createTransaction(
    transactionData
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Transaction Created",
      status: "Created",
      statusCode: httpStatus.CREATED,
      data: transaction,
    })
  );
});

module.exports = {
  queryTransactions,
  getTransactionById,
  updateTransactionStatus,
  createTransaction,
  queryUserTransactions,
};
