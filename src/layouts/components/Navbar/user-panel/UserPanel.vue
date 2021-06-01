<template>
  <div>
    <v-menu v-model="menu"
            offset-y content-class="white"
            transition="scroll-y-transition">

      <!-- User avatar -->
      <template #activator="{ on }">
        <v-avatar v-on="on"
                  color="primary"
                  :class="`${mr}-3`"
                  size="32px"
                  style="cursor: pointer;">
          <v-img v-if="userPhoto" :src="userPhoto"/>
          <fa-icon v-else icon="user" inverse/>
        </v-avatar>
      </template>

      <!-- User name -->
      <v-list dense nav>
        <v-list-item>
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="user"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1">{{ userName }}</v-list-item-title>
        </v-list-item>

        <!-- User login -->
        <v-list-item>
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="at"/>
          </v-list-item-icon>
          <v-list-item-title class="body-2">{{ userLogin }}</v-list-item-title>
        </v-list-item>

        <!-- Reset private key option -->
        <v-list-item v-if="privateKeyIsSaved"
                     @click="resetPrivateKey">
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="trash"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1" v-text="$t('eds.clearKey')"/>
        </v-list-item>

        <v-divider/>

        <!-- Open delegated users list -->
        <v-list-item v-if="delegatedUsers.length"
                     @click="usersDialog = true"
                     class="mt-1">
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="user-tag"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1">
            {{ $t('user.delegatedUsers') }}
          </v-list-item-title>
        </v-list-item>

        <!-- Open delegated rights list -->
        <v-list-item v-if="delegatedRights.length"
                     @click="rightsDialog = true"
                     class="mt-1">
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="user-cog"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1">
            {{ $t('user.delegatedRights') }}
          </v-list-item-title>
        </v-list-item>

        <!-- Open delegation rights dialog -->
        <v-list-item @click="delegateDialog = true"
                     class="mt-1">
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="user-plus"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1">
            {{ $t('user.delegateRights') }}
          </v-list-item-title>
        </v-list-item>

        <v-divider/>

        <!-- Logout option -->
        <v-list-item @click="logout"
                     class="mt-1">
          <v-list-item-icon :class="`${mr}-2 align-center`">
            <fa-icon icon="sign-out-alt"/>
          </v-list-item-icon>
          <v-list-item-title class="body-1">{{ $t('buttons.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Delegated users dialog -->
    <delegated-users v-if="usersDialog"
                     v-model="usersDialog"/>

    <!-- Delegated rights dialog -->
    <delegated-rights v-if="rightsDialog"
                      v-model="rightsDialog"
                      @add-delegation="delegateDialog = true"/>

    <!-- Delegate rights to user dialog -->
    <delegate-user v-if="delegateDialog"
                   v-model="delegateDialog"/>
  </div>
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
  }),

  computed: {
    privateKeyIsSaved () {
      return this.$store.state.app.privateKeyIsSaved
    }
  },

  methods: {
    resetPrivateKey () {
      if (window.ds) {
        window.ds.resetPrivateKey()
      }
      this.$store.commit('SET_PRIVATE_KEY', false)
    }
  }
}
</script>
