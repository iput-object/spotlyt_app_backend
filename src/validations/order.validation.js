const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createOrder = {
    body: Joi.object().keys({
        service: Joi.string().required().custom(objectId),
        quantity: Joi.number().integer().min(1).required(),
        link: Joi.string().uri().required(),
        prefs: Joi.string().optional().allow(""),
    }),
};

const getOrders = {
    query: Joi.object().keys({
        status: Joi.string().valid("pending", "inProgress", "completed", "cancelled"),
        service: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().required().custom(objectId),
    }),
};

const updateOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            status: Joi.string().valid("pending", "inProgress", "completed", "cancelled"),
            link: Joi.string().uri(),
            prefs: Joi.string().allow(""),
        })
        .min(1),
};

const deleteOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().required().custom(objectId),
    }),
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
};
