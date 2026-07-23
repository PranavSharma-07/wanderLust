const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./models/schema.js");
const Review = require("./models/review.js");



app.engine('ejs', ejsMate);
app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true }));
app.use(methodOverride("_method"));


main()
.then(()=>{
    console.log("connection successful!");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

}


//middleware for new and edit form
const validateListings = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error); 
    }else{
        next();
    }
};


//middleware for review
const validateReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error); 
    }else{
        next();
    }
};

//index route
app.get("/listings",wrapAsync (async(req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


//get route for new entry
app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs");
});


//update route
app.get("/listings/:id/edit",
      validateListings,
     wrapAsync
     (async(req,res)  =>{
    let{id} = req.params;
    let moreData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {moreData});
}));

//show route
app.get("/listings/:id", wrapAsync (async(req,res)=>{
    let{id} = req.params;
    // console.log(id);
    let moreData = await Listing.findById(id).populate("reviews");
    // console.log(moreData);
    res.render("./listings/show.ejs", {moreData});
}));

//post route for new entry
app.post("/listings",validateListings, wrapAsync (async(req, res, next)=>{
    let{id} = req.params;
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");

}));


//put route
app.put("/listings/:id", wrapAsync (async(req, res) =>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id", wrapAsync (async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews
//POST route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req, res)=> { 
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

//root route
app.get("/", (req, res) =>{
    res.send("Hi i am root!");
});

//custom error 
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//middleware for error
app.use((err, req, res, next)  =>{
    let {statusCode  = 500, message="Something went wrong"} = err;
      res.status(statusCode).render("./listings/error.ejs", {message});
});

app.listen(8080, (req, res) =>{
    console.log(`server  is listining on post: 8080`);
});
