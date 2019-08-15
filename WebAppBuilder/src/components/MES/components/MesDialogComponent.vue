<template>
    <v-dialog
      v-model="dialogVisible"
      @input="dialogInput"
      max-width="290"
    >
        <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text>{{message}}</v-card-text>

        <v-card-actions>
        <v-btn
            color="green darken-1"
            flat="flat"
            @click="agreeClick"
        >
            {{agreeMessage}}
          </v-btn>
        <v-btn
            color="green darken-1"
            flat="flat"
            @click="disagreeClick"
        >
            {{disagreeMessage}}
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
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(value) {
                
            }
        }
    },
	methods: {
		agreeClick() {
			this.$emit('agreeClick');
        },
        disagreeClick() {
            this.$emit('disagreeClick');
        },
        dialogInput() {
            this.$emit('dialogInput');
        }
	}
}
</script>

<style scoped>
  .v-card__actions {
    justify-content: flex-end;
  }
</style>