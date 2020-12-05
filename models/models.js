var mongoose = require("mongoose");

const locationschema = mongoose.Schema({
	location_name: 	{type:String, required:true},
	no_of_visits:	{type:Number , default: 0}
});

const staffschema = mongoose.Schema({
	_id:					{type:String , required:true},
	staff_name: 			{type:String, required:true},
	working_location:		{type:String , required:true},
	efficiency:				{type:Number, default: 0},
	efficiency_delta:		{type:Number, default: 0},
	efficiency_percentage:	{type:Number, default: 0},
	nps:					{type:Number, default: 0},
	nps_delta:				{type:Number, default: 0},
	reported_issues: [{
		location_id:	{ type:String , required:true},
		description: 	{ type:String , required:true},
		is_key:			{ type:Boolean, default: false }
	}]
});


const userschema = mongoose.Schema({
	_id: 					{type:String, required:true},
	first_name:				{type:String },
	last_name:				{type:String },
	email: 					{type:String },
	no_of_patients_seen:	{type:Number , default: 0}
});


var staffModel = mongoose.model('Staff', staffschema);
var locationModel = mongoose.model('Location', locationschema);
var userModel = mongoose.model('User', userschema);



module.exports = {staffModel, locationModel, userModel};
