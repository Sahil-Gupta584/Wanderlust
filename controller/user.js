const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUpUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }

            req.flash("success", `Welcome to Wanderlust ${username}`);
            res.redirect("/listings");
        })



    } catch (error) {
        req.flash("error", `${error.message}`)
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginUser = (req, res) => {

    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back to Wanderlust!")
    res.redirect(redirectUrl);
}

module.exports.logOutUser = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Successfully Loged you Out!");
        res.redirect("/listings");
    })
}