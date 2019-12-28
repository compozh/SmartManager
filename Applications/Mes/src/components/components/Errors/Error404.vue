<template>
  <div>
    <v-row style="font-size: 40px;" justify="center" class="py-10">
      <p>{{$t('mes.errors.Er404')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center" >
      <p>{{$t('mes.errors.Search')}}</p>
    </v-row>
    <v-row style="font-size: 20px;" justify="center">
      <p> {{$t('mes.errors.GoTo')}} <v-btn text color="blue" to="/">{{$t('mes.errors.HomePage')}}</v-btn></p>
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