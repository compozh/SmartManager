<template>
  <v-layout>
    <!-- Основная информация -->
    <v-flex class="left">
      <div class="main-form">
        <h5 class="main-title pb-5 display-1 font-weight-thin header">{{$t('personalInfo')}}</h5>
        <div class="ui-field">
          <span class="field-title">{{$t('name')}}</span>
          <span class="field-value">{{name||$t('notSet')}}</span>
        </div>
        <div class="ui-field">
          <span class="field-title">E-mail</span>
          <span class="field-value">{{email||$t('notSet')}}</span>
        </div>
        <div class="ui-field">
          <span class="field-title">{{$t('phone')}}</span>
          <span class="field-value">{{phone||$t('notSet')}}</span>
        </div>
        <div class="ui-field">
          <span class="field-title">{{$t('position')}}</span>
          <span class="field-value">{{position||$t('notSet')}}</span>
        </div>
         <v-btn @click="exit" class="minfin-bnt" color="white" black flat>
          <span>{{$t('exit')}}</span>
        </v-btn>
      </div>
    </v-flex>
    <!-- Изменение информации -->

    <v-flex class="right">
      <form class="edit-form" @submit="onsubmit">
        <h5 class="main-title pb-5 pl-0 pr-0 display-1 font-weight-thin">{{$t('editInfo')}}</h5>
        <v-text-field v-model="newEmail" class="pt-0 pl-4 pr-4" pt-1 label="E-mail"></v-text-field>
        <v-text-field v-model="newPhone" class="pt-0 pl-4 pr-4" pt-1 :label="$t('phone')"></v-text-field>
        <v-btn type="submit" class="minfin-bnt" color="orange" :disabled="disabled">
          <template v-if="loading">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
          </template>
          <span>{{$t('save')}}</span>
        </v-btn>
      </form>
    </v-flex>
    <!-- Сообщение -->
    <v-snackbar color="green" v-model="snackbar" :bottom="true" :timeout="6000">
      {{ $t("saved") }}
      <v-btn flat @click="snackbar = false">OK</v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
import api from "./api";
export default {
  name: "minfin-profile",
  data() {
    return {
      newEmail: "",
      newPhone: "",
      loading: false,
      snackbar: false
    };
  },
  beforeMount() {
    this.newEmail = this.subEmail;
    this.newPhone = this.subPhone;
  },
  computed: {
    disabled() {
      return (
        this.loading ||
        (this.newEmail == this.subEmail && this.newPhone == this.subPhone)
      );
    },
    email() {
      let email = this.$store.state.minfin.email || ",";
      return email.split(",")[0];
    },
    subEmail() {
      let email = this.$store.state.minfin.email || ",";
      return email.split(",")[1];
    },
    name() {
      return this.$store.state.minfin.name;
    },
    position() {
      return this.$store.state.minfin.position;
    },
    phone() {
      let phone = this.$store.state.minfin.phone || ",";
      return phone.split(",")[0];
    },
    subPhone() {
      let phone = this.$store.state.minfin.phone || ",";
      return phone.split(",")[1];
    }
  },
  methods: {
    exit(){
      this.$store.dispatch("minfin/resetUserData");
        this.$store.commit("setCurrentUser", null )
      this.$router.push({path: `/${this.$store.state.applicationDescription.Id}/LOGIN`})
    },
    onsubmit(e) {
      e.preventDefault();
      this.loading = true;

      let email = this.newEmail;
      let phone = this.newPhone;
      api
        .changeUSerInfo(email, phone, this.$store.state.minfin.ticket)
        .then(resp => {
          this.loading = false;
          if (resp.SUCCESS) {
            let newObject = {
              email: this.email + "," + email,
              phone: this.phone + "," + phone
            };
            console.log(newObject);
            this.$store.dispatch("minfin/setUserData", newObject);
            this.snackbar = true;
            return;
          }
        });
    }
  },
  i18n: {
    messages: {
      ru: {
        personalInfo: "Персональная информация",
        name: "Имя",
        phone: "Телефон",
        position: "Должность",
        notSet: "Не указано",
        editInfo: "Изменить дополнительные данные",
        save: "Сохранить",
        saved: "Сохранено успешно",
        exit:"Выход"
      },
      uk: {
        personalInfo: "Персональна інформація",
        name: "Ім'я",
        phone: "Телефон",
        position: "Посада",
        notSet: "Не вказано",
        editInfo: "Редагувати додаткові дані",
        save: "Зберегти",
        saved: "Збережено успішно",
        exit:"Вихід"
      }
    }
  }
};
</script>
<style>
.main-title {
  padding: 0 20px;
}
.ui-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
  margin-left: 50px;
}
.left,
.right {
  flex-basis: 50%;
  display: flex;
  align-items: center;
}
.field-title {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
}
.field-value {
  color: rgba(255, 255, 255, 1);
  font-weight: 300;
  font-size: 1.3rem;
}
.left {
  background: linear-gradient(153deg, #2984b3, #42409d);
  justify-content: flex-end;
}

.right {
  justify-content: center;
}
</style>



