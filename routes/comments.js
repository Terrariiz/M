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
            res.render('comment',{meme: meme});
        }
    });
});

// router.post('/', middleware.isLoggedIn, function(req,res){
//     let commenttext = req.body.comment;
//     let commentuser = req.user.username;
//     let addcomment = {text:commenttext, username:commentuser};

//     Meme.findById(req.params.id, function(err, meme){
//         if(err){
//             console.log(err);
//         } else {
//             Comment.create(addcomment, function(err,comment){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     meme.comments.push(comment);
//                     meme.save();
//                     res.redirect('/memehub/meme/' + meme._id);
//                 }
//             });
//         }
//     });
// });

router.post('/', middleware.isLoggedIn, function(req,res){
    Meme.findById(req.params.id, function(err, meme){
        if(err){
            console.log(err);
            res.redirect('/memehub/meme');
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    meme.comments.push(comment);
                    meme.save();
                    res.redirect('/memehub/meme/' + meme._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            res.render("comment/edit", {meme_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/memehub/meme/' + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back'); 
        } else {
            res.redirect('/memehub/meme/' + req.params.id);
        }
    });
});

module.exports = router;