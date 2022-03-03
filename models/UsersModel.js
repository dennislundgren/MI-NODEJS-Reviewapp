//////////////
// IMPORTS //
////////////
const mongoose = require("mongoose");
//////////&////////////
// MODELS & SCHEMAS //
//////////&//////////
const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const UsersModel = mongoose.model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = UsersModel;
