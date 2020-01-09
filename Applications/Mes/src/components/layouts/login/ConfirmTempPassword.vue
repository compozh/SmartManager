<template>
    <div>
        <confirmTempPassword v-slot="{ properties }">
            <v-layout>
                <v-flex>
                    <v-text-field   v-bind='properties.tempPasswordFieldAttrs' color="cyan"  v-on="properties.tempPasswordFieldEvents"></v-text-field>
                </v-flex>
                <v-flex>
                    <v-btn  v-on="properties.sendTempPasswordFieldEvents" class="cyan white--text text-xs-right send-btn">
                       {{properties.buttonSendName}}
                    </v-btn>
                </v-flex>
            </v-layout>
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
