const express = require('express'),
      router = express.Router();
      Meme = require("../models/meme"),
      middleware = require('../middleware');

router.get("/",middleware.isLoggedIn, function(req,res){
    Meme.find({},function(error, allMeme){
        if(error){
            console.log("Error!");
        } else {
            res.render("memes/index",{Meme:allMeme});
        }
    })
});

router.post("/",middleware.isLoggedIn, function(req,res){
    let n_name = req.body.name;
    let n_image = req.body.image;
    let n_desc = req.body.desc;
    let n_meme = {name:n_name,image:n_image,desc:n_desc};
    Meme.create(n_meme, function(error,newMeme){
        if(error){
            console.log("error");
        } else {
            console.log("New meme added.");
            res.redirect("/memehub");
        }
    });
});

router.get("/add",middleware.isLoggedIn,function(req,res){
    res.render("memes/add");
});

router.get("/:id",middleware.isLoggedIn, function(req,res){
    Meme.findById(req.params.id).exec(function(error, idMeme){
        if(error){
            console.log("Error");
        } else {
            res.render("memes/show",{meme:idMeme});
        }
    });
});

module.exports = router;