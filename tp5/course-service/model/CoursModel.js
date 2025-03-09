const { Schema, default: mongoose } = require("mongoose");
const courSchema = new Schema({
  id : String,
  titre: String,
  professor_id : String,
  description: String,
  prix: Number,
});
const coursModel = mongoose.model("Course" , courSchema)
module.exports = coursModel
