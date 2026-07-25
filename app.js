const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash  = require("connect-flash");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

};


const sessionOptions  =   {
    secret: "myufo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());


//middleware for flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});




app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);


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
