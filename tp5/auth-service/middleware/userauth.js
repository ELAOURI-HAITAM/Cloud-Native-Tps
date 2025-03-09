const jwt = require("jsonwebtoken");
const secret = "MY_SECRET";
const verifyToken = (request, response, next) => {
  const token = request.header("Authorization");
  if (!token) {
    response.send("token not found");
  }
  try {
    const verify = jwt.verify(token.split(" ")[1], secret);
    request.user = verify
    next()
  } catch (err) {
    response.status(400).json({err})
  }
};
module.exports = verifyToken
