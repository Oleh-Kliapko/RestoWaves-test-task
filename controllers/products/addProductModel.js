const {
  product: { Product },
  category: { Category },
} = require('../../models');
const { HttpError } = require('../../helpers');
const checkExistingCategoriesIDs = require('../../helpers/checkExistingCategoriesIDs');

module.exports = async (req, res) => {
  const productModelData = req.body;
  const { productModelTypes, ...restFields } = productModelData;

  const productModelTypesWithData = [];

  for (const modelType of productModelTypes) {
    const { code, categories = [], subcategories = [] } = modelType;

    // check if there is a model type in DB with this code (must be unique)
    if (code) {
      const isCodeExist = await Product.exists({
        'productModelTypes.code': code.trim(),
      });
      if (isCodeExist) {
        throw HttpError(
          409,
          `Model type with code: ${code} has already existed`,
        );
      }
    }

    // check if there are categories and subcategories IDs
    const { categoryData, subcategoryData } = await checkExistingCategoriesIDs(
      categories,
      subcategories,
    );

    // push new model type with request data in array
    const productModelTypeWithData = {
      ...modelType,
      categories: categoryData.map(category => ({
        _id: category._id,
        categoryName: category.categoryName,
      })),
      subcategories: subcategoryData.map(category => ({
        _id: category.subcategories[0]._id,
        subcategoryName: category.subcategories[0].subcategoryName,
      })),
    };

    productModelTypesWithData.push(productModelTypeWithData);
  }

  // form product model with new model types
  const newProductModel = {
    ...restFields,
    productModelTypes: productModelTypesWithData,
  };

  // create new product model
  const createdProductModel = await Product.create(newProductModel);

  return res.status(201).json(createdProductModel);
};
