const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/default-image.jpg",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
                    : v,
        },
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});

const Listing =mongoose.model("Listing", listingSchema);
module.exports = Listing;