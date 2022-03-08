//////////////
// IMPORTS //
////////////
const mongoose = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
});
const googleSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true, unique: true },
});
const twitterSchema = new mongoose.Schema({
  twitterId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true, unique: true },
});
const facebookSchema = new mongoose.Schema({
  facebookId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true, unique: true },
});
const UsersModel = mongoose.model("Users", usersSchema);
const GooglesModel = mongoose.model("GoogleUsers", googleSchema);
const FacebooksModel = mongoose.model("FacebookUsers", facebookSchema);
const TwittersModel = mongoose.model("TwitterUsers", twitterSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel, GooglesModel, FacebooksModel, TwittersModel };
