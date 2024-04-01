const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controller/user");
module.exports = router;


router.get("/signup", wrapAsync(userController.renderSignupForm))

router.post("/signup", wrapAsync(userController.signUpUser));

router.get("/login", userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(userController.loginUser));

router.get("/logout", wrapAsync(userController.logOutUser));
