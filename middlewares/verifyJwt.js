const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateJwt = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {res.status(401).json({errorMessage: "No Token. Invalid user"})}

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ errorMessage: "Invalid User Id" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        errorMessage: "Invalid Token. Not Authorized to access this route",
      });
  }
};

module.exports = authenticateJwt;
// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// const authenticateJwt = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if(!authHeader){
//       return res.status(401).json({errorMessage : 'Invalid user'})
//   }

//   const token = authHeader.split(' ')[1]
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//       if(error){return res.status(403).json({errorMessage : 'Invalid token'})}
//       req.user = decoded.id;
//       next();
//   })
// }

// module.exports = authenticateJwt;
