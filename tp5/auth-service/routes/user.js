const express = require("express");
const userroute = express();
userroute.use(express.json());
const users = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/userauth");
const secret = "MY_SECRET";
userroute.get("/", (request, response) => {
  response.send("welcom to user route :)");
});

userroute.get("/all", async (request, response) => {
  const find_all = await users.find();
  response.send(find_all);
});

userroute.post("/register", async (request, response) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return response.status(400).json({ message: "Please Fill All Fields" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const check_user = await users.findOne({ email: email });

  if (check_user) {
    return response.status(400).json({ message: "user already exists !!" });
  }
  try {
    const new_user = users.insertOne({
      name: name,
      email: email,
      password: hashedpassword,
    });
    response
      .status(201)
      .json({ message: "user added successufly :)", user: new_user });
  } catch (error) {
    response.send(error);
  }
});

userroute.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const check_user = await users.findOne({ email: email });
  if (!check_user) {
    response.status(400).json({ message: "email or password are incorrect!!" });
  }

  const checkpassword = await bcrypt.compare(password, check_user.password);
  if (!checkpassword) {
    response.status(400).json({ message: "email or password are incorrect!!" });
  }

  const token = jwt.sign(
    { name: check_user.name, email: check_user.email, id: check_user.user_id },
    secret,
    { expiresIn: "10d" }
  );
  response.status(200).json({ message: "login successufly ", token: token });
});

userroute.get("/profile",verifyToken, async (request, response) => {
response.status(200).json({user : request.user})
});
module.exports = userroute;
