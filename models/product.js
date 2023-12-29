const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError, validationRules } = require('../helpers');

const validationName = Joi.object({
  brand: Joi.string()
    .description('Brand name')
    .min(2)
    .max(50)
    .messages(validationRules('Brand name').textRules),
});

const modelSchema = new Schema(
  {
    model: {
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

const brandSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    brandModels: [modelSchema],
  },
  { versionKey: false, timestamps: true },
);

brandSchema.post('save', handleMongooseError);
const Product = model('product', brandSchema);

module.exports = {
  Product,
  validationName,
};
