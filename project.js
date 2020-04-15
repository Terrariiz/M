const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true});

let memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

let Member = mongoose.model("Member",memberSchema);

// Member.create(
//     {
//         email: "Eartdy@mail.com",
//         password: "123456"
//     }, function(error, member){
//         if(error){
//             console.log("Error!");
//         } else {
//             console.log("Added");
//             console.log(member)
//         }
//     }
// );

app.get("/memehub",function(req,res){
    res.render("landing.ejs");
});

app.get("/memehub/add",function(req,res){
    res.render("add.ejs");
});

app.get("/memehub/login",function(req,res){
    res.render("login.ejs");
});

app.get("/memehub/signup",function(req,res){
    res.render("signup.ejs");
});

app.get("/memehub/profile",function(req,res){
    res.render("profile.ejs");
});

app.get("/memehub/feeds", function(req,res){
    res.render("feeds.ejs", {meme,meme});
});

app.post("/memehub/feeds", function(req,res){
    let n_name = req.body.name;
    let n_email = req.body.email;
    let n_password = req.body.password;
    let n_user = { name: n_name, email: n_email, password: n_password };
    Member.create(n_user, function(error, newUser){
        if(error){
            console.log("error");
        } else {
            console.log("Added new user.");
        }
    });
    res.redirect("/memehub/feeds");
});

