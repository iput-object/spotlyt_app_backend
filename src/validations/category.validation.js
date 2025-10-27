const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};