const   express = require('express'),
        router = express.Router(),
        multer = require("multer"),
        path = require("path"),
        fs = require("fs"),
        passport = require('passport'),
        Meme = require("../models/meme"),
        User = require('../models/user'),
        Log = require("../models/log"),
        middleware = require('../middleware');

const storage = multer.diskStorage({
    destination: './public/profileimg',
    filename: function(req, file, cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.gif' && ext !== '.jpg' && ext !== '.jpeg'){
        return cb(new Error('Only image is allowed'), false)
        }
        cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFilter})

router.get("/",function(req,res){
    Meme.find({},function(error, allMeme){
        if(error){
            console.log("Error!");
        } else {
            res.render("landing",{Meme:allMeme});
        }
    });
});

router.get("/log",function(req,res){
    Log.find({},function(error, allLog){
        if(error){
            console.log("Error!");
        } else {
            res.render("log",{Log:allLog});
        }
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
        successRedirect: "/edumeme",
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
    res.redirect("/edumeme");
});

router.get("/terms", function(req,res){
    res.render("terms");
})

router.get("/signup",function(req,res){
    res.render("signup");
});

router.post("/signup", function(req,res){
    User.register(new User({username: req.body.username, email: req.body.email, image:"default.jpg", name: req.body.name, type: "user"}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("failure","Username has already use");
            return res.render("signup");
        }
        passport.authenticate("local")(req,res,function(){
            var date = Date();
            Log.create(new Log({text: req.body.username + " has register (id:" + user._id + ")", date: date}), function(err,log){
                if(err){
                    console.log(err);
                } else {
                    console.log(log);
                }                
            });
            console.log("New account created");
            req.flash('success','Welcome , ' + user.username);
            res.redirect("/edumeme");
        });
    });
});

router.get("/profile/:id", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(error, idUser){
        if(error){
            console.log(error);
        } else {
            Meme.find({ "author.id": req.params.id },function(error, allMeme){
                if(error){
                    console.log(error);
                } else {
                    res.render("profiles/profile",{user:idUser, Meme:allMeme});
                }
            })
        }
    });
});

router.get("/profile/:id/edit", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        res.render("profiles/edit", {user: foundUser});
    });
});

router.put("/profile/:id", middleware.isLoggedIn, upload.single("image"), function(req,res){
    let n_email = req.body.email;
    let n_name = req.body.name;
    if(req.file){
        let n_image = req.file.filename;
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                console.log(err);
                res.redirect("/edumeme/profile/" + req.params.id);
            } else{
                const imagePath = "./public/profileimg/" + foundUser.image;
                if(foundUser.image === "default.jpg"){
                    console.log("Change profile img");
                } else{
                    fs.unlink(imagePath, function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }                
            }
        });
        var n_user = {email: n_email, image: n_image, name: n_name};
    } else {
        var n_user = {email: n_email, name: n_name};
    }

    User.findByIdAndUpdate(req.params.id, n_user, function(err, updateUser){
        if(err){
            console.log(err);
        } else {
            var date = Date();
            Log.create(new Log({text: updateUser.username + " has edit profile", date: date}), function(err,log){
                if(err){
                    console.log(err);
                } else {
                    console.log(log);
                }                
            });
            console.log(updateUser);
            res.redirect('/edumeme/profile/' + req.params.id);
        }
    });
});


module.exports = router;