export default {
    name:"root-component",


//////////////////////////////////////////////////
//////              METHODS
/////////////////////////////////////////////////

    methods:{

    },
//////////////////////////////////////////////////
//////              RENDER
/////////////////////////////////////////////////

    render(h){

        var app = this.$store.state.applicationDescription;
        if(!app || !app.RootComponent){
            return h("span", ["ERROR, application is absend"])
        }
        return h(app.RootComponent.Name)

    }



}