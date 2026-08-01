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