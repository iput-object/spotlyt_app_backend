const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
