<template>
  <v-menu v-model="menu"
          :close-on-content-click="false"
          offset-y
          transition="scroll-y-transition">

    <template #activator="{ on }">
      <v-avatar v-on="on" color="primary" class="mr-3" size="32px">
        <v-img v-if="userPhoto" :src="userPhoto"/>
        <fa-icon v-else icon="user" inverse/>
      </v-avatar>
    </template>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">{{ userName }}</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="at"/>
        </v-list-item-icon>
        <v-list-item-title class="body-2">{{ userLogin }}</v-list-item-title>
      </v-list-item>

      <v-divider/>

      <v-list-item v-if="delegatedRights.length"
                   @click="rightsDialog = true">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user-tag"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">
          {{ $t('user.delegatedRights') }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="() => {}" disabled>
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user-plus"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1 grey--text">
          {{ $t('user.delegateRights') }}
        </v-list-item-title>
      </v-list-item>

      <v-divider/>

      <v-list-item @click="logout">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="sign-out-alt"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">{{ $t('buttons.logout') }}</v-list-item-title>
      </v-list-item>

    </v-list>
    <delegated-rights v-model="rightsDialog"/>
  </v-menu>
</template>

<script>
import DelegatedRights from './DelegatedRights'
import { userInfo, userMethods } from '@/mixins/users'

export default {
  name: 'UserPanel',
  mixins: [userInfo, userMethods],
  components: {
    DelegatedRights
  },
  data: () => ({
    menu: false,
    rightsDialog: false
  })
}
</script>

<style scoped>

</style>
