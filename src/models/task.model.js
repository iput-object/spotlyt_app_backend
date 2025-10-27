const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const taskSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    screenshotUrl: {
      type: {
        url: String,
        path: String,
      },
    },
    status: {
      type: String,
      enum: ["reserved", "submitted", "approved", "rejected", "expired"],
      default: "reserved",
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedReason: {
      type: String,
      default: null,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
