const {
  category: { Category },
} = require('../../models');
const { notFoundMsg } = require('../../helpers');

module.exports = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  await notFoundMsg(category, id, 'Category');

  return res.status(200).json(category);
};
