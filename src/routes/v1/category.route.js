const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { categoryController } = require("../../controllers");
const { categoryValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin"),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(auth("common"), categoryController.getCategories);

router
  .route("/all")
  .get(auth("common"), categoryController.getAllCategories);

router
  .route("/:categoryId")
  .get(auth("common"), categoryController.getCategory)
  .patch(
    auth("admin"),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(auth("admin"), categoryController.deleteCategory);

module.exports = router;