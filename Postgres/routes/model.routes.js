const router = require('express').Router();

const { modelController } = require('../controllers');

const { checkPageLimit, checkRequestBody } = require('../../middlewares');

// Define routes and associated middleware
router.get('/', checkPageLimit, modelController.getModels);

router.get('/:id', modelController.getModelById);

router.post('/', checkRequestBody, modelController.addModel);

router.patch('/:id', checkRequestBody, modelController.updateModel);

router.delete('/:id', modelController.deleteModel);

module.exports = router;
