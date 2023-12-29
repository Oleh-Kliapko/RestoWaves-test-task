const {
  product: { Product },
} = require('../models');

module.exports = async (req, res) => {
  const { size } = req.query;

  const allProducts = await Product.find({});

  const models = allProducts.flatMap(product =>
    product.brandModels.filter(model =>
      model.sizes.some(item => item.toString() === size),
    ),
  );

  res.status(200).json({ models, totalCount: models.length });
};
