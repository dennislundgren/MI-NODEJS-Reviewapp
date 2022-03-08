//////////////
// IMPORTS //
////////////
const mongoose = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
const usersSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  displayName: { type: String },
  facebookId: { type: String },
  googleId: { type: String },
  twitterId: { type: String },
});
const UsersModel = mongoose.model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel };
