const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({

    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required:true
    },

    seats:{
        type:[String],
        required: true
    }


});


module.exports = mongoose.model("Show", showSchema);