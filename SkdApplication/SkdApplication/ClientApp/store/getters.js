import _ from "lodash"


var userFilterFunction = state => {
	var users =state.users_list.filter(u=> {
		if(!state.filter){
			return true;
		}
		return u.P_FIO && u.P_FIO.toUpperCase().includes(state.filter.toUpperCase()) ||
			u.TEL && u.TEL.toUpperCase().includes(state.filter.toUpperCase()) ||
			u.EMAIL && u.EMAIL.toUpperCase().includes(state.filter.toUpperCase())
	});
	if(!state.sort){
		return users;
	}
	function compare(a,b) {
		if (a.R_DT < b.R_DT)
			return 1;
		if (a.R_DT > b.R_DT)
			return -1;
		return 0;
	}
	
	return users.sort(compare)
};

//дял получения состояния в объектах vue
export default {
	getUsersListFiltered: state => userFilterFunction(state),
	getGroupedUserList: state => {
		
		var users = userFilterFunction(state);
		switch (+state.grouping){
			case 0:
				return [{group:"", users}]
			case 1:
				return [{group:"", users: _.filter(users, u => !u.IsGone && !u.IsAbsend)}]
			case 3:
				return [{group:"", users: _.filter(users, u => u.IsGone || u.IsAbsend)}]
			case 4:
				
				return _.transform(_.groupBy(users, u => u.DEPARTMENT), (result, users, group) => {
					result.push({group, users})
				}, []);
				
			case 5:
				return _.transform(_.groupBy(users, u => u.PLACENAME), (result, users, group) => {
					result.push({group, users})
				}, []);
			
		}
		
	},
	getUsersList: state => state.users_list,
	getUser: state => state.user,
	getFilter:state=>state.filter,
	loaded: state=> state.loaded
};
