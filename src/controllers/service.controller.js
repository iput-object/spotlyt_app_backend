const { serviceService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const createService = catchAsync(async (req, res) => {
  const service = await serviceService.createService(req.body);
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
  const filter = req.query || {};
  const options = {
    sortBy: req.query.sortBy || "createdAt:desc",
    limit: parseInt(req.query.limit, 10) || 10,
    page: parseInt(req.query.page, 10) || 1,
  };
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

module.exports = {
  createService,
  deleteService,
  updateService,
  getService,
  getServices,
  getAllServiceCategories
};
