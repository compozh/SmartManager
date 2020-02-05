<template>
  <div>
    <v-row style="font-size: 40px;" justify="center" class="py-10">
      <p>{{ $route.query.from == 'project' ? $t('bpmn.errors.NoFolder') : $t('bpmn.errors.NoDiagram')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center" >
      <p>{{$t('bpmn.errors.Search')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center">
      <p> {{$t('bpmn.errors.GoTo')}} <v-btn text color="blue" :to="{path: '/'}">{{$t('bpmn.errors.HomePage')}}</v-btn></p>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'error-404',
  data: () => ({
    route: {}
  }),
}
</script>