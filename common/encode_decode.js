const jwt = require("jsonwebtoken");

const encode = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const decode = async (token) => {
 // console.log(jwt.decode(token, process.env.JWT_SECRET))
  return await jwt.decode(token, process.env.JWT_SECRET);
};

module.exports = {
  encode,
  decode,
}
