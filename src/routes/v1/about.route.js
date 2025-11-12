const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { aboutController } = require("../../controllers");
const { aboutValidation } = require("../../validations");

const router = express.Router();

router
  .route("/terms")
  .get(
    auth("admin"),

    aboutController.getTermsAndCondition
  )
  .post(
    auth("admin"),
    validate(aboutValidation.aboutContents),
    aboutController.modifyTermsAndCondition
  );

router
  .route("/about")
  .get(
    auth("admin"),

    aboutController.getAboutUs
  )
  .post(
    auth("admin"),
    validate(aboutValidation.aboutContents),
    aboutController.modifyAboutUs
  );

router
  .route("/privacy")
  .get(
    auth("admin"),

    aboutController.getPrivacyPolicy
  )
  .post(
    auth("admin"),
    validate(aboutValidation.aboutContents),
    aboutController.modifyPrivacyPolicy
  );

router
  .route("/support")
  .get(auth("admin"), aboutController.getSupport)
  .post(
    auth("admin"),
    validate(aboutValidation.aboutContents),
    aboutController.modifySupport
  );

module.exports = router;
