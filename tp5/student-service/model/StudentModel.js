const { Schema, default: mongoose } = require("mongoose");
const studentSchema = new Schema({
  id : String,
  nom: String,
  email : String ,
  cours : [{type : String}],
  
});
const studentModel = mongoose.model("Student" , studentSchema)
module.exports = studentModel
