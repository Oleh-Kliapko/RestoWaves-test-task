const { ctrlWrapper } = require('../helpers');

module.exports = {
  saveGoogleSheetsInDB: ctrlWrapper(require('./products/saveGoogleSheetsInDB')),
  getAllProducts: ctrlWrapper(require('./products/getAllProducts')),
  getProductModelById: ctrlWrapper(require('./products/getProductModelById')),
  getModelTypeById: ctrlWrapper(require('./products/getModelTypeById')),
  getModelTypesBySize: ctrlWrapper(require('./products/getModelTypesBySize')),
  updateProductModelNameById: ctrlWrapper(
    require('./products/updateProductModelNameById'),
  ),

  addCategory: ctrlWrapper(require('./categories/addCategory')),
  updateCategoryById: ctrlWrapper(require('./categories/updateCategoryById')),
  deleteCategoryById: ctrlWrapper(require('./categories/deleteCategoryById')),

  getAllCategories: ctrlWrapper(require('./categories/getAllCategories')),
  getCategoryById: ctrlWrapper(require('./categories/getCategoryById')),
};
