<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row no-gutter justify-center items-center">
                        <div class="vx-col hidden lg:block lg:w-1/2">
                            <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Вход</h4>
                                    <p>Добро пожаловать, пожалуйста, войдите под своей учетной записью.</p>
                                </div>
                                <vs-input
                                    v-validate="'required'"
                                    data-vv-validate-on="blur"
                                    name="login"
                                    icon="icon icon-user"
                                    icon-pack="feather"
                                    label-placeholder="Логин"
                                    v-model="login"
                                    class="w-full no-icon-border"/>
                                <span class="text-danger text-sm">{{ errors.first('login') }}</span>

                                <vs-input
                                    data-vv-validate-on="blur"
                                    v-validate="'required'"
                                    type="password"
                                    name="password"
                                    icon="icon icon-lock"
                                    icon-pack="feather"
                                    label-placeholder="Пароль"
                                    v-model="password"
                                    class="w-full mt-8 no-icon-border" />
                                <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                <div class="flex flex-wrap justify-between my-5">
                                    <vs-checkbox v-model="checkbox_remember_me">Запомнить меня</vs-checkbox>
                                </div>
                               <!-- ВХОД -->
                                <vs-button class="float-right mb-8" :disabled="!validateForm" @click="loginMethod">Вход</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
//import auth from '@/api/auth/auth'
import templateConfig from '@/templateConfig'

export default {
  data() {
    return {
      login: '',
      password: '',
      checkbox_remember_me: false,
      config: templateConfig.login
    }
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.login != '' && this.password != ''
    }
  },
  methods: {
    loginMethod() {
      // Loading
      this.$vs.loading()

      const payload = {
        checkbox_remember_me: this.checkbox_remember_me,
        userDetails: {
          email: this.login,
          password: this.password
        },
        notify: this.$vs.notify,
        closeAnimation: this.$vs.loading.close
      }
      this.$store.dispatch('auth/login', payload)
    }
  }
}
</script>
