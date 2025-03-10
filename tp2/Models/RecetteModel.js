const { Schema, default: mongoose } = require("mongoose");

const recetteSchema = new Schema({
    recette_name : String ,
    recette_description : String ,
    price : Number,
    chef_id : {
        type : mongoose.Types.ObjectId,
        ref : "Chef"
      },
    restaurant_id : {
        type : mongoose.Types.ObjectId ,
        ref : "Restaurant"
    }
})

const recettemodel = mongoose.model("Recette" , recetteSchema)
module.exports = recettemodel;