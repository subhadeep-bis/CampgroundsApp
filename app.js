var express 		= require("express"),
	app				= express(),
	bodyParser 		= require("body-parser"),
 	mongoose 		= require("mongoose"),
 	flash			= require("connect-flash"),
 	passport 		= require("passport"),
 	LocalStrategy 	= require("passport-local"),
 	methodOverride 	= require("method-override"),
 	Campground 		= require("./models/campground"),
 	Comment 		= require("./models/comment"),
 	User 			= require("./models/user"),
 	seedDB 			= require("./seeds");

// requiring routes
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index"); //works here too ;)

//mongoose.connect("mongodb://localhost/yelp_camp_v6");
var promise = mongoose.connect('mongodb://localhost/yelp_camp_v12', {
  useMongoClient: true,
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//console.log(__dirname);
app.use(methodOverride("_method"));
app.use(flash()); 

//seedDB(); //seed the databse

//==================================
// PASSPORT CONFIGURATION
//==================================
app.use(require("express-session")({
	secret: "Once Again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//making sure req.user [details about req.user is mentioned under /campgrounds route] is available to every route. This acts as a middleware and we did this so that we don't have to pass req.user to each of the routes. This dries up our code and is called before every route as a middleware.
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error"); //here error acts as a key in key-value pair
	res.locals.success = req.flash("success"); //here success scts as a key in key-value pair
	next();
});

app.use("/", indexRoutes);
// If /campgrounds is written like this then it gets appended before each of the routes that are written in camprounds.js thereby drying up our code. Hence, in our campgrounds.js we remove /campgrounds from beginning in each one of the routes. This prevent repetition
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
	console.log("YelpCamp Server started at 27017");
});