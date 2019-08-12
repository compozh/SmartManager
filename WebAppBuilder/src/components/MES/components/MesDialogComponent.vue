<template>
    <v-dialog
      v-model="visible"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>

        <v-card-text>
          {{message}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="disagreeClick"
          >
            {{disagreeMessage}}
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="agreeClick"
          >
            {{agreeMessage}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script>
export default {
	name: "mes-dialog-component",
	props: {
        title: String,
        message: String,
        agreeMessage: String,
        disagreeMessage: String,
        visible: Boolean
    },
	methods: {
		agreeClick() {
			this.$emit('agreeClick');
        },
        disagreeClick() {
            this.$emit('disagreeClick');
        }
	}
}
</script>

<style scoped lang="scss">

</style>