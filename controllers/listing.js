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
    let url = req.file.path;
    let filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    await listing.save();
    req.flash("success",  "New Listing Created!");
    res.redirect("/listings");

};

module.exports.updateListing = async(req, res) =>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success",  "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.updateFormRender= async(req,res)  =>{
    let{id} = req.params;
    let moreData = await Listing.findById(id);

    if (!moreData) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let ogImageUrl = moreData.image.url;
    ogImageUrl = ogImageUrl.replace("/upload", ("/upload/h_300,w_250"));
    res.render("./listings/edit.ejs", {moreData, ogImageUrl});
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success",  "Listing Deleted!");
    res.redirect("/listings");
};