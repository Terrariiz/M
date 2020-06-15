const   express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        Meme = require("../models/meme"),
        User = require('../models/user'),
        middleware = require('../middleware');

router.get("/",function(req,res){
    Meme.find({},function(error, allMeme){
        if(error){
            console.log("Error!");
        } else {
            res.render("landing",{Meme:allMeme});
        }
    })
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
        successRedirect: "/memehub",
        failureRedirect: "login",
        successFlash: true,
        failureFlash: true,
        successFlash: "Welcome",
        failureFlash: "Invalid username or password!"
    }),function(req, res){
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Log out successfully");
    res.redirect("/memehub");
});

router.get("/signup",function(req,res){
    res.render("signup");
});

router.post("/signup", function(req,res){
    User.register(new User({username: req.body.username, email: req.body.email, name: req.body.name}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("failure","Username has already use");
            return res.render("signup");
        }
        passport.authenticate("local")(req,res,function(){
            console.log("New account created");
            req.flash('success','Welcome , ' + user.username);
            res.redirect("/memehub");
        });
    });
});

router.get("/profile", middleware.isLoggedIn, function(req,res){
    Meme.find({},function(error, allMeme){
        if(error){
            console.log("Error!");
        } else {
            res.render("profiles/profile",{Meme:allMeme});
        }
    })    
});


module.exports = router;