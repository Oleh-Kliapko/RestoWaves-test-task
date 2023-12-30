const { ctrlWrapper } = require('../helpers');

module.exports = {
  // controllers to work with product model and its types collection
  getAllProducts: ctrlWrapper(require('./products/getAllProducts')),
  getProductModelById: ctrlWrapper(require('./products/getProductModelById')),
  getModelTypeById: ctrlWrapper(require('./products/getModelTypeById')),
  getModelTypesBySize: ctrlWrapper(require('./products/getModelTypesBySize')),
  addProductModel: ctrlWrapper(require('./products/addProductModel')),
  addModelType: ctrlWrapper(require('./products/addModelType')),
  updateModelById: ctrlWrapper(require('./products/updateModelById')),
  updateModelTypeById: ctrlWrapper(require('./products/updateModelTypeById')),

  // controllers to work with categories and subcategories collection
  addCategory: ctrlWrapper(require('./categories/addCategory')),
  updateCategoryById: ctrlWrapper(require('./categories/updateCategoryById')),
  deleteCategoryById: ctrlWrapper(require('./categories/deleteCategoryById')),
  getAllCategories: ctrlWrapper(require('./categories/getAllCategories')),
  getCategoryById: ctrlWrapper(require('./categories/getCategoryById')),
};
