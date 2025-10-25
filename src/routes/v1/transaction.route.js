const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { transactionController } = require("../../controllers");
const { transactionValidation } = require("../../validations");

const router = express.Router();

// Get transactions (admin can see all, users see their own)
router
  .route("/")
  .get(
    auth("common"),
    validate(transactionValidation.getTransactions),
    transactionController.queryTransactions
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
