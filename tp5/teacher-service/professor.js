const mongoose = require("mongoose");
const port = 5000;
const dbname = "tp5cn";
const mongo_url = "mongodb://localhost:27017";
const express = require("express");
const teacher_route = require("./routes/teacher");
const app = express();
app.use(express.json())
mongoose.connect(`${mongo_url}/${dbname}`);
const database = mongoose.connection;
database.on("error", (err) => console.log("Connxion Failed :(", err));

database.once("open", () => console.log("Connected to Database  :)"));

app.use('/teacher' ,teacher_route)
app.listen(port, () => console.log("server is running on port", port));
