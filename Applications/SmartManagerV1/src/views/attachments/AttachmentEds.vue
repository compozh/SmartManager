<template>
  <div>
    <vs-popup :title="$t('attachments.edsTitle')"
              :active.sync="edsPopup">
      <vs-table stripe :data="edsItems">
        <template slot="thead">
          <vs-th active>
            Статус
          </vs-th>
          <vs-th>
            Дата
          </vs-th>
          <vs-th>
            Підписант
          </vs-th>
          <vs-th>
            Організація
          </vs-th>
          <vs-th>
            Посада
          </vs-th>
          <vs-th>
            ЄДРПОУ
          </vs-th>
          <vs-th>
            ЦСК
          </vs-th>
          <vs-th>
            Коментар
          </vs-th>
          <vs-th>
            Дії
          </vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr class="truncate" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>
              <vx-tooltip :text="$t('eds.eds')" color="rgb(98, 98, 98, .95)">
                <feather-icon icon="UserCheckIcon"></feather-icon>
               </vx-tooltip>
            </vs-td>

            <vs-td :data="data[indextr].date">
              {{data[indextr].date}}
            </vs-td>

            <vs-td :data="data[indextr].signatory">
              {{data[indextr].signatory}}
            </vs-td>

            <vs-td :data="data[indextr].organization">
              {{data[indextr].organization}}
            </vs-td>

            <vs-td :data="data[indextr].position">
              {{data[indextr].position}}
            </vs-td>

            <vs-td></vs-td>

            <vs-td :data="data[indextr].keyCenter">
              {{data[indextr].keyCenter}}
            </vs-td>

            <vs-td></vs-td>

            <vs-td class="flex">
              <vx-tooltip :text="$t('eds.sign')" color="rgb(98, 98, 98, .95)">
                <vs-button color="primary" type="flat" icon="touch_app"/>
              </vx-tooltip>
              <vx-tooltip :text="$t('eds.delete')" color="rgb(98, 98, 98, .95)">
                <vs-button color="danger" type="flat" icon="delete"/>
              </vx-tooltip>
              <vx-tooltip :text="$t('eds.check')" color="rgb(98, 98, 98, .95)">
                <vs-button color="success" type="flat" icon="check_circle"/>
              </vx-tooltip>
              <vx-tooltip :text="$t('eds.clearKey')" color="rgb(98, 98, 98, .95)">
                <vs-button color="warning" type="flat" icon="vpn_key"/>
              </vx-tooltip>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>
  </div>
</template>

<script>
export default {
  data: () => ({
    edsItems: [
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Евгений Мелентьев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Виталий Бахарев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Игорь Певчев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Евгений Мелентьев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Виталий Бахарев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Игорь Певчев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      }
    ],
  }),
  computed: {
    edsPopup: {
      get() {
        return this.$store.state.sm.attachments.edsPopup
      },
      set(val) {
        this.$store.commit('sm/TOGGLE_EDS_POPUP', val)
      }
    }
  }
}
</script>

<style scoped>

</style>
