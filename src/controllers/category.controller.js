const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { categoryService } = require("../services");
const pick = require("../utils/pick");

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: category,
    })
  );
});

const deleteCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  await categoryService.deleteCategory(categoryId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category Deleted",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {},
    })
  );
});

const updateCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await categoryService.updateCategory(categoryId, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: category,
    })
  );
});

const getCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await categoryService.getCategory(categoryId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: category,
    })
  );
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const categories = await categoryService.queryCategories(filter, options);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Categories Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(httpStatus.CREATED).json(
    response({
      message: "All Categories Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  getCategories,
  getAllCategories,
};