var express = require("express");
var router	= express.Router();
var Campground = require("../models/campground");
// index.js is a special name and whenever it is present inside a directory, calling the directory itself will call all the contents of index file. therefore, iin the next line iinstead of requiring ../middleware/index require ../middleware and it will work the same
var middleware = require("../middleware");

//INDEX- SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
	//req.user holds the information of the currently logged in user
	//console.log(req.user);
	// get all campgrounds from db and then render
	Campground.find({}, function(error, allCampgrounds){
		if(error){
			console.log(error);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser:  req.user});
		}
	});
});


//CREATE- ADD A NEW CAMPGROUND TO DATABASE
router.post("/", middleware.isLoggedIn,function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground= {name: name, price: price, image: image, description: description, author: author};
	//first create and store in db and then redirect
	Campground.create(newCampground, function(error, campground){
			if(error){
				console.log(error);
			}
			else{
				// campground.author.id = req.user._id;
				// campground.author.username = req.user.username;
				// campground.save();
				//console.log(campground);
				console.log("NEWLY CREATED CAMPGROUND!");
			}
		}
	);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});


//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new");	
});

//SHOW- Shows info about 1 Campground
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
		if(error){
			console.log(error);
		}else{
			//console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT - Edit Campground Route

// router.get("/:id/edit", function(req, res){
// 	Campground.findById(req.params.id, function(error, foundCampground){
// 		if(error){
// 			res.redirect("/campgrounds");
// 			console.log(error);
// 		}else{
// 			res.render("campgrounds/edit", {campground: foundCampground});
// 		}
// 	});	
// });

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(error, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

//UPDATE - Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
		if(error){
			console.log(error);
		}else{
			req.flash("success", "Successfully updated your campground");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE - Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(error){
		if(error){
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "Campground Deleted");
			res.redirect("/campgrounds");
		}
	});
});

//=====================
//middleware
//=====================

//imported from middleware folder 

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next){
// 	//is user logged in
// 		if(req.isAuthenticated()){
// 			Campground.findById(req.params.id, function(error, foundCampground){
// 				if(error){
// 					res.redirect("back");
// 				}else{
// 					// does user own the campground?
// 					//if(foundCampground.author.id === req.user.id), this wont work since the result given out by first one is mongoose object and by the second one is string. Try console logging it. both will look the same, but behind the scenes first one is object and second one is string and the checking of equality won't work. Instead, try using a method which is show in the next line.
// 					if(foundCampground.author.id.equals( req.user.id)){
// 						next();
// 					}else{
// 						// otherwise, redirect
// 						res.redirect("back");
// 					}
// 				}
// 			});
// 		}else{
// 			//if not redirect
// 			res.redirect("back");
// 		}
// }

module.exports = router;