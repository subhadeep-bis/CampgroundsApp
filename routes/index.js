var express = require("express");
var router	= express.Router();
var passport = require("passport");
var User = require("../models/user");

//===================================
//  ROUTES
//===================================

// root route
router.get("/", function(req, res){
	res.render("landing");
});


//================================
//AUTH ROUTES
//================================

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(error, user){
		if(error){
			console.log(error);
			req.flash("error", error.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp \"" + user.username + "\"");
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),function(req, res){

}); 

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have Successfully logged out");
	res.redirect("/campgrounds");
});

// //middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

module.exports = router;