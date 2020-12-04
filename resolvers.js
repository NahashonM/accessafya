

const resolvers = {
	Query: {
		user: (root, {user_id, password}) => {
			// Todo--
			// Query db

		},
		
		locations: () => {
			// Todo--
			// Query db
		},

		key_issues: () => {
			// Todo--
			// Query db
		},

		location_staff: (root, {location_id}) => {
			// Todo--
			// Query db
		},

		graph_values: (root, {location_id, period}) => {
			// Todo--
			// Query db
		}
	},


	Mutation: {
		UpdateStaffAssessment:(root, {
										staff_no,
										efficiency,
										e_delta,
										nps,
										nps_delta,
										efficiency_percent }) => {
			// ToDo----
			// Add to db
		},

		AddIssue:(root, {
							location_id,
							reporting_staff_no,
							description,
							isKeyIssue}) => {
			// ToDo----
			// Add to db
		}
	}
  };
  

  module.exports = resolvers;