const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    genre:{
        type:[String],
        required:true
    },

    language:{
        type:String
    },

    duration:{
        type:String
    },

    imdb:{
        type:Number
    },

    poster:{
        type:String
    },

    dates:{
        type:[String]
    },

    times:{
        type:[String]
    },

    description:{
        type:String
    },
});

module.exports = mongoose.model("Movie",movieSchema);