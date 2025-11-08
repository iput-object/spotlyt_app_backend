const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getTransactions = {
    query: Joi.object().keys({
        transactionType: Joi.string().valid("order", "withdraw", "refund"),
        status: Joi.string().valid("pending", "completed", "failed"),
        gateway: Joi.string(),
        performedBy: Joi.string().custom(objectId),
        transactionId: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getUserTransactions = {
    query: Joi.object().keys({
        transactionType: Joi.string().valid("order", "withdraw", "refund"),
        status: Joi.string().valid("pending", "completed", "failed"),
        gateway: Joi.string(),
        transactionId: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};


const createTransaction = {
    body: Joi.object().keys({
        transactionType: Joi.string().required().valid("order", "withdraw", "refund"),
        amount: Joi.number().required().positive(),
        status: Joi.string().required().valid("pending", "completed", "failed"),
        gateway: Joi.string().required(),
        transactionId: Joi.string().required(),
    }),
};

const getTransaction = {
    params: Joi.object().keys({
        transactionId: Joi.string().required().custom(objectId),
    }),
};

const updateTransactionStatus = {
    params: Joi.object().keys({
        transactionId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        status: Joi.string().required().valid("pending", "completed", "failed"),
    }),
};

module.exports = {
    getTransactions,
    getTransaction,
    updateTransactionStatus,
    createTransaction,
    getUserTransactions
};
