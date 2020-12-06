# GraphQL API

GraphQL api to be consumed by the front-end team
## Usage
Use <br>
`npm run start` to start the server or <br>
`npm run dev-server` with nodemon in development

### Queries
* To retrieve information about a user<br>
	`user(username: _Username_of_user_) { _fields_required_ }`

* To get information of all locations<br>
    `locations() { _fields_required_ }`

* To get all staff working in a location<br>
    `location_staff(location_id: _id_of_the_location_) { _fields_required_ }`

* To get key issues<br>
	`key_issues() { _fields_required_ }`

* To query graph values<br>
	`graph_data(graph: _which_graph_, from: _date_, to: _date_) { _fields_required_ }`<br>

	`_which_graph_` can be any of the following Strings
	* revenue
	* nps
	* footfall
	`from` and `to` are date strings of the form: <br> `mm/dd/yyyy`
	
	__Example__ Querying revenue graph values would be<br>
	`graph_data(graph: "revenue", from: "10/20/2019", to: "10/20/2020") { _fields_required_ }`<br>

### Mutations
* To add a user <br>
  `AddUser(username, first_name, last_name, email) { _Added_user_data_ }`

* To add a staff <br>
  `AddStaff(staff_no, staff_name, location_id) { _Added_staff_data_ }`
  
* To add a Location <br>
`AddLocation(location_name) { _Added_location_data_ }`

* To update efficiency details of a staff <br>
`Update_Staff_Efficiency(staff_no, efficiency, e_delta, efficiency_percent) { _updated_staff_data_ }`

* To update nps values of a staff<br>
`Update_Staff_Nps(staff_no, nps, nps_delta) { _updated_staff_data_ }`

* To update a staff's working location<br>
`Update_Staff_Work_Location(staff_no, working_location_id) { _updated_staff_data_ }`

* To add an issue<br>
`AddIssue(location_id, reporting_staff_no, description, isKeyIssue) { _list_of_issues_reported_by_same_staff_ }`

* To add graph data values<br>
  * for total and delta fields<br>
    `UpdateGraphTotals(graph,c_value, delta){ ___ }`

  * for value entries AddGraphValue<br>
	`AddGraphValue(graph,entry_date,value){ ___ }`


#### Dependancies
* nodejs: 14.15.1
* express: ^4.17.1
* apollo-server-express: ^2.19.0
* graphql: ^15.4.0
* mongoose: ^5.11.3
