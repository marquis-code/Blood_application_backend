// require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const REFRESH_TOKEN_SECRET = "annie_blog_refreshToken_2022"
const ACCESS_TOKEN_SECRET = "annie_blog_accessToken_2022"
const REFRESH_JWT_EXPIRE= "3h"
const ACCESS_JWT_EXPIRE= "1h"

authRouter.post('/signup', async(req, res) => {
  const {firstName, lastName, email, password, intrest} = req.body;
  try {
      const dbUser = await User.findOne({ email });
      if (dbUser) {
       return res.status(409).json({ errorMessage: "User Already Exist" });
      }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({firstName, lastName, email, password : hashedPassword, intrest});
    await user.save();
    return res.status(201).json({ successMessage: "Registeration success, Please sign in", user});
  } catch (error) {
    return res.status(500).json({ errorMessage: "Registeration Failed"});
    // console.log(error.message)
  }
})

authRouter.post("/signin", async(req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    const {firstName, lastName, role} = user;
    if (!user) {return res.status(401).json({ errorMessage: "Invalid Login Credentials" })}

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {return res.status(401).json({ errorMessage: "Invalid Login Credentials" })}

    const jwtPayload = {userId : user._id};

    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_JWT_EXPIRE,
    });

    const refreshToken = jwt.sign(
      jwtPayload,
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_JWT_EXPIRE }
    );
   await User.updateOne({_id : user._id}, {$set : {refreshToken}});
    res.cookie('jwt', refreshToken, {httpOnly : true, maxAge : 24 * 60 * 60 * 1000, secure : true})
    res.status(200).json({ accessToken,  firstName, lastName, role, email });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Login Failed" });
    // console.log(error.message)
  }
});

authRouter.get('/refresh', async(req, res) => {
   const cookie = req.cookies;
   console.log(cookie);
   const refreshToken = cookie.jwt;
   if(!cookie?.jwt){ return res.status(401).json({errorMessage : 'No Token found'}) }
   const user = await User.findOne({refreshToken});
  if (!user) {
    return res.status(401).json({ errorMessage: "Invalid User" });
  }
  try {
      const jwtPayload = { userId: user._id };

   jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
     if(error || user._id != decoded.userId){return res.status(403).json({errorMessage : 'Invalid Token, Please Login'})}
     const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET, {expiresIn : ACCESS_JWT_EXPIRE});

     return res.status(200).json({accessToken, successMessage : 'New Access token has been created'})
   })
  
  } catch (error) {
     return res.status(500).json({ errorMessage : 'Something went wrong'})
  }
})



module.exports = authRouter;