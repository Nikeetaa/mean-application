const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/user');

router.post("signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
     .then(response => {
       res.status(200).json({
         message: "User created successfully!!",
         data: response
       });
     })
     .catch(err => {
        res.status(500).json({
          error: err
        })
     });
  });
});

module.exports = router;
