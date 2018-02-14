var express = require("express");
var router	= express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
// index.js is a special name and whenever it is present inside a directory, calling the directory itself will call all the contents of index file. therefore, iin the next line iinstead of requiring ../middleware/index require ../middleware and it will work the same
var middleware = require("../middleware");

//================================
// COMMENTS ROUTES
//================================

//NEW - SHOW FORM TO CREATE A NEW COMMENT
router.get("/new", middleware.isLoggedIn,function(req, res){
	Campground.findById(req.params.id, function(error, foundCampground){
		if(error){
			console.log("error Occured!");
		}else{
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

//CREATE- ADD A NEW comment TO DATABASE and make it related to a particular campground
router.post("/", middleware.isLoggedIn,function(req, res){
	Campground.findById(req.params.id, function(error, foundCampground){
		if(error){
			console.log("Error Occured!");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(error, comment){
				if(error){
					req.flash("error", "Something wen't wrong!");
					console.log(error);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// console.log("New comment's username will be" + req.user);
					//save comment
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					console.log("Comment was registered");
					//console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

//COMMENT EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(error, foundComment){
		if(error){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, foundComment){
		if(error){
			console.log("back");
		}else{
			req.flash("success", "Successfully updated your Comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error){
		if(error){
			req.flash("error", "Comment not found!");
			res.redirect("back");
		}else{
			req.flash("success", "Comment was successfully deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//=================
//middleware
//=================

//imported from middleware folder 

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
// 	//is user logged in
// 		if(req.isAuthenticated()){
// 			Comment.findById(req.params.comment_id, function(error, foundComment){
// 				if(error){
// 					res.redirect("back");
// 				}else{
// 					// does user own the comment?
// 					//if(foundCampground.author.id === req.user.id), this wont work since the result given out by first one is mongoose object and by the second one is string. Try console logging it. both will look the same, but behind the scenes first one is object and second one is string and the checking of equality won't work. Instead, try using a method which is show in the next line.
// 					if(foundComment.author.id.equals(req.user.id)){
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
