<template>
  <div v-cloak>
    <div class="login-page" @keyup.enter="signIn" >
      <div class="position-relative" style="z-index:999;">
        <div class="col-9 mx-auto" style="height: 400px; margin-top: 7%;">
          <div class="row">
            <div class="col-md-6 bg-gradient-indigo rounded-left p-3 text-white align-items-center d-none d-md-block d-xs-none d-sm-none" style="height: 400px;">
              <br>
                <center><i style="font-size: 200px;" class="material-icons text-white mt-5">monetization_on</i></center>
            </div>
            <div class="col-md-6 bg-gradient-light rounded-right p-3 pt-3 form align-items-center" style="height: 400px;">
              <div class="col-md-auto pt-5">
                <div class="form-label-group text-indigo">
                  <center>
                    <h1>Saldo Positivo</h1>
                    <p>Controle Financeiro Pessoal</p>
                  </center>
                </div>
                <div class="form-label-group">
                  <input type="email" id="inputEmail" class="form-control" placeholder="Login" required autofocus v-model="login">
                </div>
                <div class="form-label-group mt-2">
                  <input type="password" id="inputPassword" class="form-control" placeholder="Senha" required v-model="senha">
                </div>
                <div class="form-label-group mt-2">
                  <button class="btn btn-indigo btn-block" @click.enter="signIn" :disabled="disabled">Entrar</button>
                </div>
                <div class="alert alert-danger col-12 mt-3" role="alert" v-if="mensagem.erro">{{ mensagem.erro }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Usuario from '../../../class/usuario'
// import '../../../funcoes/front'

export default {
  name: 'Login',
  data () {
    return {
      disabled: false,
      login: '',
      senha: '',
      mensagem: {
        erro: ''
      }
    }
  },
  created () {
    Usuario.setLogado(false)
  },
  methods: {
    signIn () {
      this.mensagem.erro = ''

      if (!this.login) {
        this.mensagem.erro = 'Informe o login'
        return false
      }

      if (!this.senha) {
        this.mensagem.erro = 'Informe a senha'
        return false
      }

      this.disabled = true

      firebase.auth().signInWithEmailAndPassword(this.login, this.senha)
        .then(
          (response) => {
            Usuario.getTokenApi(response.user.uid, this.login)

            if (Usuario.getLogado()) {
              this.$store.commit('SET_VERIFICA_LOGIN')
              this.$router.replace('Dashboard')
            } else {
              firebase.auth().signOut()
              console.clear()
              this.mensagem.erro = 'Usuário bloqueado'
              this.disabled = false
              return false
            }
          },
          (err) => {
            console.clear()
            this.disabled = false
            switch (err.code) {
              case 'auth/wrong-password':
                this.mensagem.erro = 'Senha inválida'
                break

              case 'auth/user-not-found':
                this.mensagem.erro = 'Usuário não encontrado'
                break

              default:
                break
            }
          }
        )
        .catch(error => {
          console.log(error)
          console.clear()
        })
    }
  }
}
</script>

<style scoped>
.login-page::before {
  content: '';
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  background: url(../../../assets/img/bg.jpg);
  background-size: cover;
  -webkit-filter: blur(10px);
  filter: blur(10px);
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
