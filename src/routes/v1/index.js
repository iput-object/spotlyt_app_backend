const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");
const serviceRoute = require("./service.route");
const orderRoute = require("./order.route");
const taskRoute = require("./task.route");
const transactionRoute = require("./transaction.route");
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subCategory.route");
const dashboardRoute = require('./dashboard.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/services",
    route: serviceRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/tasks",
    route: taskRoute,
  },
  {
    path: "/transactions",
    route: transactionRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/sub-categories",
    route: subCategoryRoute,
  
  },
  {
    path:'/dashboard'
    ,route: dashboardRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
