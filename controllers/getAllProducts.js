const {
  product: { Product },
} = require('../models');
const { HttpError } = require('../helpers');

module.exports = async (req, res) => {
  const { page, limit } = req.query;
  const skip = Math.max((parseInt(page, 10) - 1) * parseInt(limit, 10), 0);

  const allProducts = await Product.find({});

  if (!allProducts) {
    throw HttpError(404, 'Products not found');
  }

  // create response with pagination
  let paginatedProducts = [];

  if (skip >= 0) {
    paginatedProducts = allProducts.slice(skip, skip + parseInt(limit, 10));
  } else {
    paginatedProducts = allProducts;
  }

  res.status(200).json({
    products: paginatedProducts,
    totalCount: allProducts.length || 0,
  });
};
