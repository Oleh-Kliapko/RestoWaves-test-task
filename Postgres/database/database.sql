CREATE TABLE model (
  id SERIAL PRIMARY KEY,
  model VARCHAR(255) NOT NULL,
  brand VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategory (
  id SERIAL PRIMARY KEY,
  subcategory_name VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category_subcategory (
  category_id INTEGER REFERENCES category(id),
  subcategory_id INTEGER REFERENCES subcategory(id),
  PRIMARY KEY (category_id, subcategory_id)
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  price NUMERIC DEFAULT 0,
  sizes INTEGER[],
  model_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES model(id)
);

CREATE TABLE product_categories (
  product_id INTEGER,
  category_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE product_subcategories (
  product_id INTEGER,
  subcategory_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);