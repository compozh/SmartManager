<template>
  <div>
    <v-row style="font-size: 40px;" justify="center" class="py-10">
      <p>{{$t('bpmn.errors.Er403')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center" >
      <p>{{$t('bpmn.errors.Search')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center">
      <p> {{$t('bpmn.errors.GoTo')}} <v-btn text color="blue" :to="{ path: '/'}">{{$t('bpmn.errors.HomePage')}}</v-btn></p>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'error-403',
  data: () => ({
    route: {}
  }),
};
</script>