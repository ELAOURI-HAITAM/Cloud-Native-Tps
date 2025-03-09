const { Schema, default: mongoose } = require("mongoose");
const techerSchema = new Schema({
  id : String,
  name: String,
  bio : String ,
  cours : [{type : String}]
});
const teacherModel = mongoose.model("Teacher" , techerSchema)
module.exports = teacherModel
