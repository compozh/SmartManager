export default {
  name: 'default-app',
  props: {
    "toolbarTitle": "@@Toolbar.Caption.Value"
  },
  content: [{
      type: "component",
      slot: "toolbar",
      value: {
        name: "v-btn",
        props: {
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
              props: {
                dark: true
              }
            }]
          }
        }]
      }
    },
    {
      type: 'component',
      value: {
        name: "v-layout",
        props: {
            "column":true,
            'align-start':true
        },
        content: [{
            type: 'component',
            value: {
              name: "v-text-field",
              props: {
                label: "Email"
              }
            }
          },
          {
            type: 'component',
            value: {
              name: "v-text-field",
              props: {
                label: "Name"
              }

            }
          },
          {
            type: 'component',
            value: {
              name: "v-text-field",
              props: {
                label: "Regular"
              }

            }
          },
          {
            type: 'component',
            value: {
              name: "v-btn",
              props: {
                color: "green",
                dark: true
              },
              actions:[
                  { click:"click" }
              ],
              content:[{
                  type:'raw',
                  value:"Send"
              }]
            }
          }
        ]
      }
    },

  ]
};
