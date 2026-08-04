const Listing = require("../models/listing.js");


module.exports.index = async(req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm =  (req, res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListings = (async(req,res)=>{
    let{id} = req.params;
    let moreData = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!moreData){
        req.flash("error",  "Listing you requested for does not exist!");
        res.redirect("/listings")
        return;
    }
    // console.log(moreData);
    res.render("./listings/show.ejs", {moreData});
});

module.exports.createListing = async(req, res, next)=>{
    let{id} = req.params;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success",  "New Listing Created!");
    res.redirect("/listings");

};

module.exports.updateListing = async(req, res) =>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success",  "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.updateFormRender= async(req,res)  =>{
    let{id} = req.params;
    let moreData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {moreData});
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success",  "Listing Deleted!");
    res.redirect("/listings");
};