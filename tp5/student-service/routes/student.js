const express = require("express");
const studentroute = express();
studentroute.use(express.json());
const students = require("../model/StudentModel");
const axios = require("axios");
const VerifyToken = require("../middleware/studentauth");
studentroute.use(VerifyToken)
studentroute.get("/", (request, response) => {
  response.send("welcom to student route :)");
});
studentroute.get("/all", async (request, response) => {
  const find_all = await students.find();
  response.status(200).send(find_all);
});

studentroute.post("/add", async (request, response) => {
  const { id , nom, email, cours } = request.body;
  if (!id || !nom || !email || !cours) {
    response.status(400).json({ message: "please fill all fields" });
  }
  try {
    const new_student = await students.insertOne({
      id : id,
      nom: nom,
      email: email,
      cours: cours,
    });
    response
      .status(201)
      .json({ message: "student added successufly :)", student: new_student });
  } catch (err) {
    response.status(500).json({ ERROR: err });
  }
});

studentroute.post('/enroll/:student_id/:course_id' , async(request , response) =>
{
  const course_id = request.params.course_id
  const student_id = request.params.student_id
  try{
const token = request.header("Authorization");
const header = {headers : {"Authorization" : token}}
const course = await axios.get(`http://localhost:2000/course/cours/${course_id}`,header )
const courdata = course.data
if(!courdata)
  {
    return response.send("course not found ")
  }  
  const check_student = await students.findOne({id : student_id})
  if(!check_student)
  { response.status(400).json({message : "student not found"})
    return
  }
  const check_inscription = await students.findOne({ id : student_id , cours : {$in : [course_id]}})
  if(check_inscription)
  {
return response.json({message : "student already inscript"})
  }
 const inscription = await students.updateOne({id : student_id} , {$push : {cours : course_id}})
 response.status(200).json({message : "student isncript successufly :)"})
}
  catch(err)
  {
    response.status(500).json({message : err.message})
  }
})

studentroute.get('/enrolledCourses/:student_id' , async(request , response) =>
{
  const student_id = request.params.student_id
  try
  {
const student = await students.findOne({id : student_id})
if(!student)
{
  return response.status(400).json({message : "student not found"})

}
const token = request.header("Authorization");
const header = {headers : {"Authorization" : token}}
const coursedata = await axios.get(`http://localhost:2000/course/all`,header)
const ids = coursedata.data.map((c) => c.id)
const courses = student.cours.filter(i => ids.includes(i) )
if(courses)
  {
  const find_courses = await students.find({id : student_id} , {cours : courses})
  response.send(find_courses)
}
  }
  catch(err)
  {
    response.status(500).json({message : err.message})
  }
})
module.exports = studentroute;
