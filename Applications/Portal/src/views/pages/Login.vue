<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
       id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col hidden lg:block lg:w-1/2">
              <img src="@/assets/images/33.png" alt="login" height="300px" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">{{$t("Login.Enter")}}</h4>
                  <p>{{$t("Login.Greeting")}}</p>
                </div>
                <ValidationObserver v-slot="{ invalid }">
                  <ValidationProvider :name="$t('Login.Login')" rules="required"
                                      v-slot="{ errors }">
                    <vs-input
                      @keydown.enter="loginMethod"

                      name="login"
                      icon="icon icon-user"
                      icon-pack="feather"
                      :label-placeholder="$t('Login.Login')"
                      v-model="login"
                      class="w-full no-icon-border"/>
                    <span class="text-danger text-sm">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider :name="$t('Login.Password')" rules="required"
                                      v-slot="{ errors }">

                    <vs-input
                      @keydown.enter="loginMethod"
                      type="password"
                      name="password"
                      icon="icon icon-lock"
                      icon-pack="feather"
                      :label-placeholder="$t('Login.Password')"
                      v-model="password"
                      class="w-full mt-6 no-icon-border"/>
                    <span class="text-danger text-sm">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <div class="flex flex-wrap justify-between my-5">
                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">
                      {{$t('Login.RememberMe')}}
                    </vs-checkbox>
                    <router-link to="/forgot-password">{{$t("Login.ForgotPassword")}}</router-link>
                  </div>
                  <!-- ВХОД -->
                  <vs-button class="float-right mb-8" :disabled="invalid" @click="loginMethod">
                    {{$t("Login.Enter")}}
                  </vs-button>
                </ValidationObserver>
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
      login: '',
      password: '',
      checkbox_remember_me: false,
      config: templateConfig.login
    }
  },
  created() {
    this.$store.dispatch('auth/logout')
  },
  methods: {
    async loginMethod() {
      this.$vs.loading()
      const payload = {
        login: this.login,
        password: this.password,
        rememberMe: this.checkbox_remember_me,
      }
      const result = await this.$store.dispatch('auth/login', payload)
      if (result === 'alreadyLoggedIn') {
        this.notifyAlreadyLoggedIn()
        await this.$router.push('/')
        return
      }
      if (result === 'success') {
        await this.$router.push(this.$router.currentRoute.query.to || '/')
      } else {
        this.$vs.notify({
          title: this.$t('Login.EnterToSystem'),
          text: result.errorMessage,
          color: 'warning'
        })
        if (this.$router.currentRoute.name !== 'page-login') {
          await this.$router.push({path: '/login'})
        }
      }
    },
    notifyAlreadyLoggedIn() {
      this.$vs.notify({
        title: this.$t('Login.EnterToSystem'),
        text: this.$t('Login.YouAlreadyEntered'),
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
    }
  }
}
</script>

<style lang="scss">
  #page-login {
    .social-login {
      .bg-facebook {
        background-color: #1551b1;
      }

      .bg-twitter {
        background-color: #00aaff;
      }

      .bg-google {
        background-color: #4285F4;
      }

      .bg-github {
        background-color: #333;
      }
    }
  }
</style>
