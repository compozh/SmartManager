<template>
  <div>
    <v-row style="font-size: 40px;" justify="center" class="py-10">
      <p>{{$t('mes.errors.Er402')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center" >
      <p>{{$t('mes.errors.Search')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center">
      <p> {{$t('mes.errors.GoTo')}} <v-btn text color="blue" :to="{path: '/', query : {fixedUuid: $route.query.fixedUuid}}>{{$t('mes.errors.HomePage')}}</v-btn></p>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'error-402',
  data: () => ({
    route: {}
  }),
}
</script>