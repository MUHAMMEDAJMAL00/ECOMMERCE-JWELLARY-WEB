const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: String,
  phone: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false, // Users are not admin by default
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
