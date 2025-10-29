const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { subCategoryController } = require("../../controllers");
const { subCategoryValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin"),
    validate(subCategoryValidation.createSubCategory),
    subCategoryController.createSubCategory
  )
  .get(auth("common"), subCategoryController.getSubCategories);

router
  .route("/all")
  .get(auth("common"), subCategoryController.getAllSubCategories);

router
  .route("/category/:categoryId")
  .get(auth("common"), subCategoryController.getSubCategoriesByCategory);

router
  .route("/:subCategoryId")
  .get(auth("common"), subCategoryController.getSubCategory)
  .patch(
    auth("admin"),
    validate(subCategoryValidation.updateSubCategory),
    subCategoryController.updateSubCategory
  )
  .delete(auth("admin"), subCategoryController.deleteSubCategory);

module.exports = router;