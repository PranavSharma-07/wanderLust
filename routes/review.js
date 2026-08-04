const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const methodOverride = require("method-override");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, reviewAuthor} = require("../middleware.js");
const review = require("../models/review.js");

const reviewController = require("../controllers/reviews.js");



//reviews
//POST route
router.post("/",isLoggedIn,
     validateReview,
      wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn, reviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;