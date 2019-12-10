<template>
	<v-app id="university">
		<v-navigation-drawer
			v-model="drawer"
			fixed
			clipped

			app>
		<v-list dense>
			<v-list-tile
				v-for="(link, index) in links"
				:key="index"
				@click.stop='drawer = !drawer'
        :to="{name: link.Id}">
				<v-list-tile-action>
					<v-icon>{{ link.Image }}</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ link.Name }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
		</v-navigation-drawer>

		<v-toolbar
			dense
			fixed
			clipped-left
			app>
			<v-toolbar-side-icon
					@click.stop='drawer = !drawer'>
			</v-toolbar-side-icon>
			<div id='logoWrapper' class='ml-0'>
        <v-img :src="logoLink"
          max-width="195"
          max-height="40"></v-img>
			</div>
      <span id="appTitle">University</span>
			<v-flex md4>
			</v-flex>
			<v-spacer/>
			<v-toolbar-items>
				<v-btn
					flat
					v-for="(link, index) in links"
					:key="index"
					:class="link.class"
          :to="{name: link.Id}">
          {{link.Name}}</v-btn>
			</v-toolbar-items>
      <v-flex class="grow-0">
        <user-panel mini="true"></user-panel>
      </v-flex>
		</v-toolbar>

		<v-content v-if="!circularLoader"
			fill-height
			style='background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/light_noise_diagonal.png);background-repeat: repeat;'
			class="mx-0 my-0 px-0 py-0">
			<v-container fluid	class="mx-0 my-0 px-0 py-0">
				<router-view></router-view>
			</v-container>
		</v-content>

    <v-container
      v-else
      class="circular-loader"
      fill-height fluid>

      <v-layout row align-center>
        <v-flex xs12>
          <v-progress-circular
            :size="100"
            :width="4"
            color="blue darken-2"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>

	</v-app>
</template>

<script>


export default {
  name: 'lms-layout',
  data() {
    return {
      drawer: true,
      fixed: false,
      isauth: '',
      miniVariant: false,
      right: true,
      rightDrawer: false,
      // TODO: удалить после отлвдки
      dialogState: false,
      links: [],
      logoLink: null
    }
  },
  created() {
    this.getLogoLink()
    // Перейти к home
    if (this.$router.history.current.name == 'LMSREALHOME') {
      return
    }
    this.$router.push({name: 'LMSREALHOME'})
  },
  beforeMount: function () {
    // Маршруты из конструктора
    if (!this.$store.state.WebApps.applicationDescription) {
      this.links = []
    }
    var app = this.$store.state.WebApps.applicationDescription
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

    // добавить классы
    // for (let index = 0; index < this.links.length; index++) {
    //   this.links[index].class = 'hidden-sm-and-down'
    // }
  },
  methods: {
    getLogoLink () {
			this.$store.dispatch('lms/getLogoLink')
			this.logoLink = this.$store.getters['lms/logoLink']
    }
  },
  computed: {
    circularLoader() {
      return this.$store.state.lms.circularLoader
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Candal|Lalezar");

svg {
	width: 100%;
	height: 100%;
}
#logoWrapper {
  min-width:220px;
  height:40px;
}
#itLogoAddon {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;
}
#appTitle {
  color: #55B332;
  font-size:28px;
}
</style>
