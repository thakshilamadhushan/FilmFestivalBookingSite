const express=require("express");
const router=express.Router();

const { getShowSeats, createShow }=require("../controllers/showController");


router.get("/movie/:movieId",getShowSeats);
router.post("/",createShow);



module.exports=router;