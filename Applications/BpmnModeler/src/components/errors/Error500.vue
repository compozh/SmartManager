<template>
  <div>
    <v-row style="font-size: 40px;" justify="center" class="pt-10 pb-0">
      {{$t('bpmn.errors.Er500')}}
    </v-row>
    <v-row style="font-size: 20px;" justify="center" class="pt-0 pb-5">
      {{$t('bpmn.errors.Wait')}}
    </v-row>
    <v-col style="font-size: 20px;" class="pt-10">
      <v-row  justify="center" >
        <p>{{$t('bpmn.errors.TryAgain')}}</p>
      </v-row>
      <v-row  justify="center">
        <p> {{$t('bpmn.errors.GoTo')}} <v-btn text color="blue" :to="{ path: '/'}">{{$t('bpmn.errors.HomePage')}}</v-btn></p>
      </v-row>
    </v-col>
  </div>
</template>

<script>
export default {
  name: 'error-500',
  data: () => ({
    route: {}
  }),
  methods: {
    '$eval'(expr) {
      return eval(expr)
    },
  }
}
</script>