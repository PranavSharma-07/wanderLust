const express = require("express");
const router = express.Router();
const { listingSchema} = require("../models/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const methodOverride = require("method-override");
const Listing = require("../models/listing.js")

//middleware for new and edit form
const validateListings = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error); 
    }else{
        next();
    }
};


//index route
router.get("/",wrapAsync (async(req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


//get route for new entry
router.get("/new", (req, res)=>{
    res.render("./listings/new.ejs");
});


//update route
router.get("/:id/edit",
     wrapAsync
     (async(req,res)  =>{
    let{id} = req.params;
    let moreData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {moreData});
}));

//show route
router.get("/:id", wrapAsync (async(req,res)=>{
    let{id} = req.params;
    let moreData = await Listing.findById(id).populate("reviews");
    if(!moreData){
        req.flash("error",  "Listing you requested for does not exist!");
        res.redirect("/listings")
        return;
    }
    res.render("./listings/show.ejs", {moreData});
}));

//post route for new entry
router.post("/",validateListings, wrapAsync (async(req, res, next)=>{
    let{id} = req.params;
    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success",  "New Listing Created!");
    res.redirect("/listings");

}));


//put route
router.put("/:id", validateListings, wrapAsync (async(req, res) =>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success",  "Listing Updated");
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id", wrapAsync (async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success",  "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;