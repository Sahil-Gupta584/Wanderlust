const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const listingSchema = require("./models/listing");
const reviewSchema = require("./models/Review");
const Review = require("./models/Review");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be Logged In in firts!");
        return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl  = (req,res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();

};

module.exports.isOwner = async (req,res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Database validation
module.exports.validateListing = (req, res, next) => { 
    let { error } = listingSchema.validate(req.body);
    console.log(error, req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();

    }
};

module.exports.validateReview = (req, res, next) => {
    // Check if req.body.review exists
    if (!req.body.review || typeof req.body.review !== 'object') {
        throw new ExpressError(400, "Review cannot be empty");
    }

    // Validate the review
    const { error } = reviewSchema.validate({ review: req.body.review });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res, next) => {
    let { reviewId,id } = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}