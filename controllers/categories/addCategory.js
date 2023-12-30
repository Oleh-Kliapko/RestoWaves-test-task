const {
  category: { Category },
} = require('../../models');
const { HttpError } = require('../../helpers');

module.exports = async (req, res) => {
  const { categoryName } = req.body;

  // Check if a category with the same name already exists
  const existedCategory = await Category.findOne({
    categoryName: categoryName.trim(),
  });
  if (existedCategory) {
    throw HttpError(409, `Category: ${categoryName} has already existed`);
  }

  // If the category does not exist, create a new category
  const newCategory = await Category.create({ ...req.body });

  return res.status(201).json(newCategory);
};
