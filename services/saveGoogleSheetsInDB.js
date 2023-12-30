const {
  product: { Product },
} = require('../models');

const { fetchDataFromGoogleSheets } = require('.');

module.exports = async () => {
  // Fetch data from Google Sheets
  const products = await fetchDataFromGoogleSheets();

  // Iterate through the fetched data and save it to Mongo DB collection
  for (const product of products) {
    const modelTypes = product[Object.keys(product)[0]]; // get array of model types
    const productModel = Object.keys(product)[0]; // get name of product model

    // check that product model is exist
    const existingProductModel = await Product.findOne({
      productModel,
    });

    // If the product model does not exist, create a new product model
    if (!existingProductModel) {
      const newProductModel = new Product({
        productModel,
        productModelTypes: modelTypes.map(model => ({
          product: model.name,
          code: model.code,
          price: model.price,
          sizes: model.sizes,
        })),
      });

      await newProductModel.save();
    }

    // If the product model exists, update the model type data if "code" is found or add a new product model type
    if (existingProductModel) {
      for (const modelType of modelTypes) {
        const { code, name: modelTypeName, price, sizes } = modelType;

        const existingModelType = existingProductModel.productModelTypes.find(
          modelType => modelType.code === code,
        );

        if (existingModelType) {
          // Update existing product model type
          existingModelType.product = modelTypeName;
          existingModelType.price = price;
          existingModelType.sizes = sizes;
        } else {
          // Add a new product model type
          existingProductModel.productModelTypes.push({
            product: modelTypeName,
            code,
            price,
            sizes,
          });
        }
      }

      // Save the changes
      await existingProductModel.save();
    }
  }
  console.log(`${products.length} products were downloaded successfully`);
};
