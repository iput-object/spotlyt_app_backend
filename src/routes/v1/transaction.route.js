const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { transactionController } = require("../../controllers");
const { transactionValidation } = require("../../validations");

const router = express.Router();

router
  .route("/user")
  .get(
    auth("common"),
    validate(transactionValidation.getUserTransactions),
    transactionController.queryUserTransactions
  );

router
  .route("/")
  .get(
    auth("admin"),
    validate(transactionValidation.getTransactions),
    transactionController.queryTransactions
  )
  .post(
    auth("admin"),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction
  );

// Get specific transaction
router
  .route("/:transactionId")
  .get(
    auth("common"),
    validate(transactionValidation.getTransaction),
    transactionController.getTransactionById
  )
  .patch(
    auth("admin"),
    validate(transactionValidation.updateTransactionStatus),
    transactionController.updateTransactionStatus
  );

module.exports = router;
