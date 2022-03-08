//////////////
// IMPORTS //
////////////
const mongoose = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
const usersSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  displayName: { type: String, required: true },
  facebookId: { type: String, unique: true },
  googleId: { type: String, unique: true },
  twitterId: { type: String, unique: true },
});
const UsersModel = mongoose.model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel };
