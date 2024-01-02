const { db } = require('../config');
const { HttpError, notFoundMsg, ctrlWrapper } = require('../../helpers');

class ProductController {
  constructor() {
    this.addProduct = ctrlWrapper(this.addProduct.bind(this));
    this.getProducts = ctrlWrapper(this.getProducts.bind(this));
    this.getProductById = ctrlWrapper(this.getProductById.bind(this));
    this.getProductsByModelId = ctrlWrapper(
      this.getProductsByModelId.bind(this),
    );
    this.getProductsBySize = ctrlWrapper(this.getProductsBySize.bind(this));
    this.updateProduct = ctrlWrapper(this.updateProduct.bind(this));
    this.deleteProduct = ctrlWrapper(this.deleteProduct.bind(this));
  }

  async addProduct(req, res) {
    const {
      product_name,
      code,
      price,
      sizes,
      model_id,
      categories_id = [],
      subcategories_id = [],
    } = req.body;

    if (!product_name || !code || !price || !sizes || !model_id) {
      throw HttpError(
        400,
        'Missing required fields: product_name, code, price, sizes, model_id',
      );
    }

    // Check if product with the same code already exists
    const existingCode = await db.query(
      'SELECT * FROM product WHERE code = $1',
      [code.trim()],
    );
    if (existingCode.rows.length > 0) {
      throw HttpError(409, `Product with code '${code}' already exists`);
    }

    // Check if model with ID exists
    const modelExists = await db.query('SELECT * FROM model WHERE id = $1', [
      model_id,
    ]);
    await notFoundMsg(modelExists.rows.length, model_id, 'Model');

    // Check if categories with IDs exist
    const categoriesExist = await db.query(
      'SELECT * FROM category WHERE id = ANY($1::int[])',
      [categories_id],
    );
    if (categoriesExist.rows.length !== categories_id.length) {
      throw HttpError(400, 'One or more categories not found');
    }

    // Check if subcategories with IDs exist
    const subcategoriesExist = await db.query(
      'SELECT * FROM subcategory WHERE id = ANY($1::int[])',
      [subcategories_id],
    );
    if (subcategoriesExist.rows.length !== subcategories_id.length) {
      throw HttpError(400, 'One or more subcategories not found');
    }

    // Add new product in table PRODUCT
    const productResult = await db.query(
      'INSERT INTO product (product_name, code, price, sizes, model_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_name.trim(), code.trim(), price, sizes, model_id],
    );

    const productId = productResult.rows[0].id;

    // Add connection between product and categories
    if (categories_id && categories_id.length > 0) {
      const categoryValues = categories_id
        .map(category_id => `(${productId}, ${category_id})`)
        .join(',');
      await db.query(`
        INSERT INTO product_categories (product_id, category_id)
        VALUES ${categoryValues};
      `);
    }

    // Add connection between product and subcategories
    if (subcategories_id && subcategories_id.length > 0) {
      const subcategoryValues = subcategories_id
        .map(subcategory_id => `(${productId}, ${subcategory_id})`)
        .join(',');
      await db.query(`
        INSERT INTO product_subcategories (product_id, subcategory_id)
        VALUES ${subcategoryValues};
      `);
    }

    // Get categories and subcategories from created product
    const categoriesResult = await db.query(
      `
      SELECT c.id AS category_id, c.category_name, s.id AS subcategory_id, s.subcategory_name
      FROM product_categories pc
      INNER JOIN category c ON pc.category_id = c.id
      LEFT JOIN product_subcategories ps ON pc.product_id = ps.product_id
      LEFT JOIN subcategory s ON ps.subcategory_id = s.id
      WHERE pc.product_id = $1;
    `,
      [productId],
    );

    // Form and return new product with all fields
    const categories = categoriesResult.rows.reduce((acc, row) => {
      const category = acc.find(c => c.id === row.category_id);

      if (category) {
        category.subcategories.push({
          id: row.subcategory_id,
          subcategory_name: row.subcategory_name,
        });
      } else {
        acc.push({
          id: row.category_id,
          category_name: row.category_name,
          subcategories: row.subcategory_id
            ? [
                {
                  id: row.subcategory_id,
                  subcategory_name: row.subcategory_name,
                },
              ]
            : [],
        });
      }

      return acc;
    }, []);

    const productWithCategories = {
      ...productResult.rows[0],
      categories,
    };

    res.status(201).json(productWithCategories);
  }

  async getProducts(req, res) {}

  async getProductById(req, res) {}

  async getProductsByModelId(req, res) {}

  async getProductsBySize(req, res) {}

  async updateProduct(req, res) {}

  async deleteProduct(req, res) {
    const { id } = req.params;

    const existingProduct = await db.query(
      'SELECT * FROM product where id=$1',
      [id],
    );
    await notFoundMsg(existingProduct.rows.length, id, 'Product');

    await db.query('DELETE FROM product_categories WHERE product_id = $1', [
      id,
    ]);

    await db.query('DELETE FROM product_subcategories WHERE product_id = $1', [
      id,
    ]);

    await db.query('DELETE FROM product WHERE id = $1', [id]);

    res.status(204).json();
  }
}

module.exports = new ProductController();
