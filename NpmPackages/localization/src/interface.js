

export const __private = { components: {} }

const registerComponents = function (context, set) {
  const componentSet = {}
  context.keys().forEach(function (key) {

    componentSet[key] = context(key).default
  })
  __private.components[set] = componentSet
}
registerComponents(require.context('./components/renderless', false, /\.vue$|.js$/), 'renderless')
registerComponents(require.context('./components/views', false, /\.vue$|.js$/), 'views')


