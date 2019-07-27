export default {
  name: 'userPanelRl',
  methods: {
    changePassword() {
      console.log('Запрос изменения пароля')
    },
    applyDelegatedRights(userId) {
      this.$authentication.applyDelegatedRights(userId).then(() => {
        this.$store.commit('authentication/setCurrentUser', this.$authentication.currentUser)
      })

    },
    setDelegation() {
      console.log('Делегировать права', )
    },
    logOut() {
      this.$authentication.LogOut()

      const sections = this.$store.state.applicationDescription.Sections
      sections.forEach(section => {
        section.Routes.forEach(route => {
          if (route.Id.toLowerCase().includes('login')) {
            return this.$router.push({name: route.Id})
          }
        })
      })
    }
  },
  created() {
    this.$store.commit('authentication/setCurrentUser', this.$authentication.currentUser)
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        name: this.$store.state.authentication.currentUser.UserData.LoginData.UserName,
        login: this.$store.state.authentication.currentUser.UserData.LoginData.UserLogin,
        id: this.$store.state.authentication.currentUser.UserData.LoginData.UserId,
        rights: this.$store.state.authentication.currentUser.UserData.DelegatedRights,
        photo: this.$store.state.authentication.currentUser.UserData.CurrentUserData.UserPhoto
      },
      params: {
        changePassword: this.changePassword,
        delegatedRights: {
          click: e => this.applyDelegatedRights(e.target.id)
        },
        setDelegation: {
          click: () => this.setDelegation()
        },
        logOut: {
          click: () => this.logOut()
        }
      }
    })
  }
}
