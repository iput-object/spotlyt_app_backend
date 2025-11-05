const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullName: Joi.string().required(),
    role: Joi.string().required().valid("employee", "client"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  file: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    callingCode: Joi.string(),
    dateOfBirth: Joi.string(),
    address: Joi.string(),
  }),
};

const applyEmployeeApproval = {
  file: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    callingCode: Joi.string(),
    dateOfBirth: Joi.string(),
    address: Joi.string(),
    nidNumber: Joi.number().required(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getHome = {};

module.exports = {
  getHome,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  applyEmployeeApproval,
};
