const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: { type:String, unique: true},
    email: { type:String },
    image: { type:String },
    name: { type:String },
    type: { type:String},
    password: { type:String },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);