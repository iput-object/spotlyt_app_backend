const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "name",
    "role",
    "isApproved",
    "email",
    "phoneNumber",
    "nidNumber",
    "dateOfBirth",
    "isEmailVerified",
    "isProfileCompleted",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Users",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is deleted");
  }

  if (user.isBlocked) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is blocked");
  }

  const { securitySettings } = user;

  res.status(httpStatus.OK).json(
    response({
      message: "User Profile",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, securitySettings },
    })
  );
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateUser = catchAsync(async (req, res) => {
  if (req.body.interest) {
    const parsedInterest = JSON.parse(req.body.interest);
    req.body.interest = parsedInterest;
  }
  const image = {};
  console.log(req.file);
  if (req.file) {
    image.url = "/uploads/users/" + req.file.filename;
    image.path = req.file.path;
  }
  if (req.file) {
    req.body.image = image;
  }

  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateProfile = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/users/${req.file.filename}`;
  }

  // Set name if firstName or lastName is provided
  if (!req.body.name && (req.body.firstName || req.body.lastName)) {
    req.body.name = `${req.body.firstName || ""} ${
      req.body.lastName || ""
    }`.trim();
  }

  const user = await userService.updateUserById(req.user.id, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const applyEmployeeApproval = catchAsync(async (req, res) => {
  const resp = await userService.applyEmployeeApproval(req.user);
  res.status(httpStatus.OK).json(
    response({
      message: "Applied For Approval",
      status: "OK",
      statusCode: httpStatus.OK,
      data: resp,
    })
  );
});

const getEmployees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "isApproved", "isProfileCompleted"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const resp = await userService.getEmployees(filter, options);

  res.status(httpStatus.OK).json(
    response({
      message: "Employee List",
      status: "OK",
      statusCode: httpStatus.OK,
      data: resp,
    })
  );
});

const approveEmployee = catchAsync(async (req, res) => {
  const employeeId = req.params.employeeId;
  if (!employeeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee Id is Required.");
  }
  const approveResp = await userService.approveEmployee(req.params.employeeId);

  res.status(httpStatus.OK).json(
    response({
      message: "Employee Approved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: approveResp,
    })
  );
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getProfile,
  updateUser,
  updateProfile,
  deleteUser,
  applyEmployeeApproval,
  getEmployees,
  approveEmployee,
};
