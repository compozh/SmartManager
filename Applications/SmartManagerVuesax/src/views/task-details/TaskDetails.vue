<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">

          <!-- TASK META ROW -->
          <div
            class="vx-row w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid flex justify-between flex items-center">
            <div class="vx-col sm:w-4/5 w-full flex flex-wrap items-center mb-2">
              <vs-avatar
                class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                :src="require(`@/assets/images/portrait/small/${currentMail.img}`)"
                size="65px"></vs-avatar>
              <div class="flex flex-col">
                <h5 class="mb-1">{{ currentMail.sender_name }}</h5>
                <div class="flex items-center">
                  <span class="text-sm">{{ currentMail.sender }}</span>
                </div>
              </div>
            </div>
            <div
              class="vx-col sm:w-1/5 w-full flex sm:flex-col items-center sm:justify-end mb-2">
              <span class="flex sm:mr-0 mr-2 self-end whitespace-no-wrap">{{ currentMail.time | time }}</span>
              <span class="flex self-end sm:mt-2 mt-0 whitespace-no-wrap">{{ currentMail.time | date(true) }}</span>
            </div>
          </div>

          <!-- TASK CONTENT -->
          <div class="vx-row">
            <div class="vx-col w-full">
              <div class="mail__content break-words mt-8 mb-4"
                   v-html="currentMail.message"></div>
            </div>
          </div>

          <!-- TASK ATTACHMENTS -->
          <div class="vx-row" v-if="currentMail.attachments.length">
            <div
              class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex">
              <feather-icon icon="PaperclipIcon" class="mr-2"/>
              <span class="block py-4">ATTACHMENTS</span>
            </div>
            <div class="flex">
              <div class="mail__attachment"
                   v-for="(attachment, index) in currentMail.attachments" :key="index">
                <vs-chip color="primary" class="px-4 py-2 mr-3">{{ attachment }}</vs-chip>
              </div>
            </div>

          </div>
        </vx-card>
      </div>
    </div>
    <div class="vx-row" style="margin-top: 2.2rem">
      <div class="vx-col w-full pb-10">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex justify-between">
                      <span
                        class="text-lg">Click here to <span
                        class="text-primary font-semibold cursor-pointer">Reply</span> or <span
                        class="text-primary font-semibold cursor-pointer">Forward</span></span>
              <feather-icon icon="PaperclipIcon"></feather-icon>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  export default {
    components: {
      VuePerfectScrollbar
    },
    data: () => ({
      showThread: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.50,
      },
    }),
    computed: {
      currentMail() {
        return {
          id: 1,
          sender: 'tommys@mail.com',
          sender_name: 'Tommy Sicilia',
          to: ['johndoe@mail.com'],
          img: 'avatar-s-1.png',
          subject: 'Theme Update',
          cc: [],
          bcc: [],
          message: '<p>Hi John,</p><p><br></p><p>Biscuit lemon drops marshmallow. Cotton candy marshmallow bear claw. Dragée tiramisu cookie cotton candy. Carrot cake sweet roll I love macaroon wafer jelly soufflé I love dragée. Jujubes jelly I love carrot cake topping I love. Sweet candy I love chupa chups dragée. Tart I love gummies. Chocolate bar carrot cake candy wafer candy canes oat cake I love. Sesame snaps icing pudding sweet roll marshmallow. Cupcake brownie sweet roll chocolate bar I love gummies. Biscuit biscuit macaroon sesame snaps macaroon icing I love soufflé caramels. Apple pie candy jelly. I love icing gummi bears jelly-o pie muffin apple pie.</p><p><br></p><p>Marshmallow halvah brownie cake marzipan ice cream marshmallow. I love lollipop toffee croissant liquorice wafer muffin. Lollipop jelly beans caramels lollipop tootsie roll pudding pie macaroon tootsie roll. Oat cake jujubes gummies cake cake powder cupcake soufflé muffin. Chocolate caramels muffin tart. Jelly beans caramels dessert cotton candy liquorice chocolate cake. Chupa chups muffin bear claw I love. Biscuit jujubes soufflé tart caramels pie sugar plum. Croissant jelly beans cake. Ice cream chocolate liquorice dessert cookie chocolate cake. Powder tart sweet roll macaroon croissant. Sweet tootsie roll macaroon gummi bears macaroon. Gingerbread cake tart.</p><p><br></p><p>Regrads,</p><p>Kristeen Sicilia</p>',
          attachments: ['log.txt', 'sheet.xls'],
          isStarred: false,
          labels: ['private'],
          time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
          replies: [],
          mailType: 'inboxed',
          unread: false,
        }
      }
    }
  }
</script>
