const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createService = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    servicePrice: Joi.number().required(),
    serviceCommission: Joi.number().required(),
    subCategory: Joi.string().custom(objectId).required(),
    category: Joi.string().custom(objectId).required(),

  }),
};

const updateService = {
  body: Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    servicePrice: Joi.number().optional(),
    serviceCommission: Joi.number().optional(),
    subCategory: Joi.string().custom(objectId).optional(),
    category: Joi.string().custom(objectId).optional(),
    isDeleted: Joi.boolean().optional(),
  }),
};

module.exports = {
  createService,
  updateService,
};
