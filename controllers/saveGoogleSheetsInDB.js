const {
  product: { Product },
} = require('../models');

const { fetchDataFromGoogleSheets } = require('../services');

module.exports = async () => {
  const products = await fetchDataFromGoogleSheets();

  await Product.deleteMany({});

  for (const brandData of products) {
    const brand = brandData[Object.keys(brandData)[0]];

    const brandDocument = new Product({
      brand: Object.keys(brandData)[0],
      brandModels: brand.map(model => ({
        model: model.name,
        code: model.code,
        price: model.price,
        sizes: model.sizes,
      })),
    });

    await brandDocument.save();
    console.log(`${products.length} products were downloaded successfully`);
  }
};
