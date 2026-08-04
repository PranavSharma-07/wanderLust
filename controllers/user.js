const User = require("../models/user.js")
const passport = require("passport");
const {saveredirectUrl} =  require("../middleware.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res) => { 
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
    

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) =>{
        req.flash("success", "Welcome To WanderLust! you are logged in.");
        res.redirect(res.locals.redirect || "/listings");
        
};



module.exports.logout =  (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};