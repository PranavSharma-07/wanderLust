const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveredirectUrl} =  require("../middleware.js");


//for signup
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => { 
    try{
        let {username, email, password} = req.body;
        const newUser =  User({email, username});
        const registeredUser =  await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderLust");
            res.redirect("/listings");
        });
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    

}));

//for login
router.get(
    "/login",
    (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveredirectUrl,
    passport.authenticate('local',{ 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    async(req, res) =>{
        req.flash("success", "Welcome To WanderLust! you are logged in.");
        res.redirect(res.locals.redirect || "/listings");
        
});


//for logOut

router.get("/logout", (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
})


module.exports = router;
