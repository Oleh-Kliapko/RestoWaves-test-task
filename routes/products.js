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

router.get('/', checkPageLimit, ctrl.getAllProducts);

router.get('/brandById/:id', isValidID, ctrl.getBrandById);

router.get('/getModel/:id', isValidID, ctrl.getModelById);

router.get('/bySize', ctrl.getModelBySize);

router.patch(
  '/:id',
  checkRequestBody,
  isValidID,
  validateBody(validationName),
  ctrl.updateBrandNameById,
);

module.exports = router;
