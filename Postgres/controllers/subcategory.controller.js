const { db } = require('../config');
const { HttpError, notFoundMsg, ctrlWrapper } = require('../../helpers');

class SubcategoryController {
  constructor() {
    this.addSubcategory = ctrlWrapper(this.addSubcategory.bind(this));
    this.getSubcategories = ctrlWrapper(this.getSubcategories.bind(this));
    this.getSubcategoryById = ctrlWrapper(this.getSubcategoryById.bind(this));
    this.updateSubcategory = ctrlWrapper(this.updateSubcategory.bind(this));
    this.deleteSubcategory = ctrlWrapper(this.deleteSubcategory.bind(this));
  }

  async addSubcategory(req, res) {
    const { subcategory_name } = req.body;

    const newSubcategory = await db.query(
      'INSERT INTO subcategory (subcategory_name) values ($1) RETURNING *',
      [subcategory_name.trim()],
    );
    res.json(newSubcategory.rows[0]);
  }

  async getSubcategories(req, res) {
    const { page, limit } = req.query;
    const skip = Math.max((parseInt(page, 10) - 1) * parseInt(limit, 10), 0);

    const subcategories = await db.query('SELECT * FROM subcategory');

    if (subcategories.rows.length === 0) {
      throw HttpError(404, 'Subcategories not found');
    }

    const { rows: allSubCategories } = subcategories;

    let paginatedSubCategories = [];

    if (skip >= 0) {
      paginatedSubCategories = allSubCategories.slice(
        skip,
        skip + parseInt(limit, 10),
      );
    } else {
      paginatedSubCategories = allSubCategories;
    }

    res.status(200).json({
      subcategories: paginatedSubCategories,
      totalCount: allSubCategories.length || 0,
    });
  }

  async getSubcategoryById(req, res) {
    const { id } = req.params;

    const subcategory = await db.query(
      'SELECT * FROM subcategory where id = $1',
      [id],
    );
    await notFoundMsg(subcategory.rows.length, id, 'Subcategory');

    res.status(200).json(subcategory.rows[0]);
  }

  async updateSubcategory(req, res) {
    const { id } = req.params;

    const { subcategory_name } = req.body;

    const updatedSubcategory = await db.query(
      'UPDATE subcategory SET subcategory_name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [subcategory_name, id],
    );
    await notFoundMsg(updatedSubcategory.rows.length, id, 'Subcategory');

    return res.status(200).json(updatedSubcategory.rows[0]);
  }

  async deleteSubcategory(req, res) {
    const { id } = req.params;

    const deleteCategories = await db.query(
      'DELETE FROM category_subcategory WHERE subcategory_id = $1',
      [id],
    );

    const deleteSubcategory = await db.query(
      'DELETE FROM subcategory WHERE id = $1',
      [id],
    );

    const deletedRows = deleteSubcategory.rowCount + deleteCategories.rowCount;
    await notFoundMsg(deletedRows, id, 'Subcategory');

    res.status(204).json();
  }
}

module.exports = new SubcategoryController();
