const Pool = require('pg').Pool;
const express = require('express');

const app = express();

const HOST =
  app.get('env') === 'development'
    ? 'localhost'
    : 'restowaves-backend.onrender.com';

const { PASSWORD_POSTGRES } = process.env;

const pool = new Pool({
  user: 'postgres',
  password: PASSWORD_POSTGRES,
  host: HOST,
  port: 5432,
  database: 'restowaves',
});

module.exports = pool;
