/* eslint-disable no-unused-vars */

const express = require('express');

const productRoutes = require('./routes/product')
const userRoutes = require('./routes/auth')

const bodyParser = require('body-parser')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', productRoutes);
app.use('/', userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => console.log('listening to http://localhost:' + process.env.PORT))
  }).catch(err => {
    console.log(err)
  });
