const httpStatus = require("http-status");
const { SubCategory } = require("../models");
const ApiError = require("../utils/ApiError");

const createSubCategory = async (subCategoryData) => {
  const subCategory = await SubCategory.findOne({ name: subCategoryData.name });
  if (subCategory) {
    throw new ApiError(httpStatus.CONFLICT, "subCategory Already Exists!");
  }
  return await SubCategory.create(subCategoryData);
};

const deleteSubCategory = async (subCategoryId) => {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory || subCategory.isDeleted) {
    throw new Error("SubCategory not found");
  }
  return await SubCategory.findByIdAndUpdate(subCategoryId, {
    isDeleted: true,
  });
};

const updateSubCategory = async (subCategoryId, updateData) => {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory || subCategory.isDeleted) {
    throw new Error("SubCategory not found");
  }

  const subCategoryName = await SubCategory.findOne({
    name: subCategoryData.name,
  });
  if (subCategoryName) {
    throw new ApiError(httpStatus.CONFLICT, "subCategory Name Already Exists!");
  }
  Object.assign(subCategory, updateData);
  return await subCategory.save();
};

const getSubCategory = async (subCategoryId) => {
  const subCategory = await SubCategory.findById(subCategoryId).populate([
    { path: "category", select: "name" },
    { path: "createdBy", select: "fullName" },
  ]);
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

  const subCategories = await SubCategory.paginate(query, options);
  return subCategories;
};

const getSubCategoriesByCategory = async (categoryId) => {
  const subCategories = await SubCategory.find({
    category: categoryId,
    isDeleted: false,
  }).select("name");
  return subCategories;
};

const getAllSubCategories = async () => {
  return await SubCategory.find({ isDeleted: false });
};
module.exports = {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategory,
  querySubCategories,
  getSubCategoriesByCategory,
  getAllSubCategories,
};
