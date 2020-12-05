var mongoose = require("mongoose");
var {staffModel, 
	locationModel,
	userModel, 
	footfallModel,
	npsModel,
	revenueModel} = require('./models/models');

const dbName = "db_accessafya";
const dbPort = 27017;
const dbUrl = 'localhost';
const dbLocation = `mongodb://${dbUrl}:${dbPort}/${dbName}`;


const count_reported_issues = (staffObject) => {
	staffObject.forEach(function(staff) {
		staff.no_of_issues_reported = staff.reported_issues.length;
	});
};


const resolvers = {
	Query: {
		user: async (_, {username}) => {
			const user = await userModel.find({ _id: username }).exec();
      		return user;
		},
		
		locations: async () => {

			const locations = await locationModel.find().exec();
			return locations;

		},

		key_issues: async () => {

			const key_issues = await staffModel.aggregate([
					{$unwind:"$reported_issues"}, 
					{$match: {'reported_issues.is_key': true}},
					{$project: {
						location_id: { $toObjectId:'$reported_issues.location_id'},
						description: '$reported_issues.description'}}, 
					{$lookup: {
						from: "locations", 
						localField: "location_id", 
						foreignField: "_id", 
						as: "location_name"}},
					{$project: {
						location_name: { $arrayElemAt: [ "$location_name.location_name", 0 ] }, 
						description: '$description'}}
			]).exec();

			return key_issues;

		},

		location_staff: async (_, {location_id}) => {

			const staff = await staffModel.find({
				working_location: location_id
			}).exec();

			var staffjson = JSON.parse(JSON.stringify(staff));
			count_reported_issues(staffjson);

			return staffjson;
		},

		revenue_data: async (_, {period}) => {
			const revenue = await revenueModel.find({
				"graph_values.entry_date": period
			}).exec();

			return revenue;

		},

		patient_sartisfaction_data: async (_, {period}) => {
			const nps = await npsModel.find({
				"graph_values.entry_date": period
			}).exec();

			return nps;
		},

		footfall_data: async (_, {period}) => {
			const footfall = await footfallModel.find({
				"graph_values.entry_date": period
			}).exec();

			return footfall;
		}
	},


	Mutation: {

		AddStaff: async (_, { staff_no, staff_name, location_id }) => {	

			const staff = new staffModel({
					_id: staff_no,
					staff_name: staff_name,
					working_location: location_id
				});

			await staff.save();
			
			var staffjson = JSON.parse(JSON.stringify(staff));
			staffjson[0].reported_issues = 0;

			return staff;
		},

		AddLocation: async (_, { location_name }) => {

			const location = new locationModel({
					location_name
				});

			await location.save();
			
			return location;
		},

		Update_Staff_Efficiency: async (_, {
			staff_no, efficiency, e_delta, efficiency_percent }) => {

			const staff = await staffModel.findOneAndUpdate(
				{ _id: staff_no }, 
				{
					$set: { 
						staff_name: staff_no,
						efficiency: efficiency,
						efficiency_percentage: efficiency_percent,
						efficiency_delta: e_delta
					}
				}).exec();

			var staffjson = JSON.parse(JSON.stringify(staff));
			count_reported_issues(staffjson);
				
			return staff;
		},

		Update_Staff_Nps: async (_, { staff_no, nps, nps_delta }) => {

			const staff = await staffModel.findOneAndUpdate(
				{ _id: staff_no }, 
				{
					$set: { 
						nps,
						nps_delta
					}
				}).exec();
			
			var staffjson = JSON.parse(JSON.stringify(staff));
			count_reported_issues(staffjson);

			return staff;
		},

		Update_Staff_Work_Location: async (_, { staff_no, working_location_id }) => {

			const staff = await staffModel.findOneAndUpdate(
				{ _id: staff_no }, 
				{
					$set: { 
						working_location: working_location_id
					}
				}).exec();
			
			var staffjson = JSON.parse(JSON.stringify(staff));
			count_reported_issues(staffjson);

			return staff;
		},

		AddIssue: async (_, {location_id, reporting_staff_no, description, isKeyIssue}) => {

			const staff = await staffModel.findOneAndUpdate(
				{ _id: reporting_staff_no }, 
				{
					$push: { 
						reported_issues: {
							location_id,
							description,
							is_key: isKeyIssue
						}
					}
				}).exec();
			
			var staffjson = JSON.parse(JSON.stringify(staff));

			return staffjson.reported_issues;
		}
	}
  };
  

  module.exports = resolvers;