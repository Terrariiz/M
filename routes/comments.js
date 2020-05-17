const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Meme = require('../models/meme'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req,res){
    // console.log(req.params.id);
    Meme.findById(req.params.id, function(err, meme){
        if(err){
            console.log(err);
        } else {
            res.render('comment/new',{meme: meme});
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req,res){
    Meme.findById(req.params.id, function(err, meme){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    meme.comments.push(comment);
                    meme.save();
                    res.redirect('/memehub/meme/' + meme._id);
                }
            });
        }
    });
});

module.exports = router;