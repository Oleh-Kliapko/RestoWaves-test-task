const router = require('express').Router();

const { subcategoryController } = require('../controllers');

const { checkPageLimit, checkRequestBody } = require('../../middlewares');

// Define routes and associated middleware
router.get('/', checkPageLimit, subcategoryController.getSubcategories);

router.get('/:id', subcategoryController.getSubcategoryById);

router.post('/', checkRequestBody, subcategoryController.addSubcategory);

router.patch('/:id', checkRequestBody, subcategoryController.updateSubcategory);

router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
