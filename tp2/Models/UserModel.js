const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema(
    {
        nom : {type :  String , minlength : 5},
        prenom : {type : String , minlength : 5} ,
        email : {type : String , required : true , unique : true},
        password : {type : String}
    }


)

const usermodel = mongoose.model("User" , userSchema)
module.exports = usermodel