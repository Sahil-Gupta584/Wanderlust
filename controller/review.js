const Listing = require("../models/listing");
const Review = require("../models/Review.js");

module.exports.saveReview =  async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user;
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing._id}`);

}

module.exports.showReviews =  async (req, res) => {

    res.redirect(`/listings/${req.params.id}`);

}

 module.exports.deleteReview = async (req, res) => {
    console.log("l")
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}