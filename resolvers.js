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

		graph_data: async (_, {graph, from, to}) => {
			var data;

			var date_filter = 	{"$match": {
									'graph_values.entry_date': {
											$gte: new Date(from),
											$lte: new Date(to)
										}}};
			var field_filter =	{"$project":{
									"_id":"$_id",
									"c_value": "$c_value",
    								"delta": "$delta",
									"entry_date":"$graph_values.entry_date",
									"value":"$graph_values.value",
								}};

			var group_data = { $group:{
								_id: {_id: '$_id', c_value: '$c_value', delta: '$delta'},
								values:{ $push:{entry_date:'$entry_date',value:'$value'}}}
							};
			var merge_data = {"$project": {
									"_id": "$_id._id",
									"c_value": "$_id.c_value",
									"delta": "$_id.delta",
									"graph_values":"$values"
							  }};
			var pipeline = [{"$unwind":"$graph_values"}, date_filter, field_filter, group_data, merge_data];

			if (graph == "revenue"){
				data = await revenueModel.aggregate( pipeline ).exec();
			}else if(graph == "nps"){
				data = await npsModel.aggregate( pipeline ).exec();
			}else if(graph == "footfall"){
				data = await footfallModel.aggregate( pipeline ).exec();
			}

			return JSON.parse(JSON.stringify(data))[0];
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
		}, 

		AddUser : async (_, {username, first_name, last_name, email}) => {

			const staff = new staffModel(
				{
					_id: username,	first_name,	last_name, email
				});
			
			await staff.save();

			return staff;
		},

		AddGraphValue : async (_, {graph, entry_date, value}) => {
			var data;

			if (graph == "revenue"){
				data = await revenueModel.updateOne(
					{_id: 1}, {
						$push: { 
							graph_values: { entry_date, value}
						}
					}, {upsert : true} ).exec();
			}else if(graph == "nps"){
				data = await npsModel.updateOne(
					{_id: 1}, {
						$push: { 
							graph_values: { entry_date, value}
						}
					}, {upsert : true} ).exec();

			}else if(graph == "footfall"){
				data = await footfallModel.updateOne(
					{_id: 1}, {
						$push: { 
							graph_values: { entry_date, value}
						}
					}, {upsert : true} ).exec();

			}

			return {entry_date, value};
		},

		UpdateGraphTotals : async (_, {graph, c_value, delta}) => {
			var data;

			if (graph == "revenue"){
				data = await revenueModel.updateOne(
					{_id: 1}, {c_value, delta }, {upsert : true} ).exec();
			}else if(graph == "nps"){
				data = await npsModel.updateOne(
					{_id: 1}, {c_value, delta }, {upsert : true} ).exec();
			}else if(graph == "footfall"){
				data = await footfallModel.updateOne(
					{_id: 1}, {c_value, delta }, {upsert : true} ).exec();
			}

			return {c_value, delta};
		}

	}
  };
  

  module.exports = resolvers;