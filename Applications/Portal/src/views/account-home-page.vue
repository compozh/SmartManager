<template>
  <div>
    <vs-row>
      <vs-col vs-type="flex" vs-justify="center"  vs-w="6">
        <account-personal-info-page :min-mode="true" style="width:100%"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center"  vs-w="6">
        <vx-card title="ТМЦ">
          <account-tmc-page :min-mode="true" style="width:100%"/>
        </vx-card>

      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
