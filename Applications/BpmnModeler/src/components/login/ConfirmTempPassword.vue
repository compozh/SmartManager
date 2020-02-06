<template>
    <div>
        <confirmTempPassword v-slot="{ properties }">
            <v-row>
                <v-col>
                    <v-text-field   v-bind='properties.tempPasswordFieldAttrs' color="cyan"  v-on="properties.tempPasswordFieldEvents"></v-text-field>
                </v-col>
                <v-col>
                    <v-btn  v-on="properties.sendTempPasswordFieldEvents" class="cyan white--text text-right send-btn">
                       {{properties.buttonSendName}}
                    </v-btn>
                </v-col>
            </v-row>
        </confirmTempPassword>
    </div>
</template>
<script>
import confirmTempPassword from './renderless/ConfirmTempPassword'

export default {
  components: {
    'confirmTempPassword': confirmTempPassword,
  }
}
</script>

<style scoped>
.send-btn{
    margin-top: 12px;
}
</style>
