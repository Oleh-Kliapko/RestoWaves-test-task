const mongoose = require('mongoose');

const {
  product: { Product },
} = require('../models');
const { notFoundMsg } = require('../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { modelId } = req.query;

  const product = await Product.findById(id);

  await notFoundMsg(product, id, 'Product Brand');

  const model = product.brandModels.find(model =>
    model._id.equals(new mongoose.Types.ObjectId(modelId)),
  );

  await notFoundMsg(model, modelId, 'Model of brand');

  res.status(200).json(model);
};
