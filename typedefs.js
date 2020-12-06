const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {

	user(username: String!): User


	locations: [ Location ]

	key_issues: [ Key_Issue ]

	location_staff(location_id: ID!): [ Staff ]

	# period => month/ date/year
	graph_data(graph: String!, from: String!, to: String!): graphData
}


	type User {
		_id:					ID!
		first_name:				String
		last_name:				String
		email:					String
		no_of_patients_seen:	Int
	}


	type Location {
		_id:			ID!
		location_name:	String!
		no_of_visits:	Int
	}


	type Staff {
		# staff number = _id
		_id:					ID!
		staff_name:				String!
		efficiency:				Int
		efficiency_delta:		Float
		efficiency_percentage:	Float
		nps:					Float
		nps_delta:				Float
		no_of_issues_reported:	Int
	}

	type Graph_Data_Entries {
		entry_date:		String
		value:			Float
	}

	type graphData {
		c_value:		Float
		delta:			Float
		graph_values:	[ Graph_Data_Entries ]
	}


	type Key_Issue {
		description:	String!
		location_name:	String!
	}

	type Reported_Issue {
		_id:			String
		location_id:	String!
		description: 	String!
		is_key:			Boolean
	}

type Mutation {

	AddStaff (
		staff_no:				String!
		staff_name:				String!
		location_id:			String!
	) : Staff

	AddLocation (
		location_name:				String!
	) : Location

	Update_Staff_Work_Location(
		staff_no:				String!,
		working_location_id:	ID!
	):Staff

	Update_Staff_Efficiency(
		staff_no:				String!,
		efficiency:				Float,
		e_delta:				Float,
		efficiency_percent:		Float
	):Staff

	Update_Staff_Nps(
		staff_no:				String!,
		nps:					Float,
		nps_delta:				Float,
	):Staff

	AddIssue (
			location_id:		ID!,
			reporting_staff_no: ID!,
			description:		String!,
			isKeyIssue:			Boolean
		): [Reported_Issue]
	
	AddUser (
			username:				ID!,
			first_name:				String,
			last_name:				String,
			email:					String
		): User
	
	AddGraphValue(
		graph:				String!
		entry_date:			String!
		value:				Float!
	): Graph_Data_Entries

	UpdateGraphTotals(
		graph:				String!
		c_value:			Float!
		delta:				Float!
	): graphData
 }

`;

module.exports = typeDefs;