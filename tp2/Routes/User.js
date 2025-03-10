const express = require("express");
const userrouter = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "MY_SECRET";

userrouter.use(express.json());
require("dotenv").config();
const users = require("../Models/UserModel");
const verifytoken = require("../middleware/auth");
userrouter.post("/register", async (request, response) => {
  
    const { nom, prenom, email, password } = request.body;

    const hashedpassword = await bcrypt.hash(password, 10);
    const check_user = await users.findOne({ email: email });
  
    if (check_user) {
      return response
        .status(400)
        .json({ message: "user already exists :(" });
    }
    try{

    
      const new_user = users.insertOne({
        nom: nom,
        prenom: prenom,
        email: email,
        password: hashedpassword,
      });
      response
        .status(201)
        .json({ message: "user added successufly :)", user: new_user });
  }
   
   catch (error) {
    response.send(error)
  }
});


userrouter.post('/login' , async (request , response) =>
{
    const {email , password} = request.body
    const check_user = await users.findOne({email : email})
    const password_check = await bcrypt.compare(password , check_user.password)
    if(!check_user || !password_check)
        {
            return response.send("user not found")
        }
    
    const token = jwt.sign({id : check_user._id , email : check_user.email} ,JWT_SECRET , {expiresIn : "10d"} )
    response.status(200).json({message : "login successufly :) " , token : token})
    
})


userrouter.get('/protected' , verifytoken , (request , response) =>
{
    response.send({message : "you have access" , user : request.user})
})
module.exports = userrouter;
