var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {

    var recipes = getRecipes(parseInt(page), parseInt(items), filter);
    res.render('index', {title: 'recipes'});
});

module.exports = router;