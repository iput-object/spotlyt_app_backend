const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getApprovableEmployees = catchAsync(async(req, res) => {
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    let user = await userService.queryUsers({role: "employee", isApproved: false}, options);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Employees to be approved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: user,
      })
    );
});

const getApprovedEmployees = catchAsync(async(req, res) => {
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    let user = await userService.queryUsers({role: "employee", isApproved: true}, options);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
    }
    
    res.status(httpStatus.OK).json(
      response({
        message: "Employees approved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: user,
      })
    );
});

module.exports = {
    getApprovableEmployees,
    getApprovedEmployees,
};
