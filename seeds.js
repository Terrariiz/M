const mongoose = require('mongoose');
const Meme = require('./models/meme');

const data = [
    {
        name:"NANIDAFUK" ,
        image:"https://i.pinimg.com/236x/0f/eb/f3/0febf3d6b8bb661c30260d698c28556f.jpg",
        desc:"8;p"
    }
]

function seedDB(){
    Meme.remove({}, function(err){
        if(err) {
            console.log('Remove database error');
        }
        console.log('Drop database success');
        data.forEach(function(seed){
            Meme.create(seed, function(err, Meme){
                if(err){
                    console.log(err);
                } else {
                    console.log('Added a meme');
                }
            });
        });
    });
}

module.exports = seedDB;