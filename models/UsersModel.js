//////////////
// IMPORTS //
////////////
const { Schema, model } = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
const usersSchema = new Schema(
  { displayName: { type: String, required: true } },
  { strict: false }
);
const UsersModel = model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel };
