const Movie = require("../models/Movie");

const getMovies = async(req,res)=>{

    try{

        const movies = await Movie.find();

        res.json(movies);

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

}

const getMovie = async(req,res)=>{

    try{

        const movie = await Movie.findById(req.params.id);

        res.json(movie);

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

}

const createMovie = async(req,res)=>{

    try{

        const movie = await Movie.create(req.body);

        res.status(201).json(movie);

    }

    catch(err){

        res.status(400).json({
            message:err.message
        });

    }

}

module.exports={
    getMovies,
    getMovie,
    createMovie
};