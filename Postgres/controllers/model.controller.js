const { db } = require('../config');
const { HttpError, notFoundMsg, ctrlWrapper } = require('../../helpers');
const { getEntriesFromBody } = require('../helpers');

class ModelController {
  constructor() {
    this.addModel = ctrlWrapper(this.addModel.bind(this));
    this.getModels = ctrlWrapper(this.getModels.bind(this));
    this.getModelById = ctrlWrapper(this.getModelById.bind(this));
    this.updateModel = ctrlWrapper(this.updateModel.bind(this));
    this.deleteModel = ctrlWrapper(this.deleteModel.bind(this));
  }

  async addModel(req, res) {
    const { model, brand = '' } = req.body;

    const newModel = await db.query(
      'INSERT INTO model (model, brand) values ($1, $2) RETURNING *',
      [model.trim(), brand.trim()],
    );
    res.json(newModel.rows[0]);
  }

  async getModels(req, res) {
    const { page, limit } = req.query;
    const skip = Math.max((parseInt(page, 10) - 1) * parseInt(limit, 10), 0);

    const models = await db.query('SELECT * FROM model');

    if (models.rows.length === 0) {
      throw HttpError(404, 'Models not found');
    }

    const { rows: allModels } = models;

    let paginatedModels = [];

    if (skip >= 0) {
      paginatedModels = allModels.slice(skip, skip + parseInt(limit, 10));
    } else {
      paginatedModels = allModels;
    }

    res.status(200).json({
      models: paginatedModels,
      totalCount: allModels.length || 0,
    });
  }

  async getModelById(req, res) {
    const { id } = req.params;

    const model = await db.query('SELECT * FROM model where id = $1', [id]);
    await notFoundMsg(model.rows.length, id, 'Product model');

    res.status(200).json(model.rows[0]);
  }

  async updateModel(req, res) {
    const { id } = req.params;

    const { values, points } = getEntriesFromBody(req.body);

    const updatedModel = await db.query(
      `UPDATE model SET ${points}, updated_at = NOW() WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, id],
    );

    await notFoundMsg(updatedModel.rows.length, id, 'Product model');

    return res.status(200).json(updatedModel.rows[0]);
  }

  async deleteModel(req, res) {
    const { id } = req.params;

    const model = await db.query('DELETE FROM model where id = $1', [id]);
    await notFoundMsg(model.rows.length, id, 'Product model');

    res.status(204).json();
  }
}

module.exports = new ModelController();
