const httpStatus = require("http-status");
const { taskService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const pick = require("../utils/pick");

const claimTask = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;
  const task = await taskService.claimTask(orderId, userId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Claimed",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const submitTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user.id;

  const screenshotUrl = {};
  if (req.file) {
    screenshotUrl.url = "/uploads/taskProofs/" + req.file.filename;
    screenshotUrl.path = req.file.path;
  }

  const task = await taskService.submitTask(taskId, userId, screenshotUrl);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Submitted",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const queryTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["order", "claimedBy", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const tasks = await taskService.queryTasks(filter, options);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Tasks Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: tasks,
    })
  );
});

const approveTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const adminId = req.user.id;
  const task = await taskService.approveTask(taskId, adminId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Approved",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const rejectTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const adminId = req.user.id;
  const { reason } = req.body;
  const task = await taskService.rejectTask(taskId, adminId, reason);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Rejected",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const closeTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const adminId = req.user.id;
  const task = await taskService.closeTask(taskId, adminId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task Closed",
      status: "OK",
      statusCode: httpStatus.OK,
      data: task,
    })
  );
});

const getTaskById = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const task = await taskService.getTaskById(taskId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: task,
    })
  );
});

const queryEmployeeTasks = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filter = pick(req.query, ["status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const tasks = await taskService.queryAvailableTasks(userId, filter, options);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Employee Tasks Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: tasks,
    })
  );
});

module.exports = {
  claimTask,
  submitTask,
  approveTask,
  rejectTask,
  closeTask,
  queryTasks,
  getTaskById,
  queryEmployeeTasks,
};
