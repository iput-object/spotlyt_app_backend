const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { subCategoryService } = require("../services");
const pick = require("../utils/pick");

const createSubCategory = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.createSubCategory({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategory Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subCategory,
    })
  );
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  await subCategoryService.deleteSubCategory(subCategoryId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategory Deleted",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {},
    })
  );
});

const updateSubCategory = catchAsync(async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  const subCategory = await subCategoryService.updateSubCategory(
    subCategoryId,
    req.body
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategory Updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subCategory,
    })
  );
});

const getSubCategory = catchAsync(async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  const subCategory = await subCategoryService.getSubCategory(subCategoryId);
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategory Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subCategory,
    })
  );
});

const getSubCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "category"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const subCategories = await subCategoryService.querySubCategories(
    filter,
    options
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategories Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subCategories,
    })
  );
});

const getSubCategoriesByCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    throw new Error("Category parameter is required");
  }
  const subCategories = await subCategoryService.getSubCategoriesByCategory(
    categoryId
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "SubCategories By Category Fetched",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subCategories,
    })
  );
});

const getAllSubCategories = catchAsync(async (req, res) => {
  const subCategories = await subCategoryService.getAllSubCategories();
  res.status(httpStatus.OK).json(
    response({
      message: "SubCategories Fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data: subCategories,
    })
  );
});

module.exports = {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getAllSubCategories
};
