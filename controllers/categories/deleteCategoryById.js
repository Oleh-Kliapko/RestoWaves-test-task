const {
  category: { Category },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;

  // If the category exists and remove it
  const category = await Category.findByIdAndDelete(id);
  await notFoundMsg(category, id, 'Category');

  return res.status(204).json();
};
