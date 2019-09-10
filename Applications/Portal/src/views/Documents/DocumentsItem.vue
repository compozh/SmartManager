<template>
  <vx-card  class="cursor-pointer list-view-item mb-5 overflow-hidden">
    <div @click="onClick" class="p-3" slot="no-body">
      <div class="flex items-center ">
        <vx-tooltip :text="item.number">
          <h5 :title="item.number" class="pr-3 w-48 truncate">{{item.number}}</h5>
        </vx-tooltip>
        <div class="text-grey pr-3">от {{item.date | moment("DD.MM.YYYY")}}</div>
        <vs-chip v-if="item.isPosted" color="primary">Разнесен</vs-chip>
        <div class="flex-grow"></div>
        <!-- <span class="text-grey">#{{item.id}}</span> -->
        <div class="flex invisible actions-panel">
          <vx-tooltip v-if="!item.isPosted" delay="0.5s" @click.stop="" text="Разнести" >
            <feather-icon class="hover:bg-grey-light rounded-full p-2 cursor-pointer" icon="FileTextIcon" @click.stop=""></feather-icon>
          </vx-tooltip>
          <vx-tooltip delay="0.5s" text="Изменить" >
            <feather-icon class="hover:bg-grey-light rounded-full p-2 cursor-pointer" icon="EditIcon" @click.stop=""></feather-icon>
          </vx-tooltip>
          <vx-tooltip delay="0.5s" text="Создать копию" >
            <feather-icon class="hover:bg-grey-light rounded-full p-2 cursor-pointer" icon="CopyIcon" @click.stop=""></feather-icon>
          </vx-tooltip>
           <vx-tooltip delay="0.5s" text="Удалить" >
            <feather-icon class="hover:bg-grey-light rounded-full p-2 cursor-pointer" icon="TrashIcon" @click.stop="onDeleteDocument"></feather-icon>
          </vx-tooltip>
        </div>
      </div>
      {{item.comment}}
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.item)
    },
    onDeleteDocument() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Удалить документ?',
        text: `Удалить документ номер ${this.item.number}?`,
        accept: this.acceptDelete,
        acceptText: 'Удалить',
        cancelText: 'Отмена'
      })
    },
    acceptDelete() {
      this.$vs.loading ()
      this.$store.dispatch('app/deleteDocument', this.item.id).then(res => {
        this.$vs.loading.close()
        // документ не удалён
        if (!res) {
          this.$vs.notify({
            title: 'Удаление документа',
            text: 'Невозможно удалить документ',
            color: 'danger',
            iconPack: 'feather',

            icon: 'icon-alert-circle'
          })
          return
        }
        // документ удалён
        this.$vs.notify({
          title: 'Удаление документа',
          text: 'Документ удалён',
          color: 'success',
          iconPack: 'feather',

          icon: 'icon-info'
        })

      })
    }
  }

}
</script>

<style lang="scss" scoped>
.list-view-item {


  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .actions-panel{
      visibility: visible !important;
    }
  }
}
</style>