let meme = [
    {name: "meme1",imgurl:"https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-9/91189523_2841072275941632_1256038197595471872_n.jpg?_nc_cat=100&_nc_sid=8024bb&_nc_eui2=AeEZKGWF5ynFtrtNqBM_bjQaFcuHqn-16zdcQBwiPudM9uW7_-P7fDTXuD4pc5o6PzfaQpUcyurVT4BV4nwQrsLccmtOpFxZvkVsMynk6svIoA&_nc_oc=AQkO55HdpHqVXdDh4PU7PbH9YgEGg75QODE2IOgNFsNfspAr0LYSN7X0B_OltqFDejk&_nc_ht=scontent.fbkk7-3.fna&oh=9bd8d4a6267f339548e72c9b3c91d9bc&oe=5EAA83C0"},
    {name: "meme2",imgurl:"https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-9/91199086_2841070549275138_346033510605127680_n.jpg?_nc_cat=1&_nc_sid=8024bb&_nc_eui2=AeEGvF8_dbZiRF-3-UArRkrvQqJbtip6GBiLmU5aIIIeS9MNG6_23AAEsfklUdEtqMFtvPni03fn1I1b9vcb9QDMnHoiz0Sh5ErFC-_zz7e5Og&_nc_oc=AQnndwTtTY3fsJU_pICqinH07qLUWqEdpwVBVKUD0InhXuSA7hmrh_TwSJqPSa-0DoU&_nc_ht=scontent.fbkk7-3.fna&oh=f6ecae8dfbc7bbe9166c100b3429539a&oe=5EAA6FCD"},
    {name: "meme3",imgurl:"https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-9/92166580_2841068659275327_3828658809727877120_n.jpg?_nc_cat=1&_nc_sid=8024bb&_nc_eui2=AeEo8eqZ3my9ay1YqdGb088MbNofSHTtmt7uOuzbMfUZ4jdwX0yXSGPSDdCgD19E4ac6liuRUoQut2MSAr81HoU_ZxRccGmg53-SSMdLbuO_Hw&_nc_oc=AQnCmRkr0g1HTtUn-WeLtCjrBmBEnu4ebuvT0Ha54Gco8HhjszuKD3cnCVHyHgPEgg8&_nc_ht=scontent.fbkk7-3.fna&oh=796bc46a2a042be8dbb4cbbfe83106a8&oe=5EA89B75"},
    {name: "meme4",imgurl:"https://scontent.fbkk7-3.fna.fbcdn.net/v/t1.0-9/91727523_2841058592609667_2094568486977142784_n.jpg?_nc_cat=1&_nc_sid=8024bb&_nc_eui2=AeHPBHLp1vXbLaXjD4-zx49OzKI4POM5qbGAhCe6TxCkWAO-fX6EIPR8Fx0kbrTdx3k0prK82S9V6xu5G5eCwFWuzMTSz0_a8wFNY0byLI3Jwg&_nc_oc=AQkWP9tp4TBNa_UGrRhp8ifCwZw2rOFmCsRadfLgYqTiaMpFyvR9kYZFjY2GXd6J0ZA&_nc_ht=scontent.fbkk7-3.fna&oh=c93ffb0de1f55548433158c102a375c5&oe=5EA8D294"},
    {name: "meme5",imgurl:"https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/91176652_2841057259276467_6768184102702022656_n.jpg?_nc_cat=111&_nc_sid=8024bb&_nc_eui2=AeEN25Wr40dhxIgFAKyy8CqVC_CZbHE-cM02chvCEwC-NUeO8mjt3CGnVbU_2hFnMDqirCjNEwe-tvx7oN3KjofNhK-KKZpotOK8JhZzvM4YGw&_nc_oc=AQkzSz9ODu7fFi_0inerDFUdGRn2cgmfjs7Gfa2puXm4vxIZfNdzdBL0DaMoxIO6AEQ&_nc_ht=scontent.fbkk7-2.fna&oh=36f38794cd9c00b635855675acb5f891&oe=5EA96807"},
    {name: "meme6",imgurl:"https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/91087958_2836378353077691_8673849680209117184_n.jpg?_nc_cat=102&_nc_sid=8024bb&_nc_eui2=AeEdFTgenPrc_aQSKYOSCrDFyBMlEhUB3OWt8iuIXc9yrskB42ns_Dqd6pOBADoTbDkiTZz3KLWLyb7os_216RTMrHQ-4P25ytOLasfpRcbUiQ&_nc_oc=AQnx14hAk_lOsqiBPGwEQ2cqV7BUuezGtnktNW79T7XVGoI0JOZ-a-pEZph5zjbi6u0&_nc_ht=scontent.fbkk7-2.fna&oh=72c54acabc0f1780100d3b46f4ce6ccb&oe=5EA8E40F"},
    {name: "meme7",imgurl:"https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/91449300_2836329329749260_886113304341118976_n.jpg?_nc_cat=111&_nc_sid=8024bb&_nc_eui2=AeHerJzw9tWQQW0bDwlIM3Dho4klvYKwkM9AvIF2GHf0zoW-R1ZYsFzWLLtON9XdsrmJXfu1j9hgdwQEen7uAbFllnNIVY3URSCMFaR7YBXNoQ&_nc_oc=AQkFkFvdAgc7EB-d4d3MmPz9L9rqBpyGnsoe25R8uedV9N9FswzT7y_EZeZr5X4YDEo&_nc_ht=scontent.fbkk7-2.fna&oh=0e818317b4bda5215a8a48143fc74b8d&oe=5EA830BB"},
    {name: "meme8",imgurl:"https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/91087959_2834184713297055_2804275119260696576_n.jpg?_nc_cat=110&_nc_sid=8024bb&_nc_eui2=AeHiNhoQfkvLiJd9lbJgeNiFIt0pKNJ_Rmb7rejXjuGUeLbKzCrzIIkGLERPMmpwFXmaGLuqz6pYiccyToUolTmxDGRAytoTww3F_tbZmwUplA&_nc_oc=AQk5GMh1yeO-3yld0zCjWeB1i1uVmYZvXniOuFWS722hzamhV7x_scnG2Zw4vX7cRQQ&_nc_ht=scontent.fbkk7-2.fna&oh=0a57cf441bae601ab97a79e6440c741b&oe=5EA8C0EB"},
];

app.listen(3000, function(req,res){
    console.log("Started Now!!");
});