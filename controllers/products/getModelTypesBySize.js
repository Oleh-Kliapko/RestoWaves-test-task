const {
  product: { Product },
} = require('../../models');

module.exports = async (req, res) => {
  const { size } = req.query;

  const allProducts = await Product.find({});

  // Find the model type within all product models and get model types with certain foot size
  const modelTypes = allProducts.flatMap(model =>
    model.productModelTypes.filter(modelType =>
      modelType.sizes.some(item => item.toString() === size),
    ),
  );

  res.status(200).json({ modelTypes, totalCount: modelTypes.length });
};
