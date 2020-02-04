<template>
    <div class="home">
        <h2>Current user is {{currentUser}}</h2>
        <button @click="mgr.signOut()">SignOut</button>

        <h3>Actions</h3>
        <ul class="nav flex-column mb-2">
            <li class="nav-item">
                <a class="nav-link" @click="getAccessToken()" href="#">
                    Show access_token (oAuth)
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="getTokenId()" href="#">
                    Show token_id (openid connect)
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="getToken()" href="#">
                    Show full info
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="getTokenScopes()" href="#">
                    Show Scopes
                </a>
            </li>
        </ul>
        <button @click="renewToken()">Force access token renewal</button>
        <div class="table-responsive">
            <pre id="resultsToken"></pre>
        </div>
    </div>
</template>

<script>
    import Auth from '../lib/auth'
    export default {
        name: 'Home',
        props: {
            msg: String
		},
		data() {
            return {
				mgr: new Auth(),
                currentUser: 'unknown'
            }
		},
		methods: {
            setCurrentUser(){
              let self = this
              this.mgr.getProfile().then(
				  tokenProfile => {
					  self.currentUser = tokenProfile.name
                    },
                    err => {
                      console.log(err)
                  }) 
            },

            getToken(){
              let self = this
              this.mgr.getUser().then(
                token => {
                  self.logToken(token)
                },
                err => {
                  console.log(err)
              })
            },
            getTokenId(){
              let self = this
              this.mgr.getIdToken().then(
                tokenId => {
                  self.logToken(tokenId)
                },
                err => {
                  console.log(err)
              })
            },
            getTokenSessionState(){
              let self = this
              this.mgr.getSessionState().then(
                sessionState => {
                  self.logToken(sessionState)
                },
                err => {
                  console.log(err)
              })
            },
            getAccessToken(){
              let self = this
              this.mgr.getAcessToken().then(
                acessToken => {
                  self.logToken(acessToken)
                },
                err => {
                  console.log(err)
              })
            },
            getTokenScopes(){
              let self = this
              this.mgr.getScopes().then(
                scopes => {
                  self.logToken(scopes)
                },
                err => {
                  console.log(err)
              })
            },
            getTokenProfile(){
              let self = this
              this.mgr.getProfile().then(
                tokenProfile => {
                  self.logToken(tokenProfile)
                },
                err => {
                  console.log(err)
              }) 
            },
            renewToken(){
              let self = this
              this.mgr.renewToken().then(
                newToken => {
                  self.logToken(newToken)
                },
                err => {
                  console.log(err)
              }) 
            },
            logApi(){
              document.getElementById('resultsApi').innerText = ''
              Array.prototype.forEach.call(arguments, function (msg) {
                if (msg instanceof Error) {
                  msg = 'Error: ' + msg.message
                } else if (typeof msg !== 'string') {
                  msg = JSON.stringify(msg, null, 2)
                }
                document.getElementById('resultsApi').innerHTML += msg + '\r\n'
              })
            },
            logToken(){
              document.getElementById('resultsToken').innerText = ''
              Array.prototype.forEach.call(arguments, function (msg) {
                if (msg instanceof Error) {
                  msg = 'Error: ' + msg.message
                } else if (typeof msg !== 'string') {
                  msg = JSON.stringify(msg, null, 2)
                }
                document.getElementById('resultsToken').innerHTML += msg + '\r\n'
              })
            }
		},
        mounted() {
			this.setCurrentUser();
		},
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

