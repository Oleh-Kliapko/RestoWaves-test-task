const mongoose = require('mongoose');

const {
  product: { Product },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { modelTypeId } = req.query;

  const product = await Product.findById(id);

  await notFoundMsg(product, id, 'Product Brand');

  const model = product.productModelTypes.find(model =>
    model._id.equals(new mongoose.Types.ObjectId(modelTypeId)),
  );

  await notFoundMsg(model, modelTypeId, 'Model of brand');

  res.status(200).json(model);
};
