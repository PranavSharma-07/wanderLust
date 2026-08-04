const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveredirectUrl} =  require("../middleware.js");
const userController = require("../controllers/user.js");


//for signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signUp));

//for login
router.get("/login", userController.renderLoginForm);

router.post(
    "/login",
    saveredirectUrl,
    passport.authenticate('local',{ 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    userController.login);


//for logOut

router.get("/logout",userController.logout);


module.exports = router;
