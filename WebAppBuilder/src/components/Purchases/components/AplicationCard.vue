<template>
    <div class="application-card" v-if="application">
            <router-link :to="{ name:'APPLICATION', params: {applicationId: application.id}}">
                <v-card min-height="150px">
                    
                    <esecute-stepper :currentStage="application.docStatus.sortOrder" :minimalistStyle ="true"/>
                    <v-card-title>
                        {{$t('purchases.CartItems.Number')}}: {{ application.number }} {{$t('purchases.CartItems.Date')}}: {{ application.date | formatDate }}
                    </v-card-title>
                    <v-card-text>
                        {{ application.title }}                    
                    </v-card-text>
                    <v-card-actions>
                        <v-layout justify-end>
                            <favorite-btn :v-model="application" value="a" alias="DOC" :keyValue="application.id.toString()"  />
                            <chat-btn :chatKey="application.id" chatType="application"/>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </router-link>
    </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();


export default {
    name: "applicationCard",
    props: { 
        //applicationId: 0,
        application: {}
    },
    filters:{
        formatDate: (value) => {
            if (value) {
                return moment(String(value)).format('DD.MM.YYYY')
            }
        }
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
    text-align: left;
    margin-left: 10px;
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