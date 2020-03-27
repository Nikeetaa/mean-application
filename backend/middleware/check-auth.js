const jwt = require("jsonwebtoken");


//function executed on incoming request
module.exports = (req, res, next) => {
  try {
    //token it attached in header of every request in authorization key
    //token can be passed through url parameters also as, <url>?token=<token>
    //example, authorization: "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1];

    //verify token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    }
    next(); //execution continues
  }
  catch (error) {
    res.status(400).json({
      message: "You are not authenticated!!"
    });
  }
}
