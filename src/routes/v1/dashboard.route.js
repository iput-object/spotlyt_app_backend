const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { dashboardController } = require("../../controllers");

const router = express.Router();

// Client routes - create and view own orders
router.route("/").get(auth("admin"), dashboardController.getStatsSummary);
router.route("/incomes").get(auth("admin"), dashboardController.getIncomeStats);
router.route("/users").get(auth("admin"), dashboardController.getUserRatio);
router.route("/orders").get(auth("admin"), dashboardController.getOrderStats);
router.route("/all").get(auth("admin"), dashboardController.getDashboardStats);

module.exports = router;
