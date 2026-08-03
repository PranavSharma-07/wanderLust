const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./models/schema.js");
const ExpressError = require("./utils/ExpressError.js");

//middleware for check user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirect Url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error",  "You must be logged in to create new message.");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveredirectUrl =  (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}


//middleware for check user is owner  or not
module.exports.isOwner = async(req, res, next) => {
    let{id} = req.params;
        let listing =await Listing.findById(id);
        if(!listing.owner._id.equals(req.user._id)) {
            req.flash("error", "you are not the owner of this listing ");
            return res.redirect(`/listings/${id}`);
        }
        next();
}


//middleware for validate listings
module.exports.validateListings = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error); 
    }else{
        next();
    }
};

//middleware for validate review

module.exports.validateReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error); 
    }else{
        next();
    }
};



module.exports.reviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
        let review =await Review.findById(reviewId);
        if(!review.author.equals(req.user._id)) {
            req.flash("error", "you are not the owner of this review ");
            return res.redirect(`/listings/${id}`);
        }
        next();
}