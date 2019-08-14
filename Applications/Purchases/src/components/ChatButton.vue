<template>
    <div class="chat-button">
        <v-btn icon flat :class="`application-chat${hasMessage ? `-has-message` : ``}`" v-on:click.prevent="chatClick(application)">
            <v-icon>chat</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
  name: 'chat-btn',
  props: {
    chatKey: {
      type: undefined,
      required: true
    },
    chatType: {
      type: String,
      required: true
    }
  },
  computed: {
    hasMessage() {
      return false
    }
  },
  methods: {
    chatClick(appl) {
      console.log(`TODO: chat for application #${this.key}`)
    }
  }
}
</script>

<style scoped>
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
.chat-button .application-chat-has-message{
    animation: blink 1s infinite;
    color: chocolate !important;
    
}
.chat-button .application-chat{
    animation: none;
    color: cornflowerblue;
    
}
</style>