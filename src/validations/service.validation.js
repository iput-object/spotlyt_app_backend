const Joi = require("joi");

const createService = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    servicePrice: Joi.number().required(),
    serviceCommission: Joi.number().required(),
    category: Joi.string().required().valid("social", "video", "corporate"),
    subCategory: Joi.string().trim().required(),
  }),
};

const updateService = {
  body: Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    servicePrice: Joi.number().optional(),
    serviceCommission: Joi.number().optional(),
    category: Joi.string().optional().valid("social", "video", "corporate"),
    subCategory: Joi.string().trim().optional(),
    isDeleted: Joi.boolean().optional(),
  }),
};

module.exports = {
  createService,
  updateService,
};
