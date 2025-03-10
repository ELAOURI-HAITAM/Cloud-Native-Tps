const express = require("express");
const authrouter = express();
authrouter.use(express.json());
const JWT_SECRET = "MY_SECRET";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifytoken = (request, response, next) => {
  const token = request.header("Authorization");
  if (!token) {
    return response
      .status(403)
      .json({ message: "Le Token est obligatoire pour l'authentification" });
  }
  try {
    const verify = jwt.verify(token.split(" ")[1], JWT_SECRET);
    request.user = verify;
    next();
  } catch (err) {
    response.status(401).json({ message: "token invalid" });
  }
};

module.exports = verifytoken;
