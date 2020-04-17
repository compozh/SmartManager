<template>
  <v-menu v-model="menu"
          close-on-click
          offset-y
          transition="scroll-y-transition">

    <template v-slot:activator="{ on }">
      <v-avatar v-on="on" color="primary" class="ml-4" size="32px">
        <v-img v-if="userPhoto" :src="userPhoto"/>
        <fa-icon v-else icon="user" inverse/>
      </v-avatar>
    </template>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-icon class="mr-1 align-center">
          <fa-icon icon="user"/>
        </v-list-item-icon>
        <v-list-item-title>{{ userName }}</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="mr-1 align-center">
          <fa-icon icon="at"/>
        </v-list-item-icon>
        <v-list-item-title class="caption">{{ userLogin }}</v-list-item-title>
      </v-list-item>

      <v-divider/>

      <v-list-group no-action>

        <template v-slot:activator>
          <v-list-item-title>{{ $t('user.delegatedRights') }}</v-list-item-title>
        </template>

        <v-list-item v-for="rights in delegatedRights"
                     :key="rights.ID"
                     class="mr-2"
                     @click="applyDelegatedRights(rights.USERID)">
          <v-list-item-icon class="mr-1 align-center">
            <fa-icon icon="user-tag"/>
          </v-list-item-icon>
          <v-list-item-title>{{ rights.USERNAME }}</v-list-item-title>
        </v-list-item>

      </v-list-group>

      <v-divider/>

      <v-list-item @click="logout">
        <v-list-item-icon class="mr-1 align-center">
          <fa-icon icon="sign-out-alt"/>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('buttons.logout') }}</v-list-item-title>
      </v-list-item>

    </v-list>
  </v-menu>
</template>

<script>
import { userInfo, userMethods } from '@/mixins/user'

export default {
  name: 'UserPanel',
  mixins: [userInfo, userMethods],
  data: () => ({
    menu: false
  })
}
</script>

<style scoped>

</style>
