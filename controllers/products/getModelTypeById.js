const mongoose = require('mongoose');

const {
  product: { Product },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { modelTypeId } = req.query;

  // Find the product model by id and check if the model exists
  const product = await Product.findById(id);
  await notFoundMsg(product, id, 'Product model');

  // Find the model type within the product's model types and check if the model type exists
  const modelType = product.productModelTypes.find(modelType =>
    modelType._id.equals(new mongoose.Types.ObjectId(modelTypeId)),
  );
  await notFoundMsg(modelType, modelTypeId, 'Type of product model');

  res.status(200).json(modelType);
};
