const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true, 
    unique : true
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
