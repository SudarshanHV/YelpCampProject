var middlewareObj={};
var Campground= require("../models/campground");
var Comment= require("../models/comment");
middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		} else {
			//Does user own comment
			//foundComment.author.id====Object
			//req.user._id====String
			if(foundComment.author.id.equals(req.user._id)){
				next();	
			} else {
				res.redirect("back");
			}
			
		}
	});
	} else{
		req.flash("You gotta be logged in!!!");
		res.redirect("back");
	}
}

middlewareObj.checkCampOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Campgrounds not found");
			res.redirect("back");
		} else {
			//Does user own campground
			//foundCampround.author.id====Object
			//req.user._id====String
			if(foundCampground.author.id.equals(req.user._id)){
				next();	
			} else {
				req.flash("You do not have permission to do that!!");
				res.redirect("back");
			}
			
		}
	});
	} else{
		req.flash("error","You need to be logged in to do that!!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You have to be logged in to do that!!");
	res.redirect("/login");

}


module.exports=middlewareObj;