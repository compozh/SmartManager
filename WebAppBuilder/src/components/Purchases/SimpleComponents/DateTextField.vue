<template>
    <div>
        <v-text-field :label="labelNameComp" readonly  class="date-input"
        :disabled="!editable"
        append-icon="event"  @click:append="dialog = true"
        :value="dateType[fieldNameComp] | formatDate" 
        />
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-date-picker v-model="dateType[fieldNameComp]" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="dialog = false; callBack()">OK</v-btn>
            </v-date-picker>
        </v-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "date-text-field",
        props:{
            dateType: {},
            fieldName: "",
            labelName: "",
            editable: true
        },
        data:()=>({
            dialog: false
        }),
        computed:{
            fieldNameComp(){
                return this.fieldName ? this.fieldName : "date";
            },
            labelNameComp(){
                if (this.labelName)
                    return this.labelName;
                return "Дата";
            }
        },
        filters:{
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY')
                }
            }
        },
        methods:{
            callBack(){
                this.$emit('onChangeValue', this.dateType[this.fieldNameComp])
            }
        }
    }
</script>

<style>
.date-input input{
  text-align: center;
}
</style>