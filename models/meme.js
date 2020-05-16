const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let memeSchema = new mongoose.Schema({
            name: String,
            image: String,
            desc: String,
        });

memeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Meme', memeSchema);