var express = require("express");
var router = express.Router();
var fs = require("fs");

const DATA_PATH = "data/recipes.json";

/**
 * gets all the recipes
 */
 router.get("/", function (req, res, next) {
  console.log("reading file %o", DATA_PATH);

  var page = req.query.page;
  var items = req.query.items;
  var filter = req.query.filter;

  var recipes = getRecipes(parseInt(page), parseInt(items), filter);
  res.json(recipes);
});

router.post("/", function (req, res, next){
  var modDePreparare = req.body.stepsValue;
  delete req.body.stepsValue;

  var nume = req.body.name;
  var img = req.body.img;
  var categorie = req.body.categorie;
  var time = parseFloat(req.body.time);
  var nivel = req.body.nivel;
  
  var reteta = {
    nume,
    img,
    categorie,
    timp: time,
    nivel,
    modDePreparare
  }
  
  createRecipe(reteta);
  res.status(200).json(reteta);
});

router.put("/", function (req, res, next){
  var modDePreparare = req.body.stepsValue;
  delete req.body.stepsValue;

  var id = req.body.id;
  var nume = req.body.name;
  var img = req.body.img;
  var categorie = req.body.categorie;
  var time = parseFloat(req.body.time);
  var nivel = req.body.nivel;
  
  var reteta = {
    id,
    nume,
    img,
    categorie,
    timp: time,
    nivel,
    modDePreparare
  };

  updateRecipe(reteta);
  res.status(200).json(reteta);
});

router.delete("/", function (req, res, next) {
  
  var id = req.query.id;
  
  deleteRecipe(id);

  res.status(200).json();
});



function createRecipe(reteta){
  var content = fs.readFileSync(DATA_PATH);
  var recipes = JSON.parse(content);
  recipes.push(reteta);
  const contents = JSON.stringify(recipes, null, 2);
  fs.writeFileSync(DATA_PATH, contents);
};

function updateRecipe(reteta){
  var content = fs.readFileSync(DATA_PATH);
  var recipes = JSON.parse(content);

  var index = recipes.findIndex((r) => r.id === reteta.id);

  recipes[index] = reteta;


  const contents = JSON.stringify(recipes, null, 2);
  fs.writeFileSync(DATA_PATH, contents);
};

function getRecipes(page, items, filter) {
  var content = fs.readFileSync(DATA_PATH);
  var recipes = JSON.parse(content);
  var allRecipes = recipes;

  if (filter !== 'null'){
    if (recipes.filter((r)=> r.categorie === filter).length !== 0) {
      recipes = recipes.filter((r)=> r.categorie === filter);
    }

    if (recipes.filter((r)=> r.nivel === filter).length !== 0) {
      recipes = recipes.filter((r)=> r.nivel === filter);
    }
  }

  var trimStart = (page-1) * items;
  var trimEnd = trimStart + items;

  return {
    recipes: recipes.slice(trimStart, trimEnd),
    totalPages: Math.ceil(recipes.length / items),
    allRecipes
  };
}


function deleteRecipe(id){
  var content = fs.readFileSync(DATA_PATH);
  var recipes = JSON.parse(content);

  var index = recipes.findIndex((r) => r.id === id);
  console.log(index);

  recipes.splice(index, 1);

  const contents = JSON.stringify(recipes, null, 2);
  fs.writeFileSync(DATA_PATH, contents);
};

module.exports = router;

