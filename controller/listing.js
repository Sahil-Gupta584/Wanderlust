const Listing = require("../models/listing.js");


module.exports.renderListings = async (req, res) => {
    const allListings = await Listing.find({});
    await res.render("listings/index.ejs", { allListings })

}

module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author"}
    }).populate("owner");
    
    


    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300/w_250");
    res.render('listings/edit.ejs', { listing,originalImageUrl });
}

module.exports.createListing = async (req, res) => {
    const url = req.file.path
    const filename = req.file.filename
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user;
    newListing.image = {url, filename}
    await newListing.save();
    console.log(req.body);
    req.flash("success", "New listing is created Successfully!");
    res.redirect("/listings");

    

}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if( typeof req.file !== "undefined"){

        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
    req.flash("success", "listing deleted successfully!")
}
