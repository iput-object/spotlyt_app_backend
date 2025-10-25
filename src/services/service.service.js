const { Service } = require("../models");

const createService = async (serviceData) => {
  return await Service.create(serviceData);
};

const deleteService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  return await Service.findByIdAndUpdate(serviceId, { isDeleted: true });
};

const updateService = async (serviceId, updateData) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  Object.assign(service, updateData);
  return await service.save();
};

const getService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  return service;
};

const queryServices = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" || key === "email" || key === "username") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const service = await Service.paginate(query, options);

  return service;
};

const getAllServiceCategories = async () => {
  const categories = await Service.distinct("subCategory");
  return categories;
};

const getHomePageServices = async (category) => {
  const services = await Service.find({ isDeleted: false , category }).select(
    "title subCategory"
  );
  const uniqueTitles = [...new Set(services.map((s) => s.title))];
  const uniqueCategories = [...new Set(services.map((s) => s.subCategory))];

  return {
    services: uniqueTitles,
    categories: uniqueCategories,
  };
};

const getServicesBySubCategory = async (subCategory) => {
  const services = await Service.find({ subCategory, isDeleted: false });
  return services;
};

module.exports = {
  createService,
  deleteService,
  updateService,
  getService,
  queryServices,
  getAllServiceCategories,
  getHomePageServices,
  getServicesBySubCategory,
};
