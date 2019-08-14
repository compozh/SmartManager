<template>
    <v-layout>
        <v-flex xs11>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    <h3>
                        <span class="resource-group-text">[{{cartItem.resource.resourceGroup.name | truncate(getTextLength(20,20,40,40,40), '...')}}]</span>
                          {{cartItem.resource.name | truncate(getTextLength(100,80,200,500,500), '...')}}
                    </h3>
                </span>
            </template>
                <span class="hidden-lg-and-up">
                    <span>{{cartItem.resource.name}}</span><br/>
                    <item-picture class="hidden-sm-and-up" entityName="resource" :id="cartItem.resource.id" height="100px" width="100px"/>
                </span>
        </v-tooltip>
        </v-flex>
        <v-flex xs1>

        </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'tooltip-with-resource',
  props: {
    cartItem: {}
  },
  filters: {
    truncate: (text, length, clamp) => {
      clamp = clamp || '...'
      var node = document.createElement('div')
      node.innerHTML = text
      var content = node.textContent
      return content.length > length ? content.slice(0, length) + clamp : content
    }
  },
  methods: {
    getTextLength (p1, p2, p3, p4, p5) {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs': return p1
      case 'sm': return p2
      case 'md': return p3
      case 'lg': return p4
      case 'xl': return p5
      }
    },
  }
}
</script>
