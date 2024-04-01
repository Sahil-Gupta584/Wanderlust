const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const session = require("express-session");
const flash = require("connect-flash");
const { validateReview, isLoggedIn, isReviewAuthor, saveRedirectUrl, } = require("../middleware.js");


const reviewController = require("../controller/review.js");


//Review

router.post('/',isLoggedIn, validateReview,saveRedirectUrl, wrapAsync(reviewController.saveReview));

router.get('/', wrapAsync(reviewController.showReviews));

router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;