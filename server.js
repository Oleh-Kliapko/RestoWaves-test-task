const mongoose = require('mongoose');
const cron = require('node-cron');
mongoose.set('strictQuery', true);
require('dotenv').config();

const app = require('./app');
const http = require('http').Server(app);

const { DB_HOST, PORT = 5000 } = process.env;

const { saveGoogleSheetsInDB } = require('./controllers');

mongoose
  .connect(DB_HOST)
  .then(() => {
    // Schedule a cron job to periodically save data from Google Sheets to the database (once an hour)
    cron.schedule('0 * * * *', saveGoogleSheetsInDB);

    // Start the HTTP server after successful database connection
    http.listen(PORT, () => {
      console.log('Database connection successful on port:', PORT);
    });
  })
  .catch(error => {
    console.log(`Database could not connect. Error: ${error.message}`);
    process.exit(1);
  });
