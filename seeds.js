var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data=[
	{
		name: "Cloud's Rest",
		image: "https://farm8.staticflickr.com/7113/7482049174_560bf194ec.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque mauris, gravida id tempor quis, egestas eu leo. Aenean ut felis ante. Ut ultricies nisl ante, quis ornare ligula sollicitudin ut. Integer sed luctus orci. Nullam facilisis laoreet ipsum malesuada imperdiet. Vivamus tristique accumsan tellus sed condimentum. Nam venenatis urna et maximus tincidunt. Nam maximus metus eget vulputate ultricies. Pellentesque blandit urna odio, eu blandit lectus fermentum vel. Nunc laoreet lectus et velit semper consequat. Integer blandit rhoncus augue, et sodales neque malesuada quis."
	},
	{
		name: "Desert Mesa",
		image: "https://farm2.staticflickr.com/1287/4670981254_5654b5dd25.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque mauris, gravida id tempor quis, egestas eu leo. Aenean ut felis ante. Ut ultricies nisl ante, quis ornare ligula sollicitudin ut. Integer sed luctus orci. Nullam facilisis laoreet ipsum malesuada imperdiet. Vivamus tristique accumsan tellus sed condimentum. Nam venenatis urna et maximus tincidunt. Nam maximus metus eget vulputate ultricies. Pellentesque blandit urna odio, eu blandit lectus fermentum vel. Nunc laoreet lectus et velit semper consequat. Integer blandit rhoncus augue, et sodales neque malesuada quis."
	},
	{
		name: "Canyon Floor",
		image: "https://farm8.staticflickr.com/7341/16263385388_c3a03df906.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque mauris, gravida id tempor quis, egestas eu leo. Aenean ut felis ante. Ut ultricies nisl ante, quis ornare ligula sollicitudin ut. Integer sed luctus orci. Nullam facilisis laoreet ipsum malesuada imperdiet. Vivamus tristique accumsan tellus sed condimentum. Nam venenatis urna et maximus tincidunt. Nam maximus metus eget vulputate ultricies. Pellentesque blandit urna odio, eu blandit lectus fermentum vel. Nunc laoreet lectus et velit semper consequat. Integer blandit rhoncus augue, et sodales neque malesuada quis."
	}
];

function seedDB(){
	//	REmove all campgrounds
	Campground.remove({}, function(error){
		if(error){
			console.log("Error occured!");
		}else{
			console.log("Removed Campgrounds!");
			// add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(error, campground){
					if(error){
						console.log("Error");
					}else{
						console.log("Added a Campground");
						//create a comment
						Comment.create(
							{
								text: "This place is great, but I wish there was internet.",
								author: "homer"
							}, function(error, comment){
								if(error){
									console.log("error");
								}else{
									campground.comments.push(comment);
									campground.save();
									console.log("Created new comment");
								}
						});
					}
				});
			});
		}
	});
	
	
	//add a few comments
}

module.exports = seedDB;