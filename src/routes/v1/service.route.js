const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const { serviceController } = require("../../controllers");
const { serviceValidation } = require("../../validations");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router
  .route("/homepage")
  .get(auth("employee"), serviceController.getHomePageServices);

router
  .route("/homepage/category/:category")
  .get(auth("employee"), serviceController.getHomeServicesByCategory);

router
  .route("/")
  .post(
    auth("admin"),
    validate(serviceValidation.createService),
    serviceController.createService
  );
router
  .route("/:serviceId")
  .delete(auth("admin"), serviceController.deleteService);
router
  .route("/:serviceId")
  .patch(
    auth("admin"),
    validate(serviceValidation.updateService),
    serviceController.updateService
  );
router.route("/:serviceId").get(auth("employee"), serviceController.getService);
router.route("/").get(auth("admin"), serviceController.getServices);
router
  .route("/categories/all")
  .get(auth("admin"), serviceController.getAllServiceCategories);
router
  .route("/category/:category")
  .get(auth("admin"), serviceController.getServicesByCategory);
router
  .route("/homepage/:subCategory")
  .get(auth("admin"), serviceController.getServicesBySubCategory);
  
module.exports = router;
