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

  const recipes = getRecipes(parseInt(page), parseInt(items));
  res.json(recipes);
});

function getRecipes(page, items) {
  const content = fs.readFileSync(DATA_PATH);
  var recipes = JSON.parse(content);

  var trimStart = (page-1) * items;
  var trimEnd = trimStart + items;

  console.log(trimStart);
  console.log(trimEnd);

  return {
    recipes: recipes.slice(trimStart, trimEnd),
    totalPages: Math.ceil(recipes.length / items)
  };
}

module.exports = router;

