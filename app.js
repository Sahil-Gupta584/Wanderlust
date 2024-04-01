if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const dburl = process.env.ATLAS_DB;
console.log(dburl);

const express = require("express");
const MongoStore = require("connect-mongo");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret:"mysupersecret"
    },
    touchAfter:24*3600
});

store.on("error",(err) => {
    console.length("Error in mongo session store",err)
}); 

const sessionOptions = {
    store,
    secret: 'mysupersecret',
   resave: false,
   saveUninitialized: true,
   cookie: { 
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
    } 
}

async function main() {
    await mongoose.connect(dburl);
    
    // initDB()
}

main().then(() => console.log('connected to DB')).catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method")) //override with POST having '?_method=(any method)'
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
 
//Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //Review
app.use("/", userRouter);

//Middlewares
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("Error.ejs", { message });
});




app.listen(8080, () => {
    console.log('server in on 8080');
});

