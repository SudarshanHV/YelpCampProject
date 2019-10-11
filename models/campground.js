var mongoose=require('mongoose');
//SCHEMA SETUP FOR MONGOOSE
var campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username:String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	] //REFERENCING COMMENTS TO A POST.
});

//MODEL TO USE SCHEMA
module.exports= mongoose.model("Campground",campgroundSchema);