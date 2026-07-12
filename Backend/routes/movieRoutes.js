const express = require("express");

const router = express.Router();

const {

    getMovies,

    getMovie,

    createMovie

}=require("../controllers/movieController");

router.get("/",getMovies);

router.get("/:id",getMovie);

router.post("/",createMovie);

module.exports=router;