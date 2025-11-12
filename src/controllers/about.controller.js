const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { aboutService } = require("../services");

const modifyTermsAndCondition = catchAsync(async (req, res) => {
  const data = await aboutService.modifyTermsAndCondition(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Terms and Conditions Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data,
    })
  );
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const data = await aboutService.getTermsAndCondition();
  res.status(httpStatus.OK).json(
    response({
      message: "Terms and Conditions Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const modifyAboutUs = catchAsync(async (req, res) => {
  const data = await aboutService.modifyAboutUs(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "About Us Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data,
    })
  );
});

const getAboutUs = catchAsync(async (req, res) => {
  const data = await aboutService.getAboutUs();
  res.status(httpStatus.OK).json(
    response({
      message: "About Us Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const modifyPrivacyPolicy = catchAsync(async (req, res) => {
  const data = await aboutService.modifyPrivacyPolicy(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Privacy Policy Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data,
    })
  );
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const data = await aboutService.getPrivacyPolicy();
  res.status(httpStatus.OK).json(
    response({
      message: "Privacy Policy Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const modifySupport = catchAsync(async (req, res) => {
  const data = await aboutService.modifySupport(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Support Info Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data,
    })
  );
});

const getSupport = catchAsync(async (req, res) => {
  const data = await aboutService.getSupport();
  res.status(httpStatus.OK).json(
    response({
      message: "Support Info Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

module.exports = {
  modifyTermsAndCondition,
  getTermsAndCondition,
  modifyAboutUs,
  getAboutUs,
  modifyPrivacyPolicy,
  getPrivacyPolicy,
  modifySupport,
  getSupport,
};
