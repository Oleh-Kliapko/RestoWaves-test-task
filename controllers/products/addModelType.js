const {
  product: { Product },
} = require('../../models');
const { HttpError, notFoundMsg } = require('../../helpers');
const checkExistingCategoriesIDs = require('../../helpers/checkExistingCategoriesIDs');

module.exports = async (req, res) => {
  const { id } = req.params;
  const modelTypeData = req.body;
  const { code, categories, subcategories, ...restFields } = modelTypeData;

  const product = await Product.findById(id);

  await notFoundMsg(product, id, 'Product model');

  // check if there is a model type in DB with this code (must be unique)
  const existingModelType = product.productModelTypes.find(
    modelType => modelType.code === code.toString(),
  );
  if (existingModelType) {
    throw HttpError(409, `Model type with code: ${code} has already existed`);
  }

  // check if there are categories and subcategories IDs
  const { categoryData, subcategoryData } = await checkExistingCategoriesIDs(
    categories,
    subcategories,
  );

  const newProductModelType = {
    ...restFields,
    code,
    categories: categoryData.map(category => ({
      _id: category._id,
      categoryName: category.categoryName,
    })),
    subcategories: subcategoryData.map(category => ({
      _id: category.subcategories[0]._id,
      subcategoryName: category.subcategories[0].subcategoryName,
    })),
  };

  product.productModelTypes.push(newProductModelType);

  await product.save();

  return res
    .status(201)
    .json({ updatedProductModel: product, newModelType: newProductModelType });
};
