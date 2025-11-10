const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { dashboardService } = require("../services");

const getDashboardStats = catchAsync(async (req, res) => {
  const resp = await dashboardService.getDashboardStats();
  res.status(httpStatus.OK).json(
    response({
      code: httpStatus.OK,
      message: "OK",
      data: resp,
    })
  );
});

const getIncomeStats = catchAsync(async (req, res) => {
  const resp = await dashboardService.getIncomeStats();
  res.status(httpStatus.OK).json(
    response({
      code: httpStatus.OK,
      message: "OK",
      data: resp,
    })
  );
});

const getStatsSummary = catchAsync(async (req, res) => {
  const resp = await dashboardService.getStatsSummary();
  res.status(httpStatus.OK).json(
    response({
      code: httpStatus.OK,
      message: "OK",
      data: resp,
    })
  );
});

const getUserRatio = catchAsync(async (req, res) => {
  const resp = await dashboardService.getUserRatio();
  res.status(httpStatus.OK).json(
    response({
      code: httpStatus.OK,
      message: "OK",
      data: resp,
    })
  );
});
const getOrderStats = catchAsync(async (req, res) => {
  const resp = await dashboardService.getOrderStats();
  res.status(httpStatus.OK).json(
    response({
      code: httpStatus.OK,
      message: "OK",
      data: resp,
    })
  );
});
module.exports = {
  getDashboardStats,
  getIncomeStats,
  getStatsSummary,
  getUserRatio,
  getOrderStats,
};
