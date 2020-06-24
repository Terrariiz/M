const   express = require("express"),
        mongoose = require("mongoose"),
        bodyParser = require("body-parser"),
        flash = require('connect-flash'),
        path = require("path"),
        passport = require("passport"),
        passportLocal = require("passport-local"),
        passportLocalMongoose = require("passport-local-mongoose"),
        methodOverride = require("method-override"),
        User = require("./models/user"),
        Meme = require("./models/meme"),
        Log = require("./models/log"),
        memeRoutes = require("./routes/meme"),
        indexRoutes = require("./routes/index"),
        commentsRoutes = require("./routes/comments");

const   app = express();

mongoose.set("useUnifiedTopology", true);
mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(flash());
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "CSS227",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/edumeme", indexRoutes);
app.use("/edumeme/meme", memeRoutes);
app.use("/edumeme/meme/:id/comments", commentsRoutes);

app.listen(3000, function(req,res){
    console.log("Link Start!");
});