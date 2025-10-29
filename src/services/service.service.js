const { Service, Category, SubCategory } = require("../models");

const createService = async (serviceData) => {
  const subCategoryExists = await SubCategory.findOne({
    _id: serviceData.subCategory,
    isDeleted: false,
  });

  const categoryExists = await Category.findOne({
    _id: subCategoryExists.category,
    isDeleted: false,
  });

  if (!subCategoryExists || !categoryExists) {
    throw new Error(
      "SubCategory not found or does not belong to the specified category"
    );
  }
  return await Service.create(serviceData);
};

const deleteService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service || service.isDeleted) {
    throw new Error("Service not found");
  }
  return await Service.findByIdAndUpdate(serviceId, { isDeleted: true });
};

const updateService = async (serviceId, updateData) => {
  const service = await Service.findById(serviceId);
  if (!service || service.isDeleted) {
    throw new Error("Service not found");
  }

  // If updating category or subCategory, validate them
  if (updateData.category || updateData.subCategory) {
    const categoryId = updateData.category || service.category;
    const subCategoryId = updateData.subCategory || service.subCategory;

    // Validate category exists
    const categoryExists = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    // Validate subCategory exists and belongs to the category
    const subCategoryExists = await SubCategory.findOne({
      _id: subCategoryId,
      category: categoryId,
      isDeleted: false,
    });
    if (!subCategoryExists) {
      throw new Error(
        "SubCategory not found or does not belong to the specified category"
      );
    }
  }

  Object.assign(service, updateData);
  return await service.save();
};

const getService = async (serviceId) => {
  const service = await Service.findOne({ _id: serviceId, isDeleted: false });
  if (!service) {
    throw new Error("Service not found");
  }
  return service;
};

const queryServices = async (filter, options) => {
  const query = { isDeleted: false };

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if ((key === "title" || key === "description") && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const service = await Service.paginate(query, options);

  return service;
};

const getAllServiceCategories = async () => {
  const categories = await Category.find({ isDeleted: false })
    .select("name")

  const result = [];

  for (const category of categories) {
    const subCategories = await SubCategory.find({
      category: category._id,
      isDeleted: false,
    })
      .select("name")

    const serviceCount = await Service.countDocuments({
      category: category._id,
      isDeleted: false,
    });

    result.push({
      _id: category._id,
      name: category.name,
      subCategories: subCategories,
      serviceCount: serviceCount,
    });
  }

  return result;
};

const getHomePageServices = async (options) => {
  const {
    results: categories,
    totalPages,
    totalResults,
    page,
    limit,
  } = await Category.paginate({ isDeleted: false }, options);

  const homePageServices = [];

  for (const category of categories) {
    const subCategories = await SubCategory.find({
      category: category._id,
      isDeleted: false,
    });

    const subCategoryList = [];
    for (const subCategory of subCategories) {
      const services = await Service.find({
        subCategory: subCategory._id,
        isDeleted: false,
      });

      subCategoryList.push({
        ...subCategory.toObject(),
        services,
      });
    }

    homePageServices.push({
      ...category.toObject(),
      subCategories: subCategoryList,
    });
  }

  return {
    results: homePageServices,
    ...{ page, limit, totalPages, totalResults },
  };
};

const getServicesBySubCategory = async (subCategoryId) => {
  const services = await Service.find({
    subCategory: subCategoryId,
    isDeleted: false,
  })
    .populate("category", "name")
    .populate("subCategory", "name category")
    .populate("createdBy", "fullName email")

  return services;
};

const getServicesByCategory = async (categoryId) => {
  const services = await Service.find({
    category: categoryId,
    isDeleted: false,
  })
    .populate("category", "name")
    .populate("subCategory", "name category")
    .populate("createdBy", "fullName email")
    .lean();

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
  getServicesByCategory,
};
