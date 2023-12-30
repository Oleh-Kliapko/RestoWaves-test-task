const express = require('express');

const ctrl = require('../controllers');
const { validateBody, isValidID, checkRequestBody } = require('../middlewares');
const {
  category: { validationAddCategory, validationUpdateCategory },
} = require('../models');

const router = express.Router();

// Define routes and associated middleware
router.get('/', ctrl.getAllCategories);
router.get('/:id', isValidID, ctrl.getCategoryById);

router.post(
  '/',
  checkRequestBody,
  validateBody(validationAddCategory),
  ctrl.addCategory,
);

router.patch(
  '/:id',
  checkRequestBody,
  isValidID,
  validateBody(validationUpdateCategory),
  ctrl.updateCategoryById,
);

router.delete('/:id', isValidID, ctrl.deleteCategoryById);

module.exports = router;
