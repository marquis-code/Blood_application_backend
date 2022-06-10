const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your firstname"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your lastname"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "Email is required"],
    match: [
      /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
    maxlength: 200,
    unique: true,
  },
  intrest: {
    type: String,
    required: [true, "Please provide your intrest"],
  },
  role: {
    type: Number,
    default: 0,
  },
  accessToken: {
    type: String,
    default: '',
  },
  refreshToken: {
      type : String,
      default : ''
  },
  resetToken: {
      type : String,
      default : ''
  },
  resetExpire: {
      type : Date,
      default : ''
  },
}, {
    timestamps : true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;