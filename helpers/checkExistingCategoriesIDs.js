const {
  category: { Category },
} = require('../models');
const { HttpError } = require('.');

module.exports = async (categories, subcategories) => {
  const categoryPromises = categories.map(categoryId =>
    Category.findById(categoryId),
  );
  const subcategoryPromises = subcategories.map(subcategoryId =>
    Category.findOne(
      { 'subcategories._id': subcategoryId },
      { 'subcategories.$': 1 },
    ),
  );

  const [categoryData, subcategoryData] = await Promise.all([
    Promise.all(categoryPromises),
    Promise.all(subcategoryPromises),
  ]);

  const areAllCategoriesExist = categoryData.every(
    category => category !== null,
  );
  const areAllSubcategoriesExist = subcategoryData.every(
    subcategory => subcategory !== null,
  );

  if (!areAllCategoriesExist || !areAllSubcategoriesExist) {
    throw HttpError(
      404,
      'One or more categories or subcategories do not exist',
    );
  }

  return { categoryData, subcategoryData };
};
