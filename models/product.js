const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError, validationRules } = require('../helpers');

// Define Joi validation rules for model type
const validationAddModelType = Joi.object({
  product: Joi.string()
    .description('Product type name')
    .min(2)
    .max(50)
    .required()
    .messages({
      ...validationRules('Product type name').textRules,
      ...validationRules('Product type name').commonRules,
    }),
  code: Joi.string()
    .description('Code of model type')
    .min(1)
    .max(50)
    .required()
    .messages({
      ...validationRules('Code of model type').textRules,
      ...validationRules('Code of model type').commonRules,
    }),
  price: Joi.number()
    .description('Price')
    .min(1)
    .max(100000)
    .messages(validationRules('Price').numberRules),
  sizes: Joi.array().items(
    Joi.number()
      .description('Size of model type')
      .min(10)
      .max(99)
      .messages(validationRules('Size of model type').numberRules),
  ),
  categories: Joi.array().items(
    Joi.string()
      .description('Category of product')
      .length(24)
      .messages(validationRules('Category ID').textRules),
  ),
  subcategories: Joi.array().items(
    Joi.string()
      .description('Subcategory of product')
      .length(24)
      .messages(validationRules('Subcategory ID').textRules),
  ),
});

const validationUpdateModelType = Joi.object({
  product: Joi.string()
    .description('Product type name')
    .min(2)
    .max(50)
    .messages(validationRules('Product type name').textRules),
  price: Joi.number()
    .description('Price')
    .min(1)
    .max(100000)
    .messages(validationRules('Price').numberRules),
  categories: Joi.array().items(
    Joi.string()
      .description('Category of product')
      .length(24)
      .messages(validationRules('Category ID').textRules),
  ),
  subcategories: Joi.array().items(
    Joi.string()
      .description('Subcategory of product')
      .length(24)
      .messages(validationRules('Subcategory ID').textRules),
  ),
});

// Define Joi validation rules for model
const validationAddModel = Joi.object({
  productModel: Joi.string()
    .description('Product model name')
    .min(2)
    .max(50)
    .required()
    .messages({
      ...validationRules('Product model name').textRules,
      ...validationRules('Product model name').commonRules,
    }),
  brand: Joi.string()
    .description('Brand name')
    .min(2)
    .max(50)
    .messages(validationRules('Brand name').textRules),
  productModelTypes: Joi.array().items(validationAddModelType),
});

const validationUpdateModel = Joi.object({
  productModel: Joi.string()
    .description('Product model name')
    .min(2)
    .max(50)
    .messages(validationRules('Product model name').textRules),
  brand: Joi.string()
    .description('Brand name')
    .min(2)
    .max(50)
    .messages(validationRules('Brand name').textRules),
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
      default: 0,
    },
    sizes: [Number],
    categories: [{ _id: Schema.Types.ObjectId, categoryName: String }],
    subcategories: [{ _id: Schema.Types.ObjectId, subcategoryName: String }],
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
  },
  { versionKey: false, timestamps: true },
);

// Attach a post-save middleware to handle Mongoose errors
productModelSchema.post('save', handleMongooseError);

// Create a Mongoose model
const Product = model('product', productModelSchema);

module.exports = {
  Product,
  validationAddModel,
  validationUpdateModel,
  validationAddModelType,
  validationUpdateModelType,
};
