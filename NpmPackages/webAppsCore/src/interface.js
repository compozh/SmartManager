

export const __private = { components: {} }

const registerComponents = function (context, set) {
  const componentSet = {}
  context.keys().forEach(function (key) {
    componentSet[key] = context(key).default
  })
  __private.components[set] = componentSet
}
registerComponents(require.context('./components', false, /\.vue$|.js$/), 'renderless')


