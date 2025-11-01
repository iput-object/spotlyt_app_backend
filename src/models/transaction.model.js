const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const transactionSchema = mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["order", "withdraw", "refund"],
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "failed", "declined"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    gateway: {
      type: String,
      default: "",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
