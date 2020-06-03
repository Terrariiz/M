const express = require('express'),
      router = express.Router();
      passport = require('passport'),
      User = require('../models/user');

router.get("/",function(req,res){
    res.render("landing");
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
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("failure","Username has already use");
            return res.render("signup");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash('success','Welcome , ' + user.username);
            res.redirect("/memehub");
        });
    });
});

router.get("/profile", function(req,res){
    res.render("profile");
});

module.exports = router;