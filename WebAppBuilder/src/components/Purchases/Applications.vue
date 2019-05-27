<template>
    <div v-if="applications">
        <v-layout>
            <v-flex />
            <v-flex md2 xs3>
                <v-layout row>
                    <v-select 
                        v-show="this.$vuetify.breakpoint.mdAndUp && currentViewComp.value=='row'" 
                        :items="sizeItemsFltr()" 
                        v-model="currentSizeComp" 
                        return-object />
                    &nbsp;
                    <v-select 
                        v-show="this.$vuetify.breakpoint.smAndUp" 
                        :items="viewItems" 
                        v-model="currentViewComp"
                        return-object />
                </v-layout>
            </v-flex>
        </v-layout>
        <!-- Карточки v-bind="{ [`${viewType}`]: true }"-->
        <v-layout v-bind="{ [`${currentViewComp.value}`]: true }" wrap justify-center>
            <v-flex class="application-card"
                v-for="application in getItemsOnPage()" :key="application.id" 
                v-bind="{ [`xs${currentSizeComp.value}`]: true }" 
                v-bind:pagination.sync="pagination"
                v-touch="{
                            left: () => swipeLeft(application),
                            right: () => swipeRight(application),
                        }"
                >
                <router-link :to="{ name:'APPLICATION', params:{applicationId:application.id}}">
                    <v-card tile height="150px" >
                        <v-progress-linear class="application-execution"
                            :value="35" height="10"
                            color="blue-grey"
                            />
                        <v-card-title>
                            Номер: {{ application.number }} Дата: {{ application.date | formatDate }}
                        </v-card-title>
                        <v-card-text>
                            {{ application.title }}
                        </v-card-text>
                        <v-card-actions>
                            <v-layout justify-end>
                                <v-btn icon flat :color="blinkColor" class="application-chat" v-on:click.prevent="chatClick(application)">
                                    <v-icon>chat</v-icon>
                                </v-btn>
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
            viewItems: [
                { value: "row",    text: "Плитки" },
                { value: "column", text: "Таблица" }
            ],
            sizeItems: [
                { value: "3", text: "Маленькие", itemsPerPage: 24, },
                { value: "5", text: "Большие",   itemsPerPage: 14, }
            ],
            currentView: null,
            currentSize: null,
            pagination: {
                page: 1
            },
            blinkColor: "blue"
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
            currentSizeComp:{
                get() {
                    if (this.currentSize== null)
                    {
                        this.currentSize = this.sizeItems[0];
                    }
                    if (this.$vuetify.breakpoint.smAndDown && this.currentSize != this.sizeItems[1]){
                        this.currentSize = this.sizeItems[1];
                    }
                    return this.currentSize;
                },
                set(newVal) {
                    this.currentSize = newVal; 
                }
            },
            currentViewComp:{
                get() {
                    if (this.currentView == null)
                    {
                        this.currentView = this.viewItems[0];
                    }
                    if (this.$vuetify.breakpoint.xsOnly && this.currentView != this.viewItems[1]){
                        this.currentView = this.viewItems[1];
                    }
                    return this.currentView;
                },
                set(newVal) {
                    this.currentView = newVal; 
                }
            },
            rowsPerPage: {
                get() {
                    return this.currentView.value == "row" ? this.currentSizeComp.itemsPerPage : 18;
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
            chatClick(appl){
                console.log(`TODO: chat for application #${appl.number}`)
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

<style>
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
@keyframes blink {
    from {
        opacity: 1; 
    }               
    50%{
        opacity: 0; 
    }
    to {
        opacity: 1; 
    }               
}
.application-chat{
    animation: blink 1s infinite;
    color: chocolate !important;
    
}
</style>