<template>
	<v-app id="university">
		<v-navigation-drawer
      app
      temporary
      :clipped="$vuetify.breakpoint.lgAndUp"
			v-model="drawer">
      <v-list dense>
        <v-list-tile
          v-for="(link, index) in links"
          :key="index"
          :to="{name: link.Id, params: {links: prevLinks}}"
          >
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
        <v-btn v-if="!user" @click="openLoginDialog" icon large>
          <v-icon>input</v-icon>
        </v-btn>

        <v-layout row align-center fill-height>
          <!-- User menu -->
          <v-flex >
            <v-menu v-if="user"
              v-model="menu"
              :nudge-width="200"
              nudge-bottom="52"
              bottom
              offset-x
              offser-y>

              <template v-slot:activator="{on}">
                  <v-btn v-on="on" icon large>
                    <v-img class="user-photo" :src="userPhoto"></v-img>
                  </v-btn>
              </template>

              <v-card>
                <v-card-title class="grey lighten-4">
                  <v-layout row align-center justify-center>
                    <v-flex>
                      <v-list-tile-avatar>
                        <v-img class="user-photo" :src="userPhoto"></v-img>
                      </v-list-tile-avatar>
                    </v-flex>
                    <v-flex>
                      <v-layout column align-start justify-center>
                        <v-flex>
                          <h4>{{userName}}</h4>
                        </v-flex>
                        <v-flex align-self-end>
                          {{userLogin.toLowerCase()}}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-title>

                <v-divider light></v-divider>

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

        </v-layout>

			</v-toolbar-items>
		</v-toolbar>

    <v-content
      style='background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/light_noise_diagonal.png);background-repeat: repeat;'>
			<v-container fill-height fluid class="mx-0 my-0 px-0 py-0">
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import { getThisLink } from '../helpers/navihelp.js'

export default {
  name: 'lms-layout',
  data() {
    return {
      drawer: false,
      error: '',
      links: [],
      prevLinks: [],
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
    this.prevLinks.push(getThisLink('Главная', this.$route.path, false))
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
      this.$router.push({name: 'LMSLOGIN'})
      this.menu = false
    },
    userProfile() {
      this.menu = false
    },
    personalAccount() {
      this.menu = false
      this.$router.push({name: 'LMSPERSONALACCOUNT'})
    },
    signOut() {
      this.$store.dispatch('lms/logout')
    },
    search() {
      this.$router.push({name: 'LMSSEARCH'})
    },
    goHome() {
      if (this.$router.history.current.name !== 'LMSREALHOME') {
        this.$router.push({name: 'LMSREALHOME'})
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.lms.user
    },
    userName() {
      return this.user ? this.user.userName : ''
    },
    userLogin() {
      return this.user ? this.user.login : ''
    },
    userPhoto() {
      return this.user ? this.user.userPhoto : ''
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

.user-photo {
  border-radius: 50%;
  background-size: cover;
  width: 40px;
  height: 40px;
}
</style>
