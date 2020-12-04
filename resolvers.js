

const resolvers = {
	Query: {
		locations: () => {
			return [ {no_of_visits: 1}, {no_of_visits: 2}];
		},

		location: (root, {id}) => {
			if( id == 1)
				return {no_of_visits: 1};
			else
				return {};
		},
	},

	Mutation: {
		AddAssessment:() => {
			
		}
	}
  };
  

  module.exports = resolvers;