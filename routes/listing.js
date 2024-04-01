const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controller/listing.js");


//Show listings 
router.get("/", wrapAsync(listingController.renderListings));



//new listing
router.get("/new", isLoggedIn, wrapAsync(listingController.newListingForm));

//show listing
router.get("/:id", wrapAsync(listingController.showListing));

//Edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Create Listing
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));


//Update listing
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing));

//Delete Listing
router.delete("/:id", isLoggedIn, isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;