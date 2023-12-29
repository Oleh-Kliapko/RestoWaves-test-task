const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError, validationRules } = require('../helpers');

// Define Joi validation rules for brand
const validationName = Joi.object({
  productModel: Joi.string()
    .description('Product model name')
    .min(2)
    .max(50)
    .messages(validationRules('Product model name').textRules),
});

// Define Mongoose schema for the model
const productSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: [Number],
  },
  { versionKey: false, timestamps: true },
);

// Define Mongoose schema for the brand, which includes an array of models
const productModelSchema = new Schema(
  {
    productModel: {
      type: String,
      required: true,
    },
    productModelTypes: [productSchema],
    brand: {
      type: String,
      default: '',
    },
    categories: [{ _id: Schema.Types.ObjectId, categoryName: String }],
    subcategories: [{ _id: Schema.Types.ObjectId, subcategoryName: String }],
  },
  { versionKey: false, timestamps: true },
);

// Attach a post-save middleware to handle Mongoose errors
productModelSchema.post('save', handleMongooseError);

// Create a Mongoose model
const Product = model('product', productModelSchema);

module.exports = {
  Product,
  validationName,
};
