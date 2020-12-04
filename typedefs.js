const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
	user(id: Int!, password: String!): User

	locations: [ Location ]
	location(id: Int!): Location
}


type User {
	id:						Int
	name:					String!
	email:					String!
	no_of_patients_seen:	Int
}


type Location {
	id:						Int
	name:					String!
	no_of_visits:			Int
	staff:					[ Staff! ]
	revenue:				Revenue
	foot_fall:				Foot_fall
	partient_satisfaction:	Partient_satisfaction
}


type Staff {
	staff_no:			Int!
	staff_name:			String!
	efficiency:			Int
	e_delta:			Float
	nps:				Float
	nps_delta:			Float
	efficiency_percent:	Float
	reported_issues:	[ Issues ]
}


type Foot_fall {
	patient_count:	Float
	patient_cdelta:	Float
	graph_values:	[ Float ]
}

type Partient_satisfaction {
	nps:			Float
	nps_delta:		Float
	graph_values:	[ Float ]
}

type Revenue {
	revenue:		Float
	revenue_delta:	Float
	graph_values:	[ Float ]
}

type Issues {
	description:	String!
	is_key_issue:	Boolean!
}


type Mutation {
	AddAssessment:String
 }


`;

module.exports = typeDefs;