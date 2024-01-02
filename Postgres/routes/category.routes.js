const router = require('express').Router();

const { categoryController } = require('../controllers');

const { checkPageLimit, checkRequestBody } = require('../../middlewares');

// Define routes and associated middleware
router.get('/', checkPageLimit, categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/', checkRequestBody, categoryController.addCategory);

router.patch('/:id', checkRequestBody, categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
