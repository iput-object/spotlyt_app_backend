const httpStatus = require("http-status");
const { orderService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const pick = require("../utils/pick");

const createOrder = catchAsync(async (req, res) => {
  const orderData = { ...req.body, orderedBy: req.user.id };
  const order = await orderService.createOrder(orderData);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Order Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: order,
    })
  );
});

const queryOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "service"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const orders = await orderService.queryOrders(req.user.id, filter, options);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Orders Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: orders,
    })
  );
});

const revokeOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;
  const order = await orderService.revokeOrder(orderId, userId);
  res.status(httpStatus.OK).json(
    response({
      message: "Order Revoked",
      status: "OK",
      statusCode: httpStatus.OK,
      data: order,
    })
  );
});

const getOrderById = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const order = await orderService.getOrderById(orderId);
  res.status(httpStatus.OK).json(
    response({
      message: "Order Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: order,
    })
  );
});

const queryAllOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "service", "orderedBy"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const orders = await orderService.queryAllOrders(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Orders Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data: orders,
    })
  );
});

const getUserOrderStats = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const stats = await orderService.getUserOrderStats(userId);
  res.status(httpStatus.OK).json(
    response({
      message: "Order Statistics Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const updateOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const updateData = req.body;
  const order = await orderService.updateOrder(orderId, updateData);
  res.status(httpStatus.OK).json(
    response({
      message: "Order Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: order,
    })
  );
});

module.exports = {
  createOrder,
  queryOrders,
  queryAllOrders,
  getOrderById,
  revokeOrder,
  getUserOrderStats,
  updateOrder,
};
