const router = require('express').Router();

const ctrl = require('../controllers');
const {
  checkPageLimit,
  isValidID,
  checkRequestBody,
  validateBody,
} = require('../middlewares');
const {
  product: { validationName },
} = require('../models');

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

router.patch(
  '/:id',
  checkRequestBody, // check that request contains a body
  isValidID,
  validateBody(validationName), // validate body using Joi
  ctrl.updateProductModelNameById,
);

module.exports = router;
