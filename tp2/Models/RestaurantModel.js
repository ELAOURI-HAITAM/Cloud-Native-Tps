const { Schema, default: mongoose } = require("mongoose");

const restauarantSchema = new Schema(
    {
        name : String ,
        categorie : String ,
        opening_year : Number,
    }
)

const restauarantModel = mongoose.model("Restaurant" , restauarantSchema)
module.exports = restauarantModel