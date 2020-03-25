const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require('../models/user');

router.post("/signup", (req, res, next) => {
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

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) {
      return res.status(400).json({
        message: "Auth Failed!!"
      });
    }
    return bcrypt.compare(req.body.password, user.password); //compare password
  })
  .then(result => {
    if(!result) {
      return res.status(400).json({
        message: "Auth Failed!!"
      });
    }
    //valid password
    const token = jwt.sign({email: user.email, userId: user._id},
      'secret_this_should_be_longer',
      { expiresIn: "1h"}
    );
  })
  .catch(err => {
    return res.status(400).json({
      message: "Auth Failed!!"
    });
  })
});

module.exports = router;
