const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const methodOverride = require("method-override");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, reviewAuthor} = require("../middleware.js");
const review = require("../models/review.js");



//reviews
//POST route
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
    req.flash("success",  "New Review Created.");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn, reviewAuthor, wrapAsync(async(req, res)=> { 
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success",  "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;