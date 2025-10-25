const httpStatus = require("http-status");
const { serviceService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const pick = require("../utils/pick");
const { get } = require("mongoose");

const createService = catchAsync(async (req, res) => {
  const service = await serviceService.createService({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Service Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: service,
    })
  );
});

const deleteService = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;
  const service = await serviceService.deleteService(serviceId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Service Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: service,
    })
  );
});
const updateService = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;
  const service = await serviceService.updateService(serviceId, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Service Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: service,
    })
  );
});

const getService = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;
  const service = await serviceService.getService(serviceId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Service Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: service,
    })
  );
});

const getServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["subCategory", "createdBy"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const services = await serviceService.queryServices(filter, options);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Services Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: services,
    })
  );
});

const getAllServiceCategories = catchAsync(async (req, res) => {
  const categories = await serviceService.getAllServiceCategories();
  res.status(httpStatus.CREATED).json(
    response({
      message: "Service Categories Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

const getHomePageServices = catchAsync(async (req, res) => {
  const category = pick(req.query, ["category"]).category;
  console.log({ category });
  const services = await serviceService.getHomePageServices(category);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Home Page Services Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: services,
    })
  );
});

const getServicesBySubCategory = catchAsync(async (req, res) => {
  const subCategory = req.params.subCategory;
  if (!subCategory) {
    throw new Error("SubCategory parameter is required");
  }
  const services = await serviceService.getServicesBySubCategory(subCategory);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Services By Category Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: services,
    })
  );
});
module.exports = {
  createService,
  deleteService,
  updateService,
  getService,
  getServices,
  getAllServiceCategories,
  getHomePageServices,
  getServicesBySubCategory,
};
