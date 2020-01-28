<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
       id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col lg:block lg:w-1/2">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">{{ $t('login.title') }}</h4>
                  <p>{{ $t('login.welcome') }}</p>
                </div>
                <vs-input
                  v-validate="'required'"
                  data-vv-validate-on="blur"
                  name="login"
                  icon="icon icon-user"
                  icon-pack="feather"
                  :label-placeholder="$t('login.placeholder')"
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
                  :label-placeholder="$t('login.password')"
                  v-model="password"
                  class="w-full mt-8 no-icon-border"/>
                <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                <div class="flex flex-wrap justify-between my-5">
                  <vs-checkbox v-model="checkbox_remember_me">{{ $t('login.rememberMe') }}
                  </vs-checkbox>
                </div>
                <!-- ВХОД -->
                <vs-button class="float-right mb-8" :disabled="!validateForm" @click="loginMethod">
                  {{ $t('buttons.login') }}
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import templateConfig from '@/templateConfig'

export default {
  data() {
    return {
      code: '',
      login: '',
      password: '',
      checkbox_remember_me: false,
      config: templateConfig.login
    }
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.login !== '' && this.password !== ''
    }
  },
  created() {
    this.$store.dispatch('auth/logout')
  },
  methods: {
    loginMethod() {
      const payload = {
        login: this.login,
        password: this.password,
        rememberMe: this.checkbox_remember_me,
      }
      this.$store.dispatch('auth/login', payload)
    },
    loginByCode() {
      this.$store.dispatch('auth/loginByCode', this.code)
    }
  }
}
</script>
