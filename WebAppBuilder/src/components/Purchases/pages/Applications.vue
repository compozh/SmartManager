<template>
    <div v-if="applications">
        <v-layout row justify-end>
            <v-btn icon v-show="this.$vuetify.breakpoint.smAndUp">
                <v-icon v-text="rowView ? 'view_stream' : 'view_column'" @click="rowView = !rowView"/>
            </v-btn>
        </v-layout>
        <!-- Карточки -->
        <v-layout v-bind="{ [`${rowView ? 'row' : 'column'}`]: true }" wrap justify-center>
            <v-flex class="application-card"
                v-for="application in getItemsOnPage()" :key="application.id" 
                v-bind="{ [`xs${smallSize ? '5' : '3'}`]: true }" 
                v-bind:pagination.sync="pagination"
                v-touch="{
                            left: () => swipeLeft(application),
                            right: () => swipeRight(application),
                        }"
                >
                <router-link :to="{ name:'APPLICATION', params: {applicationId: application.id}}">
                    <v-card tile height="150px" >
                        <esecute-stepper />
                        <v-card-title>
                            {{$t('purchases.CartItems.Number')}}: {{ application.number }} {{$t('purchases.CartItems.Date')}}: {{ application.date | formatDate }}
                        </v-card-title>
                        <v-card-text>
                            {{ application.title }}
                        </v-card-text>
                        <v-card-actions>
                            <v-layout justify-end>
                                <favorite-btn :v-model="application" value="a" alias="KSM" :keyValue="application.id"  />
                                <chat-btn :chatKey="application.id" chatType="application"/>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </router-link>
            </v-flex>
        </v-layout>
        <!-- Пагинатор -->
        <v-pagination
            v-model="pagination.page" :length="pages"
            :total-visible="7"
            />
    </div>
</template>

<script>
import moment from 'moment';

    export default {
        name: "applications",
        props: ["applications"],
        data: () => ({
            rowView: true,
            smallSize: true,
            pagination: {
                page: 1
            }
        }),
        filters:{
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY')
                }
            }
        },
        computed: {
            pages: {
                get() { 
                    return Math.ceil(this._props.applications.length / this.rowsPerPage);
                }
            },
            rowsPerPage: {
                get() {
                    return this.rowView ? 24 : 18;
                }
            }
        },
        methods:{
            getItemsOnPage(){
                //debugger;
                return this._props.applications.slice(
                    (this.pagination.page - 1) * this.rowsPerPage, 
                    this.pagination.page * this.rowsPerPage)
            },
            sizeItemsFltr(){
                return this.sizeItems.filter(i=> this.$vuetify.breakpoint.mdAndUp || i.value != 3);
            },
            swipeLeft(appl){
                console.log(`TODO: swipe left for application #${appl.number}`)
            },
            swipeRight(appl){
                console.log(`TODO: swipe right for application #${appl.number}`)
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>
.application-card{
    padding: 5px;
    margin: 5px;
}
.application-card a{
    text-decoration: none;
}
.application-card .v-card__title {
    font-size: 15px;
    font-weight: 600;
    padding: 5px 15px;
}
.application-card .v-card__text {
    padding: 5px;
    height: 40px;
}
.application-card .v-card__actions {
    padding: 5px;
}
.application-execution{
    margin: 0px 0px 5px 0px;
}

</style>