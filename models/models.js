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


const graph_data = mongoose.Schema ({
	entry_date: {type: Date, default: Date.now},
	value:		{type:Number , default: 0}
});


const graphSchema = mongoose.Schema ({
	_id:			{type: Number, default: 1},
	c_value: 		{type: Number, default: 0},
	delta:			{type: Number, default: 0},
	graph_values: 	[graph_data]
});



var staffModel = mongoose.model('Staff', staffschema);
var locationModel = mongoose.model('Location', locationschema);
var userModel = mongoose.model('User', userschema);
var footfallModel = mongoose.model('FootFall', graphSchema);
var npsModel = mongoose.model('PatientSartisfaction', graphSchema);
var revenueModel = mongoose.model('Revenue', graphSchema);



module.exports = {
	staffModel, 
	locationModel, 
	userModel,
	footfallModel,
	npsModel,
	revenueModel
};
