const {
  product: { Product },
} = require('../../models');

const { fetchDataFromGoogleSheets } = require('../../services');

module.exports = async () => {
  // Fetch data from Google Sheets
  const products = await fetchDataFromGoogleSheets();

  // Delete all existing documents in collection
  await Product.deleteMany({});

  // Iterate through the fetched data and save it to Mongo DB collection
  for (const product of products) {
    const productModel = product[Object.keys(product)[0]];

    const productDoc = new Product({
      productModel: Object.keys(product)[0],
      productModelTypes: productModel.map(model => ({
        product: model.name,
        code: model.code,
        price: model.price,
        sizes: model.sizes,
      })),
    });

    await productDoc.save();
    console.log(`${products.length} products were downloaded successfully`);
  }
};
