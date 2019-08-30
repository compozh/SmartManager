<template>
    <div>
        <confirm v-slot="{ confirm }">
            <v-layout>
                <v-flex>
                    <v-text-field :label='confirm.confirmAttrs.label' color="cyan"  v-on="confirm.SetCode"></v-text-field>
                </v-flex>
                <v-flex>
                    <v-btn  v-on="confirm.SendConfirmCode" class="cyan white--text text-xs-right send-btn">
                       ОТПРАВИТЬ
                    </v-btn>
                </v-flex>
            </v-layout>
        </confirm>
    </div>
</template>
<script>
import confirm from '../renderless/ConfirmPassword'

export default {
  components: {
    'confirm': confirm,
  }
}
</script>

<style scoped>
.send-btn{
    margin-top: 12px;
}
</style>