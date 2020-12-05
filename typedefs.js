const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {

	user(username: String!): User


	locations: [ Location ]

	key_issues: [ Key_Issue ]

	location_staff(location_id: ID!): [ Staff ]

	graph_values(location_id: ID!, period: String): [ Graph_Values ]

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

	type Graph_Values {
		foot_fall_graph: [Foot_Fall]
		patient_sartisfaction_graph: [Partient_Sartisfaction]
		revenue_graph: [Revenue]
	}


	type Foot_Fall {
		patient_count:	Float
		patient_cdelta:	Float
		graph_values:	[ Float ]
	}

	type Partient_Sartisfaction {
		nps:			Float
		nps_delta:		Float
		graph_values:	[ Float ]
	}

	type Revenue {
		revenue:		Float
		revenue_delta:	Float
		graph_values:	[ Float ]
	}

	type Key_Issue {
		description:	String!
		location_name:	String!
	}


type Mutation {

	AddStaff (
		staff_no:				String!
		staff_name:				String!
		location_id:			String!
	) : Int

	AddLocation (
		location_name:				String!
	) : String

	UpdateStaffAssessment(
					staff_no:				String!,
					working_location_id:	Int!
					efficiency:				Int,
					e_delta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               :				Float,
					nps:					Float,
					nps_delta:				Float,
					efficiency_percent:		Float
		):String

	AddIssue (
			location_id:		ID!,
			reporting_staff_no: ID!,
			description:		String!,
			isKeyIssue:			Boolean
		): Staff
 }

`;

module.exports = typeDefs;