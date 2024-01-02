const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const { PORT = 5000 } = process.env;
const {
  modelsRouter,
  productsRouter,
  categoriesRouter,
  subcategoriesRouter,
} = require('./Postgres/routes');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/models', modelsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/subcategories', subcategoriesRouter);
app.use('/api/products', productsRouter);

// Define a 404 handler for unknown routes
app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Define an error handler for server errors
app.use((err, _, res, __) => {
  const { status, message = 'Server error. Please try later on' } = err;

  if (!status) {
    res.status(400).json({ message: err.detail });
  } else {
    res.status(status).json({ message });
  }
});

app.listen(PORT, () => console.log('Server started on port:', PORT));
