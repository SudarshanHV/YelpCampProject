var express=require('express');
var router=express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX ROUTE: Displays list of all campgrounds.
router.get("/",function(req,res){
	
	//GET ALL CAMPGROUNDS FROM DB.
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log("error");
		}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
		}
	});
});

//req.user has dat for currently logged in user
//CREATE ROUTE: Creates a new campground
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newCamp= {name:name,image:image,description: desc,author:author};
	
	//CREATE NEW CAMPGROUND AND SAVE TO DATABASE.
	Campground.create(newCamp,function(err,newlyCreated){
		if(err){
			//USER FORM FILLING ERROR HANDLING
			console.log("Form error");
			console.log(err);
		}else{
			console.log(newlyCreated);
			req.flash("success","Successfully created Campground!!!");
			res.redirect("/campgrounds");
		}
	});
});

//NOTE: Declare new route before :id route.
//NEW ROUTE: Displays form to make a new dog.
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});


//SHOW ROUTE: Shows info about a campground
router.get("/:id",function(req,res){
	//FIND BY ID is a mongo method
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit",{campground: foundCampground});	
	});
});

//UPDATE ROUTE
router.put("/:id",middleware.checkCampOwnership,function(req,res){
	//find and update
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updateCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}

	});
	//redirect show page.
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});



module.exports= router;
