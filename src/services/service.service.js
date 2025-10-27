const { Service } = require("../models");

const createService = async (serviceData) => {
  return await Service.create(serviceData);
};

const deleteService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  console.log(service)
  if (!service || service.isDeleted) {
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

const getHomePageServices = async () => {
  const services = await Service.find({ isDeleted: false }).select(
    "title category subCategory"
  );

  const categoryMap = {};

  for (const s of services) {
    if (!categoryMap[s.category]) {
      categoryMap[s.category] = {
        subCategories: new Set(),
        services: new Set(),
      };
    }

    categoryMap[s.category].subCategories.add(s.subCategory);
    categoryMap[s.category].services.add(s.title);
  }

  for (const category in categoryMap) {
    categoryMap[category].subCategories = [
      ...categoryMap[category].subCategories,
    ];
    categoryMap[category].services = [...categoryMap[category].services];
  }

  return categoryMap;
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
