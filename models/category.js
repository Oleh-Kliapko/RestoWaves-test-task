const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { validationRules, handleMongooseError } = require('../helpers');

// Define Joi validation rules for adding of category
const validationAddCategory = Joi.object({
  categoryName: Joi.string()
    .description('Category name')
    .min(2)
    .max(50)
    .required()
    .messages({
      ...validationRules('Category name').commonRules,
      ...validationRules('Category name').textRules,
    }),
  subcategories: Joi.array().items(
    Joi.object({
      subcategoryName: Joi.string()
        .description('Subcategory name')
        .min(2)
        .max(50)
        .required()
        .messages({
          ...validationRules('Subcategory name').commonRules,
          ...validationRules('Subcategory name').textRules,
        }),
    }),
  ),
});

// Define Joi validation rules for updating of category
const validationUpdateCategory = Joi.object({
  categoryName: Joi.string()
    .description('Category name')
    .min(2)
    .max(50)
    .messages(validationRules('Category name').textRules),
  subcategories: Joi.array().items(
    Joi.object({
      subcategoryName: Joi.string()
        .description('Subcategory name')
        .min(2)
        .max(50)
        .messages(validationRules('Subcategory name').textRules),
    }),
  ),
});

const subcategorySchema = new Schema({
  subcategoryName: {
    type: String,
    default: '',
  },
});

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      default: '',
    },
    subcategories: [subcategorySchema],
  },
  { versionKey: false, timestamps: true },
);

categorySchema.post('save', handleMongooseError);
const Category = model('category', categorySchema);

module.exports = {
  Category,
  validationAddCategory,
  validationUpdateCategory,
};
