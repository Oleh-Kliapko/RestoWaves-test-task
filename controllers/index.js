const { ctrlWrapper } = require('../helpers');

module.exports = {
  saveGoogleSheetsInDB: ctrlWrapper(require('./saveGoogleSheetsInDB')),
  getAllProducts: ctrlWrapper(require('./getAllProducts')),
  getBrandById: ctrlWrapper(require('./getBrandById')),
  getModelById: ctrlWrapper(require('./getModelById')),
  getModelBySize: ctrlWrapper(require('./getModelBySize')),
  updateBrandNameById: ctrlWrapper(require('./updateBrandNameById')),
};
