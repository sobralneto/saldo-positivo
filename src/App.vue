<template>
  <div v-cloak>
    <header v-if="isAuthenticated">
      <nav class="navbar navbar-dark fixed-top bg-gradient-indigo flex-md-nowrap p-0 shadow-sm">
        <router-link tag='a' class="navbar-brand col-sm-4 col-md-2 pb-2 pt-2" :to="{ name: 'Dashboard' }">
          <i style="font-size: 30px;" class="material-icons align-middle">monetization_on</i>
          <font class="pl-0" style="font-size: 23px; vertical-align: middle; margin-left: -5px;">
            aldo Positivo
          </font>
        </router-link>
        <ul class="navbar-nav">
          <button class="btn btn-sm btn-danger mr-3" @click="logout()">Logout</button>
        </ul>
      </nav>
    </header>
    <div class="container-fluid" v-if="isAuthenticated">
      <div class="row">
        <nav class="col-md-2 col-sm-4 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <router-link tag='li' class="nav-item nav-link" :to="{ name: 'Dashboard' }">
                Dashboard
              </router-link>
              <li>
                <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-1 text-muted">
                  <span>Lançamentos</span>
                </h6>
              </li>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'Lancamento', params: { tipo: '1'} }">
                Receita
              </router-link>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'Lancamento', params: { tipo: '2'} }">
                Despesa
              </router-link>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'Lancamento', params: { tipo: '3'} }">
                Transferência
              </router-link>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'LancamentoConsulta' }">
                Consultar
              </router-link>
              <li>
                <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-1 text-muted">
                  <span>Cadastros</span>
                </h6>
              </li>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'Conta' }">Contas</router-link>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'CartaoCredito' }">Cartões de crédito</router-link>
              <router-link tag='li' class="nav-item dropdown-item" :to="{ name: 'Categoria' }">Categorias</router-link>
              <router-link tag='li' class="nav-item nav-link" :to="{ name: 'Relatorio' }">Relatórios</router-link>
            </ul>
          </div>
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Usuario from './class/usuario'

export default {
  name: 'App',
  data () {
    return {
      isAuthenticated: Usuario.getLogado()
    }
  },
  mounted () {

  },
  watch: {
    '$store.state.verificaLogin' () {
      this.isAuthenticated = Usuario.getLogado()
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        Usuario.setLogado(false)
        this.$store.commit('SET_VERIFICA_LOGIN')
        this.$router.replace('Login')
      })
    }
  }
}
</script>

<style scoped>

.nav-item{
  cursor: pointer;
}

nav li.router-link-active,
nav li.router-link-exact-active {
  border-right: 4px solid indigo;
  color: indigo;
}

.btn-sair:hover {
  background: indigo;
  color: white;
}

.nav-item:hover{
  background: #f8f9fa;
  color: indigo;
  border-right: 4px solid indigo;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

[role="main"] {
  padding-top: 48px; /* Space for fixed navbar */
}

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

</style>
