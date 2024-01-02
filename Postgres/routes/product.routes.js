const router = require('express').Router();

const { productController } = require('../controllers');

const { checkPageLimit, checkRequestBody } = require('../../middlewares');

// Define routes and associated middleware
router.post('/', checkRequestBody, productController.addProduct);

router.get('/', checkPageLimit, productController.getProductsByModelId);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
