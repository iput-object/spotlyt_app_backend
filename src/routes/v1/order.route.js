const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { orderController } = require("../../controllers");
const { orderValidation } = require("../../validations");

const router = express.Router();

// Client routes - create and view own orders
router
  .route("/")
  .post(
    auth("client"),
    validate(orderValidation.createOrder),
    orderController.createOrder
  )
  .get(
    auth("client"),
    validate(orderValidation.getOrders),
    orderController.queryOrders
  );

// Get order statistics for current user
router.route("/stats").get(auth("client"), orderController.getUserOrderStats);

// Admin route - view all orders
router
  .route("/admin/all")
  .get(
    auth("admin"),
    validate(orderValidation.getOrders),
    orderController.queryAllOrders
  );

// Order-specific routes
router
  .route("/:orderId")
  .get(
    auth("common"),
    validate(orderValidation.getOrder),
    orderController.getOrderById
  )
  .patch(
    auth("admin"),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
  )
  .delete(
    auth("client"),
    validate(orderValidation.deleteOrder),
    orderController.revokeOrder
  );

module.exports = router;
