const mongoose = require('mongoose');

const {
  product: { Product },
  category: { Category },
} = require('../../models');
const { HttpError, notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { modelTypeId } = req.query;
  const { categories = [], subcategories = [] } = req.body;
  const newModelTypeData = req.body;

  // Validate the existence of specified categories and transform them into the required format
  if (categories.length > 0) {
    const categoryPromises = categories.map(categoryId =>
      Category.findById(categoryId),
    );

    const categoryData = await Promise.all(categoryPromises);

    const areAllCategoriesExist = categoryData.every(
      category => category !== null,
    );

    if (!areAllCategoriesExist) {
      throw HttpError(404, 'One or more categories do not exist');
    }

    newModelTypeData.categories = categoryData.map(category => ({
      _id: category._id,
      categoryName: category.categoryName,
    }));
  }

  // Validate the existence of specified subcategories and transform them into the required format
  if (subcategories.length > 0) {
    const subcategoryPromises = subcategories.map(subcategoryId =>
      Category.findOne(
        { 'subcategories._id': subcategoryId },
        { 'subcategories.$': 1 },
      ),
    );

    const subcategoryData = await Promise.all(subcategoryPromises);

    const areAllSubcategoriesExist = subcategoryData.every(
      subcategory => subcategory !== null,
    );
    if (!areAllSubcategoriesExist) {
      throw HttpError(404, 'One or more subcategories do not exist');
    }

    newModelTypeData.subcategories = subcategoryData.map(category => ({
      _id: category.subcategories[0]._id,
      subcategoryName: category.subcategories[0].subcategoryName,
    }));
  }

  // Retrieve product model and model type
  const product = await Product.findById(id);
  await notFoundMsg(product, id, 'Product model');

  const modelType = product.productModelTypes.find(model =>
    model._id.equals(new mongoose.Types.ObjectId(modelTypeId)),
  );
  await notFoundMsg(modelType, modelTypeId, 'Type of product model');

  // Update model type data and save changes to the Database
  Object.assign(modelType, newModelTypeData);
  await product.save();

  return res
    .status(200)
    .json({ updatedProductModel: product, updatedModelType: modelType });
};
