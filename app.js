var express=require('express'),
	bodyParser=require('body-parser'),
	app=express(),
	mongoose=require('mongoose'),
	Campground=require('./models/campground'),
	Comment=require('./models/comment'),
	flash=require("connect-flash"),
	methodOverride=require('method-override'),
	passport= require("passport"),
	LocalStrategy = require("passport-local"),
	User= require("./models/user"),
	seedDB= require('./seeds');

app.use(methodOverride("_method"));
app.use(flash());
//requiring routes
var commentRoutes=require('./routes/comments'),
	campgroundRoutes=require('./routes/campgrounds'),
	authRoutes=require('./routes/index');

//seedDB(); //Use THIS TO SEED NEW DATA IF YOU WANT TO.

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "Secret message",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
//SAMPLE CODE TO ADD STARTER DATA
// Campground.create(
// 	{
// 	name:"Salmon Creek",
// 	image:"http://www.californiasbestcamping.com/photos5/salmon_creek_camp.jpg",
// 	description:"This is California's best Camping sites!! Do visit it, beautiful"
// 	},
// 	function(err,campground){
// 		if(err){
// 			console.log("ERROR IN CONNECTION");
// 		}
// 		else{
// 			console.log("NEW CAMPGROUND CREATED");
// 			console.log(campground);
// 		}
// 	}
// );

app.use(express.static(__dirname+"/public"));

app.use(bodyParser.urlencoded({extended:true}));
const PORT=3000;

app.set("view engine","ejs");

//REFACTORING, ROUTES
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",authRoutes);

app.listen(PORT,process.env.IP,function(){
	console.log("Yelpcamp Server has started!!!");
});



