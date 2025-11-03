const httpStatus = require("http-status");
const { Category } = require("../models");
const ApiError = require("../utils/ApiError");

const createCategory = async (categoryData) => {
  const category = await Category.findOne({ name: categoryData.name });
  if (category) {
    throw new ApiError(httpStatus.CONFLICT, "Category Already Exists!");
  }
  return await Category.create(categoryData);
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
  }
  return await Category.findByIdAndUpdate(categoryId, { isDeleted: true });
};

const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const categoryName = await Category.findOne({ name: updateData.name });
  if (categoryName) {
    throw new ApiError(httpStatus.CONFLICT, "Category Name Already Exists!");
  }

  Object.assign(category, updateData);
  return await category.save();
};

const getCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
  }
  return category;
};

const queryCategories = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (key === "name" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" };
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const categories = await Category.paginate(query, options);
  return categories;
};

const getAllCategories = async () => {
  const categories = await Category.find({ isDeleted: false });
  return categories;
};

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  queryCategories,
  getAllCategories,
};
