var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is user logged in
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(error, foundCampground){
				if(error){
					req.flash("error", "Campground not found!");
					res.redirect("back");
				}else{
					// does user own the campground?
					//if(foundCampground.author.id === req.user.id), this wont work since the result given out by first one is mongoose object and by the second one is string. Try console logging it. both will look the same, but behind the scenes first one is object and second one is string and the checking of equality won't work. Instead, try using a method which is show in the next line.
					if(foundCampground.author.id.equals( req.user.id)){
						next();
					}else{
						req.flash("error", "You don't have permission to do that!");
						// otherwise, redirect
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You must be Logged in to proceed!");
			//if not redirect
			res.redirect("back");
		}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(error, foundComment){
				if(error){
					req.flash("error", "Comment not found!");
					res.redirect("back");
				}else{
					// does user own the comment?
					//if(foundCampground.author.id === req.user.id), this wont work since the result given out by first one is mongoose object and by the second one is string. Try console logging it. both will look the same, but behind the scenes first one is object and second one is string and the checking of equality won't work. Instead, try using a method which is show in the next line.
					if(foundComment.author.id.equals(req.user.id)){
						next();
					}else{
						req.flash("error", "You don't have permission to do that!");
						// otherwise, redirect
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You must be Logged in to proceed!");
			//if not redirect
			res.redirect("back");
		}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must be Logged in to proceed!"); // here error is the key and "please Login first" is the value in key-value pair
	res.redirect("/login");
}

module.exports = middlewareObj;