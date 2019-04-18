const getters = ({
    getAppData (state) {
        return key=>state.appData[key]
    },
    
    
    getCurrentUser(state){
        return state.currentuser
    },
    getDictionarylanguage(state){
        return state.dictionaryLanguage;
    },
    getCurentLanguage(state){
        return state.curentLanguage;
    }
    
});
export default getters
