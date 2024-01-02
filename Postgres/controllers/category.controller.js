const { db } = require('../config');
const { HttpError, notFoundMsg, ctrlWrapper } = require('../../helpers');
const { formatCategoryWithSubcategories } = require('../helpers');

class CategoryController {
  constructor() {
    this.addCategory = ctrlWrapper(this.addCategory.bind(this));
    this.getCategories = ctrlWrapper(this.getCategories.bind(this));
    this.getCategoryById = ctrlWrapper(this.getCategoryById.bind(this));
    this.updateCategory = ctrlWrapper(this.updateCategory.bind(this));
    this.deleteCategory = ctrlWrapper(this.deleteCategory.bind(this));
  }

  async addCategory(req, res) {
    const { category_name, subcategory_ids = [] } = req.body;

    // Check if category with the same name already exists
    const existingCategory = await db.query(
      'SELECT * FROM category WHERE category_name = $1',
      [category_name.trim()],
    );

    if (existingCategory.rows.length > 0) {
      throw HttpError(
        409,
        `Category with name '${category_name}' already exists`,
      );
    }

    // Check if all subcategories exist
    for (const subcategoryId of subcategory_ids) {
      const existingSubcategory = await db.query(
        'SELECT * FROM subcategory WHERE id = $1',
        [subcategoryId],
      );

      await notFoundMsg(
        existingSubcategory.rows.length,
        subcategoryId,
        'Subcategory',
      );
    }

    // Create new category
    const newCategory = await db.query(
      'INSERT INTO category (category_name) VALUES ($1) RETURNING *',
      [category_name.trim()],
    );

    const categoryId = newCategory.rows[0].id;

    // Add connections to category_subcategory
    for (const subcategoryId of subcategory_ids) {
      await db.query(
        'INSERT INTO category_subcategory (category_id, subcategory_id) VALUES ($1, $2)',
        [categoryId, subcategoryId],
      );
    }

    // Get the list of subcategories for the response
    const subcategories = await db.query(
      'SELECT s.* FROM subcategory s JOIN category_subcategory cs ON s.id = cs.subcategory_id WHERE cs.category_id = $1',
      [categoryId],
    );

    // Return the category along with its subcategories
    res.json({
      ...newCategory.rows[0],
      subcategories: subcategories.rows,
    });
  }

  async getCategories(req, res) {
    const { page, limit } = req.query;
    const skip = Math.max((parseInt(page, 10) - 1) * parseInt(limit, 10), 0);

    const categories = await db.query(`
      SELECT category.id, category.category_name, subcategory.id AS subcategory_id, subcategory.subcategory_name
      FROM category
      LEFT JOIN category_subcategory ON category.id = category_subcategory.category_id
      LEFT JOIN subcategory ON category_subcategory.subcategory_id = subcategory.id;
  `);

    if (categories.rows.length === 0) {
      throw HttpError(404, 'Categories not found');
    }

    const { rows: allCategories } = categories;

    const categoriesWithSubcategories =
      formatCategoryWithSubcategories(allCategories);

    let paginatedCategories = [];

    if (skip >= 0) {
      paginatedCategories = categoriesWithSubcategories.slice(
        skip,
        skip + parseInt(limit, 10),
      );
    } else {
      paginatedCategories = categoriesWithSubcategories;
    }

    res.status(200).json({
      categories: paginatedCategories,
      totalCount: paginatedCategories.length || 0,
    });
  }

  async getCategoryById(req, res) {
    const { id } = req.params;

    const category = await db.query(
      `
      SELECT 
        category.id,
        category.category_name,
        subcategory.id AS subcategory_id,
        subcategory.subcategory_name
      FROM 
        category
      LEFT JOIN 
        category_subcategory ON category.id = category_subcategory.category_id
      LEFT JOIN 
        subcategory ON category_subcategory.subcategory_id = subcategory.id
      WHERE
        category.id = $1`,
      [id],
    );

    const categoryWithSubcategories = formatCategoryWithSubcategories(
      category.rows,
    );

    const result = categoryWithSubcategories[0];
    await notFoundMsg(result, id, 'Category');

    res.status(200).json(result);
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { category_name, subcategory_ids = [] } = req.body;

    if (category_name) {
      const existingCategory = await db.query(
        'SELECT * FROM category WHERE id = $1',
        [id],
      );
      await notFoundMsg(existingCategory.rows.length, id, 'Category');
    }

    await db.query('UPDATE category SET category_name = $1 WHERE id = $2', [
      category_name,
      id,
    ]);

    if (subcategory_ids && subcategory_ids.length > 0) {
      await db.query(
        'DELETE FROM category_subcategory WHERE category_id = $1',
        [id],
      );

      // Add new subcategory for category
      for (const subcategoryId of subcategory_ids) {
        const existingSubcategory = await db.query(
          'SELECT * FROM subcategory WHERE id = $1',
          [subcategoryId],
        );
        await notFoundMsg(
          existingSubcategory.rows.length,
          subcategoryId,
          'Subcategory',
        );

        await db.query(
          'INSERT INTO category_subcategory (category_id, subcategory_id) VALUES ($1, $2)',
          [id, subcategoryId],
        );
      }
    }

    const updatedCategoryQuery = await db.query(
      `
      SELECT 
        category.id,
        category.category_name,
        subcategory.id AS subcategory_id,
        subcategory.subcategory_name
      FROM 
        category
      LEFT JOIN 
        category_subcategory ON category.id = category_subcategory.category_id
      LEFT JOIN 
        subcategory ON category_subcategory.subcategory_id = subcategory.id
      WHERE
        category.id = $1
    `,
      [id],
    );

    const updatedCategory = formatCategoryWithSubcategories(
      updatedCategoryQuery.rows,
    );

    res.status(200).json(updatedCategory);
  }

  async deleteCategory(req, res) {
    const { id } = req.params;

    const deleteSubcategories = await db.query(
      'DELETE FROM category_subcategory WHERE category_id = $1',
      [id],
    );

    const deleteCategory = await db.query(
      'DELETE FROM category WHERE id = $1',
      [id],
    );

    const deletedRows = deleteCategory.rowCount + deleteSubcategories.rowCount;
    await notFoundMsg(deletedRows, id, 'Category');

    res.status(204).json();
  }
}

module.exports = new CategoryController();
