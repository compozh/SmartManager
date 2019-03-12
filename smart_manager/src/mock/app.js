export default {
  name: 'default-app',
  attrs: {
    "toolbarTitle": { source:"Toolbar/Caption/Value"}
  },
  content: [{
      type: "component",
      slot: "toolbar",
      value: {
        name: "v-btn",
        attrs: {
          color: "red",
          fab: true,
          dark: true,
        },
        content: [{
          type: 'component',
          value: {
            name: 'v-icon',
            content: [{
              type: 'raw',
              value: "add",
            }]
          }
        }]
      }
    },
    {
      type: 'component',
      value: {
        name: "v-layout",
        attrs: {
          "column": true,
          'align-start': true
        },
        content: [
          {
            type: 'component',
            loop: {
              source:'Data',
              itemName: 'todo'
            },
            value: {
              name: 'v-layout',
              content: [{
                type: "component",
                value: {
                  name: 'v-checkbox',
                  attrs: {
                    'label': { source : 'todo/Caption' }
                  },
                  model:{
                    source:'todo/Done'
                  }
                }
              }]
            }

          },

          {
            type: 'component',
            value: {
              name: "v-text-field",
              attrs: {
                label: {source:"Toolbar/Caption/Value"}
              }
            }
          },
          {
            type: 'component',
            value: {
              name: "v-text-field",
              attrs: {
                label: "Name"
              },
              model:{
                source:"FormData/NameFieldValue"
              }

            }
          },
          {
            type: 'component',
            value: {
              name: "v-text-field",
              attrs: {
                label: "Regular"
              },
              model:{
                source:"Toolbar/Caption/Value"
              },
            }
          },
          {
            type: 'component',
            value: {
              name: "v-btn",
              attrs: {
                color: "green",
                dark: true
              },
             
              actions: [{
                click: "sendClick"
              }],
              content: [{
                type: 'raw',
                value: "Send"
              }]
            }
          }
        ]
      }
    },

  ]
};