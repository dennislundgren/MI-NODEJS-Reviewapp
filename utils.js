//////////////
// IMPORTS //
////////////
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//////////////
// HASHING //
////////////
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update("password").digest("base64");
  return hash;
};
const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hash;
};
const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};
const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};
///////////////////
// GENERATE KEY //
/////////////////
const key = crypto.randomBytes(32).toString("hex");
console.log(key);
//////////////
// EXPORTS //
////////////
module.exports = {
  getHashedPassword,
  generateAuthToken,
  hashPassword,
  comparePassword,
};
