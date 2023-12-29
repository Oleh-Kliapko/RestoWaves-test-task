const {
  product: { Product },
} = require('../models');
const { notFoundMsg } = require('../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  await notFoundMsg(product, id, 'Product Brand');

  res.status(200).json(product);
};
