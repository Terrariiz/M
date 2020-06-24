const   mongoose = require('mongoose');

let logSchema = new mongoose.Schema({
            text: String,
            date: String,
        });

module.exports = mongoose.model('Log', logSchema);