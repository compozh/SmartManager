<template>
  <v-menu v-model="menu"
          :close-delay="3000"
          :close-on-content-click="false"
          offset-y content-class="white"
          transition="scroll-y-transition">

    <template #activator="{ on }">
      <v-avatar v-on="on"
                color="primary"
                class="mr-3" size="32px"
                style="cursor: pointer;">
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

      <v-list-item v-if="delegatedUsers.length"
                   @click="usersDialog = true"
                   class="mt-1">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user-tag"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">
          {{ $t('user.delegatedUsers') }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="delegatedRights.length"
                   @click="rightsDialog = true"
                   class="mt-1">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user-cog"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">
          {{ $t('user.delegatedRights') }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="delegateDialog = true"
                   class="mt-1">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="user-plus"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">
          {{ $t('user.delegateRights') }}
        </v-list-item-title>
      </v-list-item>

      <v-divider/>

      <v-list-item @click="logout"
                   class="mt-1">
        <v-list-item-icon class="mr-2 align-center">
          <fa-icon icon="sign-out-alt"/>
        </v-list-item-icon>
        <v-list-item-title class="body-1">{{ $t('buttons.logout') }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <delegated-users v-model="usersDialog"/>
    <delegated-rights v-model="rightsDialog"
                      @add-delegation="delegateDialog = true"/>
    <delegate-user v-model="delegateDialog"/>
  </v-menu>
</template>

<script>
import { userInfo, userMethods } from '@/mixins/users'

const DelegatedUsers = () => import('./DelegatedUsers')
const DelegatedRights = () => import('./DelegatedRights')
const DelegateUser = () => import('./DelegateUser')

export default {
  name: 'UserPanel',
  mixins: [userInfo, userMethods],
  components: {
    DelegatedUsers,
    DelegatedRights,
    DelegateUser
  },
  data: () => ({
    menu: false,
    usersDialog: false,
    rightsDialog: false,
    delegateDialog: false
  })
}
</script>

<style scoped>

</style>
