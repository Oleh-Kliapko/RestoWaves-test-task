const router = require('express').Router();

const ctrl = require('../controllers');
const {
  checkPageLimit,
  isValidID,
  checkRequestBody,
  validateBody,
} = require('../middlewares');

const {
  validationAddModel,
  validationUpdateModel,
  validationAddModelType,
  validationUpdateModelType,
} = require('../models/product');

// Define routes and associated middleware
router.get(
  '/',
  checkPageLimit, // check that page or limit is number in body request
  ctrl.getAllProducts,
);

router.get(
  '/modelById/:id',
  isValidID, // check that sended ID is Object ID of Mongo DB
  ctrl.getProductModelById,
);

router.get('/getModelType/:id', isValidID, ctrl.getModelTypeById);

router.get('/bySize', ctrl.getModelTypesBySize);

// Add product model
router.post(
  '/',
  checkRequestBody, // check that request contains a body
  validateBody(validationAddModel), // validate body using Joi
  ctrl.addProductModel,
);

// Add model type inside existing product model
router.post(
  '/:id',
  checkRequestBody,
  validateBody(validationAddModelType),
  ctrl.addModelType,
);

// Update product fields (product model, brand)
router.patch(
  '/model/:id',
  checkRequestBody,
  isValidID,
  validateBody(validationUpdateModel),
  ctrl.updateModelById,
);

// Update product type fields (product name, price, category, subcategory)
router.patch(
  '/modelType/:id',
  checkRequestBody,
  isValidID,
  validateBody(validationUpdateModelType),
  ctrl.updateModelTypeById,
);

module.exports = router;
