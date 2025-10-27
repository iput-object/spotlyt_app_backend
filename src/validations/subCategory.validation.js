const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createSubCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    category: Joi.string().custom(objectId).required(),
  }),
};

const updateSubCategory = {
  params: Joi.object().keys({
    subCategoryId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    category: Joi.string().custom(objectId),
  }),
};

const getSubCategory = {
  params: Joi.object().keys({
    subCategoryId: Joi.string().custom(objectId).required(),
  }),
};

const deleteSubCategory = {
  params: Joi.object().keys({
    subCategoryId: Joi.string().custom(objectId).required(),
  }),
};

const getSubCategoriesByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  getSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
};
