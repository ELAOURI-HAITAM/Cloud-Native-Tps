const express = require("express");
const router = express();
const chefs = require("../Models/ChefModel");
const recettes = require("../Models/RecetteModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MY_SECRET";

router.use(express.json());

router.get("/", (request, response) => {
  response.send("welcom to chef route");
});

//GET ALL DATA
router.get("/all", (request, response) => {
  chefs.find().then((ch) => {
    response.json(ch);
  });
});

//GET ALL CHEFS NAMES
router.get("/names", async (request, response) => {
  const names = await chefs.find({}, { nom: 1, _id: 0 });
  response.send(names);
});
const li = [];
li.push(chefs);
// GET NUMBER OF RECETTES BY THE NAME OF CHEF
router.get("/recettes", async (request, response) => {
  const number_of_recettes = await recettes.aggregate([
    {
      $group: {
        _id: "$chef_id",
        nombre_de_recette: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "chefs",
        localField: "_id",
        foreignField: "_id",
        as: "chef_info",
      },
    },
    {
      $unwind: "$chef_info",
    },
    {
      $project: {
        chef_name: "$chef_info.nom",
        nombre_de_recette: 1,
      },
    },
  ]);

  response.send(number_of_recettes);
});

// ADD NEW CHEF
router.post("/add", async (request, response) => {
  try {
    const { nom, date_naissance, age, email, password, restaurant_id } =
      request.body;
    if (
      !nom ||
      !age ||
      !date_naissance ||
      !restaurant_id ||
      !email ||
      !password
    ) {
      return response.status(400).json({
        "ERROR : ": "Please Fill All The Fields !!",
      });
    }

    const addnew = await chefs.insertOne({
      nom: nom,
      age: age,
      date_naissance: date_naissance,
      email: email,
      password: password,
      restaurant_id: restaurant_id,
    });
    response.status(201).json({
      message: "chef added successufly :)",
      "the new chef : ": addnew,
    });
  } catch (err) {
    response.status(500).json({
      "ERROR : ": "ERROR 505 INTERNAL SERVER ERROR :(",
      err,
    });
  }
});
//MODIFY CHEF
router.put("/update/:name", async (request, response) => {
  const { nom, age, date_naissance, email, password, restaurant_id } =
    request.body;
  const update_chef = await chefs.updateOne(
    { nom: request.params.name },
    {
      $set: {
        nom: nom,
        age: age,
        date_naissance: date_naissance,
        email: email,
        password: password,
        restaurant_id: restaurant_id,
      },
    }
  );
  response.send(update_chef);
});
//DELETE CHEF
router.delete("/delete/:name", async (request, response) => {
  const delete_chef = await chefs.deleteOne({ nom: request.params.name }, {});
  response.send(delete_chef);
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const chefs_list = await chefs.find();
  const authentification = chefs_list.find(
    (ch) => ch.email === email && ch.password === password
  );
  if (authentification) {
    const token = jwt.sign(
      { id: authentification._id, email: authentification.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    response.status(200).json({ message: "login successuffly", token: token });
  } else {
    response.send("incorrect");
  }
});

router.post("/test", async (request, response) => {
  const token = request.header("Authorization");
  if (!token) {
    return response.send("incorrect token");
  }
  try {
    const verify = jwt.verify(token.split(" ")[1], JWT_SECRET);
    if(verify)
    {
      response.send("correct")
      
    }
  } catch (err) {
    response.status(400).json({message : "invalid token!!"})
  }
});
module.exports = router;
