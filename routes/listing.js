const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const methodOverride = require("method-override");
const Listing = require("../models/listing.js");
const {validateListings} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const{isOwner} = require("../middleware.js");


const listingController = require("../controllers/listing.js");



//index route
router.get("/", wrapAsync(listingController.index) );


//get route for new entry
router.get("/new",
    isLoggedIn, listingController.renderNewForm );



//update route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync
     (listingController.updateFormRender));

//show route
router.get("/:id",
     wrapAsync(listingController.showListings) );

//post route for new entry
router.post("/", isLoggedIn,
     validateListings,
      wrapAsync (listingController.createListing));


//put route
router.put("/:id",
    isLoggedIn,
     isOwner,
      validateListings,
       wrapAsync (listingController.updateListing));


//delete route
router.delete("/:id",
    isLoggedIn,
     isOwner,
      wrapAsync (listingController.deleteListing));

module.exports = router;