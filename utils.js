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
////////////////
//VALIDATION///
//////////////
function validateReview(review){
  let valid = true

  valid = valid && (review.title)
  valid = valid && (review.title.length > 0)
  valid = valid && (review.description)
  valid = valid && (review.description > 0)
  valid = valid && (review.rating)
  valid = valid && (review.rating > 0)
  valid = valid && (!isNaN(review.rating))

  return valid
}

///////////////////
// GENERATE KEY //
/////////////////
const key = crypto.randomBytes(32).toString("hex");
//////////////
// EXPORTS //
////////////
module.exports = {
  getHashedPassword,
  generateAuthToken,
  hashPassword,
  comparePassword,
  validateReview,
};
