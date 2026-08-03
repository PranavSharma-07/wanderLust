const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const methodOverride = require("method-override");
const Listing = require("../models/listing.js");
const {validateListings} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const{isOwner} = require("../middleware.js");





//index route
router.get("/",wrapAsync (async(req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


//get route for new entry
router.get("/new",isLoggedIn, (req, res)=>{
    res.render("./listings/new.ejs");
});



//update route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync
     (async(req,res)  =>{
    let{id} = req.params;
    let moreData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {moreData});
}));

//show route
router.get("/:id", wrapAsync (async(req,res)=>{
    let{id} = req.params;
    let moreData = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!moreData){
        req.flash("error",  "Listing you requested for does not exist!");
        res.redirect("/listings")
        return;
    }
    console.log(moreData);
    res.render("./listings/show.ejs", {moreData});
}));

//post route for new entry
router.post("/", isLoggedIn, validateListings, wrapAsync (async(req, res, next)=>{
    let{id} = req.params;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success",  "New Listing Created!");
    res.redirect("/listings");

}));


//put route
router.put("/:id",isLoggedIn, isOwner, validateListings, wrapAsync (async(req, res) =>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success",  "Listing Updated");
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync (async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success",  "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;