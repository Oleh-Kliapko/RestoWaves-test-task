const {
  category: { Category },
} = require('../../models');

module.exports = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Calculate the number of documents to skip based on pagination
  const skip = (page - 1) * limit;

  // Use the MongoDB aggregation to retrieve categories with subcategories
  const categories = await Category.aggregate([
    {
      $project: {
        categoryName: 1,
        subcategories: 1,
      },
    },
    {
      $sort: {
        subcategories: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: parseInt(limit), // changed req.query type to number
    },
  ]);

  const totalCount = await Category.countDocuments();

  res.status(200).json({ totalCount, categories });
};
