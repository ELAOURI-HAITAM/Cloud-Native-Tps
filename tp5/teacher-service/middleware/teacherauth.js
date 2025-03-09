const jwt = require("jsonwebtoken");
const VerifyToken = require("../../course-service/middleware/courseauth");
const secret = "MY_SECRET";
const verifyToken = (request, response, next) => {
  const token = request.header("Authorization");
  if (!token) {
    response.status(400).json({ message: "token are necessary !!" });
  }
  try {
    const verify = jwt.verify(token.split(" ")[1], secret);
    request.teacher = verify;
    next();
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};
module.exports = VerifyToken