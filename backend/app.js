const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

//connect to db
mongoose.connect("mongodb+srv://nikeetaa:NJSwo4NuApv5MHir@cluster0-szl7u.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

//middleware for parsing json data
app.use(bodyParser.json());

//middleware to parse urlencoded data
app.use(bodyParser.urlencoded({extended: false}));

//to make images folder statically accessible
app.use('/images', express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);


module.exports = app;
