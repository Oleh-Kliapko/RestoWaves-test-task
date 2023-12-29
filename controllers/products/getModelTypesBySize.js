const {
  product: { Product },
} = require('../../models');

module.exports = async (req, res) => {
  const { size } = req.query;

  const allProducts = await Product.find({});

  const productModels = allProducts.flatMap(model =>
    model.productModelTypes.filter(modelType =>
      modelType.sizes.some(item => item.toString() === size),
    ),
  );

  res.status(200).json({ productModels, totalCount: productModels.length });
};
