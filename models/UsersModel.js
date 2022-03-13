//////////////
// IMPORTS //
////////////
const { Schema, model } = require("mongoose");
///////////////////////
// MODELS & SCHEMAS //
/////////////////////
/*
 * Var tvungen att göra schemat dynamiskt i och med de olika tredjepartsinloggningar som implementerades.
 * Alternativ i 'real world' scenario vore att användaren får registreras automatiskt via information
 * givet från tredje part.
 */
const usersSchema = new Schema(
  { displayName: { type: String, required: true } },
  { strict: false }
);
const UsersModel = model("Users", usersSchema);
//////////////
// EXPORTS //
////////////
module.exports = { UsersModel };
