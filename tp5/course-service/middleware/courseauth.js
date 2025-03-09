const jwt = require("jsonwebtoken");
const verifyToken = require("../../auth-service/middleware/userauth");
const secret = "MY_SECRET"
const VerifyToken = (request, response, next) => {
  const token = request.header("Authorization");
  if (!token) {
    return response.status(400).json({ message: "token is necessary !!" });
  }
  try {
    const verify = jwt.verify(token.split(' ')[1],secret)
    request.course = verify
    next()
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};
module.exports = VerifyToken;
