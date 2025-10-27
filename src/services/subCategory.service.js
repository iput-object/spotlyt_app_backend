const { SubCategory } = require("../models");

const createSubCategory = async (subCategoryData) => {
  return await SubCategory.create(subCategoryData);
};

const deleteSubCategory = async (subCategoryId) => {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory || subCategory.isDeleted) {
    throw new Error("SubCategory not found");
  }
  return await SubCategory.findByIdAndUpdate(subCategoryId, { isDeleted: true });
};

const updateSubCategory = async (subCategoryId, updateData) => {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory || subCategory.isDeleted) {
    throw new Error("SubCategory not found");
  }
  Object.assign(subCategory, updateData);
  return await subCategory.save();
};

const getSubCategory = async (subCategoryId) => {
  const subCategory = await SubCategory.findById(subCategoryId).populate("category", "name");
  if (!subCategory || subCategory.isDeleted) {
    throw new Error("SubCategory not found");
  }
  return subCategory;
};

const querySubCategories = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (key === "name" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" };
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const populateOptions = {
    ...options,
    populate: [{ path: "category", select: "name" }],
  };

  const subCategories = await SubCategory.paginate(query, populateOptions);
  return subCategories;
};

const getSubCategoriesByCategory = async (categoryId) => {
  const subCategories = await SubCategory.find({ 
    category: categoryId, 
    isDeleted: false 
  }).select("name");
  return subCategories;
};

module.exports = {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategory,
  querySubCategories,
  getSubCategoriesByCategory,
};