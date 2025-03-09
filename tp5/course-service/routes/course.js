const express = require("express");
const courseroute = express();
courseroute.use(express.json());
const VerifyToken = require("../middleware/courseauth"); 
courseroute.use(VerifyToken)
const courses = require("../model/CoursModel");
const coursModel = require("../model/CoursModel");
const { default: mongoose } = require("mongoose");
courseroute.get("/", (request, response) => {
  response.send("welcom to course route :)");
});

courseroute.get("/all", async (request, response) => {
  const find_all = await courses.find();
  response.status(200).send(find_all);
});

courseroute.post("/add", async (request, response) => {
  const { id , titre, description, professor_id, prix } = request.body;
  const new_course = await courses.insertOne({
    id : id,
    titre: titre,
    professor_id: professor_id,
    description: description,
    prix: prix,
  });
  response
    .status(201)
    .json({ message: "course added successufly :)", course: new_course });
});

courseroute.put("/update/:id", async (request, response) => {
  const {titre, professor_id, description, prix } = request.body;
  const modify_course = await courses.updateOne(
    { id: request.params.id },
    {
      $set: {
        
        titre: titre,
        professor_id: professor_id,
        description: description,
        prix: prix,
      },
    }
  );
  response
    .status(200)
    .json({
      message: "course modified successufly :) ",
      course: modify_course,
    });
});

courseroute.delete("/delete/:id", async (request, response) => {
  const delete_course = await courses.deleteOne({ id: request.params.id }, {});
  response.json({ message: "course deleted successufly :)", delete_course });
});

courseroute.get("/search", async (request, response) => {
  const { titre } = request.query;
  try
  {
    const search = await courses.find({ titre: new RegExp(titre) });
    response.status(200).json({message : "course found  " , course : search});
  }
  catch(err)
  {
response.status(400).json({message : err})
  }
});

courseroute.get("/cours/:course_id" , async (request , response) =>
{
  const course_id = request.params.course_id
 try
 {
  const find_course = await courses.findOne({id : course_id})
  if(!find_course)
  {
    return response.status(404).json({message : "course not found"})
  }
  response.send(find_course)
 }
 catch(err)
 {
response.status(500).json({message : err.message})
 }
})



module.exports = courseroute;
