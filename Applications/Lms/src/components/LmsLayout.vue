<template>
	<v-app id="university">
		<v-navigation-drawer
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
			v-model="drawer"
      >
      <!-- :mini-variant.sync="drawerMini" -->
      <v-list dense>
        <v-list-tile
          v-for="(link, index) in links"
          :key="index"

          :to="{name: link.Id}">
          <!-- @click.stop='drawerMini = !drawerMini' -->
          <v-list-tile-action>
            <v-icon>{{ link.Image }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.Name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

		<v-toolbar app clipped-left dense>
      <v-toolbar-side-icon
					@click.stop='drawer = !drawer'>
			</v-toolbar-side-icon>
      <v-img class="logo"
            @click.stop="goHome"
            :src="logoLink"
            max-width="195"
            max-height="40">
      </v-img>
      <v-toolbar-title class="title"
          @click.stop="goHome">
        <span id="appTitle">University</span>
      </v-toolbar-title>

			<v-spacer/>
			<v-toolbar-items>
        <v-btn @click="search" icon large>
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn v-if="!currentUser" @click="openLoginDialog" icon large>
          <v-icon>input</v-icon>
        </v-btn>

        <!-- User menu -->
        <v-flex >
          <v-menu v-if="currentUser"
            v-model="menu"
            :nudge-width="200"
            bottom
            offset-x
            offser-y>

            <template v-slot:activator="{on}">
                <v-btn v-on="on" icon large>
                  <v-icon>person</v-icon>
                </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-tile
                  v-for="(item, i) in userMenuItems" :key="i"
                  @click="item.action">
                    <v-list-tile-title>
                      <v-icon>{{item.icon}}</v-icon>
                      {{item.title}}
                    </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>

          </v-menu>
        </v-flex>

        <v-flex v-if="currentUser" class="grow-0">
          <user-panel mini="true"></user-panel>
        </v-flex>

			</v-toolbar-items>
		</v-toolbar>

    <v-content
      fill-height
      style='background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/light_noise_diagonal.png);background-repeat: repeat;'>
			<v-container fluid class="mx-0 my-0 px-0 py-0">
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>


export default {
  name: 'lms-layout',
  data() {
    return {
      drawer: false,
      // user-panel ->
      fixed: false,
      isauth: '',
      miniVariant: false,
      right: true,
      rightDrawer: false,
      // TODO: удалить после отлвдки
      dialogState: false,
      // <-- user-panel
      login: '',
      password: '',
      checkbox_remember_me: false,
      error: '',
      links: [],
      logoLink: null,
      menu: false,
      userMenuItems: [
        {title: 'Профиль пользователя', icon: 'face', action: this.userProfile},
        {title: 'Личный кабинет', icon: 'person', action: this.personalAccount},
        {title: 'Выйти', icon: 'exit_to_app', action: this.signOut}
      ]
    }
  },
  created() {
    this.getLogoLink()
    this.goHome()
  },
  beforeMount: function () {
    // Маршруты из конструктора
    var app = this.$store.state.WebApps.applicationDescription
    if (!app) {
      this.links = []
    }
    var sections = app.Sections || []

    // Достаем роуты из разделов
    var routs = []
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index]
      routs = routs.concat((section.Routes || []).map(r => (r.section = section) && r))
    }

    routs = [...routs, ...routs[1].Children, ...routs[0].Children]
    this.links = routs.filter(l => l.Name)
      .sort((a, b) => a.Sort > b.Sort ? 1 : -1 )
  },
  methods: {
    getLogoLink () {
			this.$store.dispatch('lms/getLogoLink')
			this.logoLink = this.$store.getters['lms/logoLink']
    },
    openLoginDialog() {
      this.$router.push('LOGIN')
    },

    userProfile() {

    },
    personalAccount() {
      this.$router.push({name: 'LMSPERSONALACCOUNT'})
    },
    signOut() {
      this.$authentication.logOff()
      this.$store.state.authentication.currentUser = null
      this.goHome()
    },
    search() {
      this.$router.push('search')
    },
    goHome() {
      if (this.$router.history.current.name == 'LMSREALHOME') {
        return
      }
      this.$router.push({name: 'LMSREALHOME'})
    },
  },
  computed: {
    currentUser() {
      if (this.$store.state.authentication.currentUser) {
        return this.$store.state.authentication.currentUser
      }
      return null
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Candal|Lalezar");

.logo:hover, .title:hover {
  cursor: pointer;
}
#logoWrapper {
  min-width:220px;
  height:40px;
}

#appTitle {
  color: #55B332;
  font-size:28px;
}
</style>
