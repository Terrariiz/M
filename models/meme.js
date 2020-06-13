const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let memeSchema = new mongoose.Schema({
            name: String,
            image: String,
            desc: String,
            category: String,
            author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            },
            comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                }
            ]
        });

memeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Meme', memeSchema);