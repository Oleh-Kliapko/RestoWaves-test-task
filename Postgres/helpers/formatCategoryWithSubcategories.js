module.exports = rows => {
  const categoryMap = new Map();

  rows.forEach(row => {
    const categoryId = row.id;
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        category_name: row.category_name,
        subcategories: [],
      });
    }

    if (row.subcategory_id !== null) {
      categoryMap.get(categoryId).subcategories.push({
        id: row.subcategory_id,
        subcategory_name: row.subcategory_name,
      });
    }
  });

  return Array.from(categoryMap.values());
};
