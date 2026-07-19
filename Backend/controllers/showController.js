const Show = require("../models/Show");


// Get seats for a show
exports.getShowSeats = async(req,res)=>{
    try{
        const show = await Show.findOne({movie: req.params.movieId}).populate("movie");
        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }
        res.json(show);

    }catch(error){

        res.status(500).json({message:error.message});
    }
};



// Create show
exports.createShow = async(req,res)=>{
    try{
        const show = await Show.create(req.body);
        res.status(201).json(show);

    }catch(error){

        res.status(500).json({message:error.message});
    }
};