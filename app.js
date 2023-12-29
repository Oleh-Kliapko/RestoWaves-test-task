const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { productsRouter, categoriesRouter } = require('./routes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// Set up middleware for logging, CORS, JSON parsing
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Define the routes for handling product-related requests
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Define a 404 handler for unknown routes
app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Define an error handler for server errors
app.use((err, _, res, __) => {
  const { status = 500, message = 'Server error. Please try later on' } = err;
  res.status(status).json({ message });
});

module.exports = app;
