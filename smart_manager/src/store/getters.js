const getters = ({
    getAppData (state) {
        return key=>state.appData[key]
    },
    
    
    getCurrentUser(state){
        return state.currentuser
    }
    
});
export default getters
