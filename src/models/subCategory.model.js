const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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

subCategorySchema.plugin(toJSON);
subCategorySchema.plugin(paginate);

const subCategory = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategory;
