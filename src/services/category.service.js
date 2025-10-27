const { Category } = require("../models");

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }
  return await Category.findByIdAndUpdate(categoryId, { isDeleted: true });
};

const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }
  Object.assign(category, updateData);
  return await category.save();
};

const getCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new Error("Category not found");
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
  const categories = await Category.find({ isDeleted: false }).select("name");
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