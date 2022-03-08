//////////////
// IMPORTS //
////////////
const mongoose = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
const filter = {
  type: String,
  require: true,
  index: true,
  unique: true,
  sparse: true,
};
const usersSchema = new mongoose.Schema({
  username: filter,
  password: filter,
  displayName: filter,
  facebookId: filter,
  googleId: filter,
  twitterId: filter,
});
const UsersModel = mongoose.model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel };
