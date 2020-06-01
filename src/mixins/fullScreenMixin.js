export default {
  data () {
    return {
      isfullscreen: false
    }
  },
  mounted () {
    document.addEventListener('fullscreenchange', this.onFullScreenChanged)
    document.addEventListener('mozfullscreenchange', this.onFullScreenChanged)
    document.addEventListener('webkitfullscreenchange', this.onFullScreenChanged)
    document.addEventListener('msfullscreenchange', this.onFullScreenChanged)
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.onFullScreenChanged)
    document.removeEventListener('mozfullscreenchange', this.onFullScreenChanged)
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenChanged)
    document.removeEventListener('msfullscreenchange', this.onFullScreenChanged)
  },
  computed: {
    fullScreen: {
      get () {
        return this.isfullscreen
      },
      set (value) {
        const element = this.getFullScreenContainer()
        if (value) {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (document.documentElement.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          }
        }
        this.isfullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
      }
    }
  },
  methods: {
    onFullScreenChanged () {
      this.isfullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
    }
  }
}
