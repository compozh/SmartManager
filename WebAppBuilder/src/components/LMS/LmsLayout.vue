<template>
	<v-app id="university">
		<v-navigation-drawer
			v-model="drawer"
			fixed
			clipped
			class="hidden-md-and-up"
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
					@click.stop='drawer = !drawer'
					class="hidden-md-and-up">
			</v-toolbar-side-icon>
			<div id='logoWrapper' class='ml-0' style='width:280px;height:40px;'>
				<svg viewBox='140 -4 50 50'>
					<path fill='#2D469C' d='M6.15 29.74A15.36 15.36 0 0 1 2.87 8.52a7.18 7.18 0 0 0 3.28 3.15zM30.7 17.45A15.35 15.35 0 0 1 6.15 29.74h6.1V11.67a7.16 7.16 0 0 0 3.4-9.56 15.35 15.35 0 0 1 13.77 9.2h-16.1v4h5.13v14.42h6.1v-14.4h6a15.47 15.47 0 0 1 .15 2.12z'/>
					<circle fill='#55B332' cx='9.22' cy='5.12' r='5.12'/>
					<path fill='#2D469C' d='m 91.237596,14.879981 c -5.74,0 -8.11,3.83 -8.11,7.47 0,3.64 1.55,7.65001 8.93,7.65001 2.004903,0.0233 3.991948,-0.37891 5.83,-1.18 v -3.55001 h -0.55 c -1.408301,0.94087 -3.047893,1.47702 -4.74,1.55 -2.73,0 -4.92,-1 -4.92,-3.55 3.28,0 9.38,0.09 10.48,0.09 0.24,-3.83 -0.76,-8.48 -6.92,-8.48 z m 2.37,5.83 h -5.92 c -0.03683,-1.65949 1.342116,-3.00166 3,-2.92 1.7005,-0.23487 3.154865,1.2195 2.92,2.92 z m 72.790004,-5.83 c -5.74,0 -8.11,3.83 -8.11,7.47 0,3.64 1.55,7.65001 8.93,7.65001 2.0049,0.0233 3.99195,-0.37891 5.83,-1.18 v -3.55001 h -0.55 c -1.4083,0.94087 -3.04789,1.47702 -4.74,1.55 -2.73,0 -4.92,-1 -4.92,-3.55 3.28,0 9.38,0.09 10.48,0.09 0.28,-3.83 -0.72,-8.48 -6.92,-8.48 z m 2.37,5.83 h -5.92 c -0.0368,-1.65949 1.34212,-3.00166 3,-2.92 1.7005,-0.23487 3.15487,1.2195 2.92,2.92 z m -49.37,-5.74 c -1.63217,0.18541 -3.16284,0.88594 -4.37,2 v -1.63 h -4.56 c -2.14908,-0.12909 -4.25687,0.63014 -5.83,2.1 v -2.1 h -4.56 v 14.30001 h 4.56 v -9.50001 c 1.73,-1.25 4.56,-1.8 5.83,-0.89 v 15.13001 h 4.56 v -5.44 c 1.1871,0.62081 2.49263,0.98213 3.83,1.06 2.73,0 6.47,-2.19 6.47,-7.47001 0,-5.28 -2.38,-7.74 -5.93,-7.56 z m -2.55,11.75 c -0.61325,0.01 -1.22515,-0.0606 -1.82,-0.21 v -7.35 c 0.8015,-0.4339 1.68979,-0.6833 2.6,-0.73 1.78,0 3.05,0.91 3.05,4 0,3.09 -1.65,4.29 -3.84,4.29 z m 25.14,-11.38 v 14.30001 h -4.65 v -10.39001 c -1.28,-0.91 -4.1,-0.36 -5.83,0.89 v 9.50001 h -4.56 v -14.30001 h 4.56 v 2.09 c 1.57313,-1.46986 3.68092,-2.22909 5.83,-2.1 z m -4.65,-7.2100103 h 4.65 v 3.6400103 h -4.65 z m 19.13,7.9300103 v 3.55 h -0.36 c -1.34697,-1.04846 -3.00309,-1.6216 -4.71,-1.63 -1.18,0 -2.92,0.27 -2.92,1.28 0,1.18 2.73,1.28 4.65,1.73 1.55,0.36 3.83,1.09 4,4 0.24,3.91001 -4.19,5.10001 -7.29,5.10001 -2.09127,0.013 -4.16443,-0.38809 -6.1,-1.18 v -3.83001 h 0.46 c 1.49124,1.21919 3.35388,1.89299 5.28,1.91001 2.46,0 3,-0.46001 3,-1.18001 0,-0.91 -1.28,-1.21 -3.64,-1.55 -1.91,-0.27 -5,-1.49 -5,-4.56 0.094,-1.69673 1.15675,-3.18763 2.73,-3.83 1.52723,-0.64248 3.17368,-0.95268 4.83,-0.91 1.75668,-0.0778 3.50351,0.3012 5.07,1.1 z m -108.070004,-1.18 c -7.38,0 -8.2,5.65 -8.2,7.65 0,2 0.73,7.47001 9,7.47001 2.004903,0.0233 3.991948,-0.37891 5.83,-1.18 v -3.55001 h -0.55 c -1.408301,0.94087 -3.047893,1.47702 -4.74,1.55 -2.73,0 -5,-1 -5,-3.55 3.28,0 9.48,0.09 10.57,0.09 0.31,-3.83 -0.69,-8.48 -6.91,-8.48 z m 2.37,5.83 h -6 c 0.08557,-1.64601 1.451817,-2.93293 3.1,-2.92 1.7005,-0.23487 3.154865,1.2195 2.92,2.92 z m 20.79,1.82 v 7.11001 h -4.55 v -7.26001 c 0,-1.52 -0.09,-2.67 -1,-3.31 -1.17,-0.82 -3.28,-0.27 -4.28,0.59 v 10.00001 h -4.47 v -14.23001 h 4.46 v 1.48 c 3.1,-2.48 6.41,-2.52 8.29,-0.75 1.39,1.27 1.55,2.64 1.55,6.37 z m 7.29,-4.1 v 5.74 c 0,4.10001 3.64,2.28 3.92,2.28 h 0.36 v 3.00001 c -2.08,0.66 -5.28,0.78 -7,-0.36 -1.200539,-0.8583 -1.885401,-2.26566 -1.82,-3.74001 v -6.92 h -1.91 v -1.82 l 6.47,-3.92 v 2.64 h 4.28 v 3.1 z'/>
					<text id='itLogoAddon' x='182' y='30' fill='#55B332'>University</text>

				</svg>
			</div>
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

		<v-content
			fill-height
			style='background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/light_noise_diagonal.png);background-repeat: repeat;'
			class="mx-0 my-0 px-0 py-0">
			<v-container fluid	class="mx-0 my-0 px-0 py-0">
				<router-view></router-view>
			</v-container>
		</v-content>

		<v-footer absolute class="pa-3" :fixed='fixed' app>
			<span>IT-Enterprise 2018</span>
		</v-footer>



	</v-app>
</template>

<script>


export default {
	name: "lms-layout",
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
      links: []
		};
	},
	beforeMount: function () {
    // Маршруты из конструктора
      if(!this.$store.state.applicationDescription){
         this.links = [];
      }
      var app = this.$store.state.applicationDescription;
      var sections = app.Sections||[];

      // Достаем роуты из разделов
      var routs = [];
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        routs = routs.concat((section.Routes||[]).map(r => (r.section = section)&& r));
      }

      routs = [...routs, ...routs[1].Children, ...routs[0].Children];
      this.links = routs.filter(l => l.Name)
          .sort((a, b) => a.Sort > b.Sort ? 1 : -1 );

      // добавить классы
      for (let index = 0; index < this.links.length; index++) {
          this.links[index].class = "hidden-sm-and-down";
      }

      // Перейти к home
      this.$router.push({name: 'LMSREALHOME'});
	},
	methods: {

	},
	computed: {
	}
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Candal|Lalezar");

svg {
	width: 100%;
	height: 100%;
}
#itLogoAddon {
	font-size: 28px;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;
}
</style>
