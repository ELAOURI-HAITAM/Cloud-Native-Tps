const express = require("express");
const teacher_route = express();
const axios = require("axios");
teacher_route.use(express.json());
const teachers = require("../model/ProfessorModel");
const VerifyToken = require("../middleware/teacherauth");
teacher_route.use(VerifyToken)
teacher_route.get("/", (request, response) => {
  response.send("welcom to teacher route :)");
});

teacher_route.get("/all", async (request, response) => {
  try {
    const find_all = await teachers.find();
    response.status(200).send(find_all);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

teacher_route.post("/add", async (request, response) => {
  const { id, name, bio, cours } = request.body;
  if (!id || !name || !bio || !cours) {
    return response
      .status(400)
      .json({ message: "please fill all the fields !!" });
  }
  try {
    const new_teacher = await teachers.insertOne({
      id: id,
      name: name,
      bio: bio,
      cours: cours,
    });
    response
      .status(200)
      .json({ message: "teacher added successufly :)", teacher: new_teacher });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

teacher_route.post(
  "/assign/:professor_id/:course_id",
  async (request, response) => {
    const professor_id = request.params.professor_id;
    const course_id = request.params.course_id;
    try {
      const token = request.header("Authorization")
      const header = {headers : {"Authorization" : token}}
      
      const course = await axios.get(
        `http://localhost:2000/course/cours/${course_id}`,header
      );
      if (!course.data) {
        return response.status(400).json({ message: "course not found :(" });
      }
      const teacher = await teachers.findOne({ id: professor_id });
      if (!teacher) {
        return response.status(400).json({ message: "teacher not found :(" });
      }
      const check_assign = await teachers.findOne({ id : professor_id,
        cours: { $in: [course_id] },
      });
      console.log(check_assign);
      
      if (check_assign) {
        return response.send("teacher already assign");
      }
      if(check_assign === null)
      {
        await teachers.updateOne(
          { id: professor_id },
          { $push: { cours: course_id } }
        );
        response
          .status(200)
          .json({ message: "teacher assign successufly :)"});
      }

    } catch (err) {
      response.status(500).json({ message: err.message });
    }
  }
);

teacher_route.get(
  "/enrolledStudents/:course_id",
  async (request, response) => {
    const course_id = request.params.course_id;
    try {
      const token = request.header("Authorization");
const header = {headers : {"Authorization" : token}}
      const student = await axios.get(`http://localhost:4000/student/all`,header);
      const student_data = student.data;

      const students = student_data.filter((st) => st.cours.includes(course_id));
      if(students)
      {
        const names = students.map((x) => x.nom)
        response.status(200).json({students  : names});
      }
    } catch (err) {
      response.status(500).json({ message: err.message });
    }
  }
);

module.exports = teacher_route;
