const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const { taskController } = require("../../controllers");
const { taskValidation } = require("../../validations");
const UPLOADS_FOLDER_PROOFS = "./public/uploads/taskProofs/";

const uploadTaskProofs = userFileUploadMiddleware(UPLOADS_FOLDER_PROOFS);

const router = express.Router();

// Worker routes
router
  .route("/")
  .get(auth("employee"), taskController.queryEmployeeTasks);
router
  .route("/claim/:orderId")
  .post(auth("employee"), validate(taskValidation.claimTask), taskController.claimTask);

router
  .route("/submit/:taskId")
  .post(
    auth("employee"),
    validate(taskValidation.submitTask),
    [uploadTaskProofs.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_PROOFS),
    taskController.submitTask
  );

// Admin routes
router.route("/all").get(auth("admin"), validate(taskValidation.getTasks), taskController.queryTasks);
router
  .route("/:taskId")
  .get(auth("common"), validate(taskValidation.getTask), taskController.getTaskById);
router
  .route("/approve/:taskId")
  .post(auth("admin"), validate(taskValidation.approveTask), taskController.approveTask);
router
  .route("/reject/:taskId")
  .post(auth("admin"), validate(taskValidation.rejectTask), taskController.rejectTask);
router
  .route("/close/:taskId")
  .post(auth("admin"), validate(taskValidation.closeTask), taskController.closeTask);

module.exports = router;
