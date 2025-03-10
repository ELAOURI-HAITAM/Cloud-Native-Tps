const express = require("express");
const recette_router = express();
recette_router.use(express.json());
const recettes = require("../Models/RecetteModel");
const { find } = require("../Models/ChefModel");
recette_router.get("/", (request, response) => {
  response.send("welcom to recette route");
});

//GET ALL RECETTES
recette_router.get("/all", async (request, response) => {
  const find_all = await recettes.find();
  response.send(find_all);
});

//GET ALL RECETTES NAMES
recette_router.get("/names", async (request, response) => {
  const recettes_names = await recettes.find({}, { recette_name: 1, _id: 0 });
  response.send(recettes_names);
});

//ADD NEW RECETTE
recette_router.post("/add", async (request, response) => {
  const { recette_name, recette_description, price, chef_id, restaurant_id } =
    request.body;
  const add_recette = await recettes.insertOne({
    recette_name: recette_name,
    recette_description: recette_description,
    price: price,
    chef_id: chef_id,
    restaurant_id: restaurant_id,
  });
  response.send(add_recette);
});

//UPDATE RECETTE

recette_router.put("/update/:name", async (request, response) => {
  const { recette_name, recette_description, price , chef_id, restaurant_id } = request.body;
  const update_recette = await recettes.updateOne(
    { recette_name: request.params.name },
    {
      $set: {
        recette_name: recette_name,
        recette_description: recette_description,
        price: price,
        chef_id : chef_id,
        restaurant_id : restaurant_id
      },
    }
  );
  response.send(update_recette);
});
// DELETE RECETTE
recette_router.delete("/delete/:name", async (request, response) => {
  const delete_recette = await recettes.deleteOne(
    { recette_name: request.params.name },
    {}
  );
  response.send(delete_recette);
});
module.exports = recette_router;
