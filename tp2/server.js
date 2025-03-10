require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 9999;
const URL_MONGOOSE = process.env.URL_MONGOOSE || "mongodb://localhost:27017";
const DBNAME = process.env.DBNAME || "tp2_cloud_native";
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
const mongoose = require("mongoose");
mongoose.connect(`${URL_MONGOOSE}/${DBNAME}`);
const db = mongoose.connection;
db.on("error", (err) => console.log(`Error Connecting To DataBase ${err}`));
db.once("open", () => console.log("Connected To DataBase"));
const chefroutes = require("./Routes/Chef");
const recetteroutes = require("./Routes/Recette");
const restauarntroutes = require("./Routes/Restaurant");
const userrouter = require("./Routes/User");
app.use("/chef", chefroutes);
app.use("/recette", recetteroutes);
app.use("/restaurant", restauarntroutes);
app.use("/auth" ,userrouter )



app.listen(PORT, () => console.log(`Server Is Runing On Port ${PORT}`));
