const mongoose = require("mongoose");
const port = 4000;
const dbname = "tp5cn";
const mongo_url = "mongodb://localhost:27017";
const express = require("express");
const studentroute = require("./routes/student");
const app = express();
app.use(express.json())
mongoose.connect(`${mongo_url}/${dbname}`);
const database = mongoose.connection;
database.on("error", (err) => console.log("Connxion Failed :(", err));

database.once("open", () => console.log("Connected to Database  :)"));

app.use('/student' ,studentroute )
app.listen(port, () => console.log("server is running on port", port));
