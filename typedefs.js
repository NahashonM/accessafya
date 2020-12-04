const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {

	user(user_id: Int!, password: String!): User


	locations: [ Location ]

	key_issues: [ Key_Issue ]

	location_staff(location_id: Int!): [ Staff ]

	graph_values(location_id: Int!, period: String): [ Graph_Values ]

}


	type User {
		id:						Int!
		name:					String!
		email:					String
		no_of_patients_seen:	Int
		password_hash:			String
	}

	type Location {
		id:				Int!
		name:			String!
		no_of_visits:	Int
	}


	type Staff {
		staff_no:				Int!
		staff_name:				String!
		efficiency:				Int
		efficiency_delta:		Float
		nps:					Float
		nps_delta:				Float
		efficiency_percent:		Float
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
	UpdateStaffAssessment(
					staff_no:			Int!,
					efficiency:			Int,
					e_delta:			Float,
					nps:				Float,
					nps_delta:			Float,
					efficiency_percent:	Float
		):String

	AddIssue (
			location_id:		Int!,
			reporting_staff_no: Int!,
			description:		String!,
			isKeyIssue:			Boolean
		): String
 }

`;

module.exports = typeDefs;