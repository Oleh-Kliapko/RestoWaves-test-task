const {
  product: { Product },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

  await notFoundMsg(product, id, 'Product model');

  return res.status(200).json(product);
};
