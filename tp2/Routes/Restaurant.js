const express = require("express");
const restrouter = express();
const restaurants = require("../Models/RestaurantModel");
const chefs = require("../Models/ChefModel");
const recettes = require("../Models/RecetteModel");
restrouter.get("/", (request, response) => {
  response.send("welcom to restaurant route");
});
restrouter.get("/all", async (request, response) => {
  const find_all = await restaurants.find({});
  response.send(find_all);
});

restrouter.get("/chefs/:restname", async (request, response) => {
  try {
    const rest = await restaurants.findOne({ name: request.params.restname });
    if (!rest) {
      return response.status(404).json({ message: "No Restaurant :(" });
    }
    const chefs_infos = await chefs.find({ restaurant_id: rest._id });
    if (chefs_infos.length < 1) {
      return response.status(404).json({ message: "No Chefs To Display :(" });
    }
    response.status(200).json({ chefs: chefs_infos });
  } catch (err) {
    response
      .status(500)
      .json({ ERROR: "ERROR 505 INTERNAL SERVER ERROR :(", err });
  }
});
restrouter.get("/recipes/:restname", async (request, response) => {
  try {
    const rest_name = await restaurants.findOne({
      name: request.params.restname,
    });
    if (!rest_name) {
      return response.status(404).json({ message: "Restaurant Not Found :(" });
    }
    const recettes_infos = await recettes.find({
      restaurant_id: rest_name._id,
    });
    if (recettes_infos.length < 1) {
      return response.status(404).json({ message: "Recettes Not Found :(" });
    }
    response.status(200).json({ recettes: recettes_infos });
  } catch (err) {
    response.status(500).json({ ERROR: "ERROR 505 INTERNAL SERVER ERROR :(" });
  }
});

restrouter.get("/listCategorie/:categorie", async (request, response) => {
  try {
    const categorie = request.params.categorie;
    const find_restaurants = await restaurants.find({
      categorie: categorie,
    });
    response.status(200).json({ restauarants: find_restaurants });
  } catch (err) {
    response.status(500).json({
      ERROR: "ERROR 505 INTERNAL SERVER ERROR :(",
    });
  }
});

restrouter.get("/:annee1/:annee2", async (request, response) => {
  const year1 = request.params.annee1;
  const year2 = request.params.annee2;
  const opening_rests = await restaurants.find(
    { opening_year: { $gt: year1, $lt: year2 } },
    {}
  );

  response.send(opening_rests);
});

restrouter.post("/add", async (request, response) => {
  try {
    const { name, categorie, opening_year } = request.body;
    if (!name || !categorie || !opening_year) {
      return response.status(400).json({
        ERROR: "Plese Fill All The Fields",
      });
    }

    const add_restauarnts = await restaurants.insertOne({
      name: name,
      categorie: categorie,
      opening_year: opening_year,
    });
    response
      .status(200)
      .json({
        message: "restuarant added successufly :)",
        restaurant: add_restauarnts,
      });
  } catch (err) {
    response.status(500).json({ ERROR: "ERROR 505 INTERNAL SERVER ERROR :(" , err});
  }
});


restrouter.put("/update/:restname" , async (request , response) =>
{
    const {name , categoire , opening_year} = request.body
    const update_rest = await restaurants.updateOne({"name" : request.params.restname} , {$set : {
        "name" : name ,
        categorie : categoire ,
        opening_year : opening_year
    }})
    response.json({message : 'restuarant updated successufly :)' , 
        restaurant : update_rest
    })
})


restrouter.delete("/delete/:restname" , async (request , response) =>
{
    const delete_rest = await restaurants.deleteOne({"name" : request.params.restname})
response.json({message : "restaurant deleted successufly :)" , restaurant : delete_rest})
})



module.exports = restrouter;
