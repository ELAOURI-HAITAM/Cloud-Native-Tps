const { Schema, default: mongoose } = require("mongoose");

const chefSchema = new Schema({
  nom: String,
  age: Number,
  date_naissance: String,
  email : String ,
  password : String,
  restaurant_id: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
  },
});
const ChefModel = mongoose.model("Chef", chefSchema);
module.exports = ChefModel;
