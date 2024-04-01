const mongoose = require('mongoose');
const Review = require("./Review.js");
const User = require("./user.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,    
    },
    description:String,
    image:{
        url: String,
        filename: String
    },
    price: Number,
    location : String,
    country :String,
    reviews :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;