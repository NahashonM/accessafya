var mongoose = require("mongoose");
var {staffModel, 
	locationModel,
	userModel} = require('./models/models');

const dbName = "db_accessafya";
const dbPort = 27017;
const dbUrl = 'localhost';
const dbLocation = `mongodb://${dbUrl}:${dbPort}/${dbName}`;

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

			return staff;

		},

		graph_values: (root, {location_id, period}) => {
			// Todo--
			// Query db
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
			
			return 001;
		},

		AddLocation: async (_, { location_name }) => {	
			const location = new locationModel({
					location_name
				});

			await location.save();
			
			return location.id;
		},

		UpdateStaffAssessment:(root, args) => {
			// ToDo----
			// update db
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
			
			console.log(staff);

			return staff;
		}
	}
  };
  

  module.exports = resolvers;