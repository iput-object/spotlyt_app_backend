const Joi = require("joi");
const { objectId } = require("./custom.validation");

const claimTask = {
    params: Joi.object().keys({
        orderId: Joi.string().required().custom(objectId),
    }),
};

const submitTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId),
    }),
};

const approveTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId),
    }),
};

const rejectTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        reason: Joi.string().required(),
    }),
};

const closeTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId),
    }),
};

const getTasks = {
    query: Joi.object().keys({
        order: Joi.string().custom(objectId),
        claimedBy: Joi.string().custom(objectId),
        status: Joi.string().valid("reserved", "submitted", "approved", "rejected", "expired"),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId),
    }),
};

module.exports = {
    claimTask,
    submitTask,
    approveTask,
    rejectTask,
    closeTask,
    getTasks,
    getTask,
};
