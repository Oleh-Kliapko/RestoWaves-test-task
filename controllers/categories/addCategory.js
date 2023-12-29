const {
  category: { Category },
} = require('../../models');
const { HttpError } = require('../../helpers');

module.exports = async (req, res) => {
  const { categoryName } = req.body;

  const existedCategory = await Category.findOne({
    categoryName: categoryName.trim(),
  });

  if (existedCategory) {
    throw HttpError(409, `Category: ${categoryName} has already existed`);
  }

  const newCategory = await Category.create({ ...req.body });

  return res.status(201).json(newCategory);
};
