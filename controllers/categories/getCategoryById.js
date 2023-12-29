const {
  category: { Category },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  await notFoundMsg(category, id, 'Category');

  res.status(200).json(category);
};
