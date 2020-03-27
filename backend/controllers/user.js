
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
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
          error: {
            message: "Invalid Cretendials!!"
          }
        })
     });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) {
      return res.status(400).json({
        message: "Auth Failed!!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password); //compare password
  })
  .then(result => {
    if(!result) {
      return res.status(400).json({
        message: "Auth Failed!!"
      });
    }

    //valid password
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h"}
    );
    res.status(200).json({
      token: token,
      expiresIn: "3600", //seconds
      userId: fetchedUser._id
    })
  })
  .catch(err => {
    return res.status(400).json({
      message: "Auth Failed!!" + err
    });
  })
}

