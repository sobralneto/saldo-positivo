<template>
<div>
    <header>
      <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark align-content-center">
        <div class="container">
          <router-link class="navbar-brand" :to="{ name: 'Dashboard' }">Saldo Positivo</router-link>

          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarMenu">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
              <li class="nav-item">
                <router-link class="nav-link text-white" :to="{ name: 'Dashboard' }">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" :to="{ name: 'LancamentoConsulta' }">Consulta Lançamentos</router-link>
              </li>              
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Lançamentos
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <router-link class="dropdown-item text-success" :to="{ name: 'Lancamento', params: { tipo: '1'} }"><i class="material-icons text-success align-bottom">fiber_manual_record</i> Receita</router-link>
                    <router-link class="dropdown-item text-danger" :to="{ name: 'Lancamento', params: { tipo: '2'} }"><i class="material-icons text-danger align-bottom">fiber_manual_record</i> Despesa</router-link>
                    <router-link class="dropdown-item text-dark" :to="{ name: 'Lancamento', params: { tipo: '3'} }"><i class="material-icons text-dark align-bottom">fiber_manual_record</i> Transferência</router-link>
                  </div>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" :to="{ name: 'Relatorio' }">Relatórios</router-link>
              </li>
              <li class="nav-item dropdown float-rigth">
                  <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Cadastros
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <router-link class="dropdown-item" :to="{ name: 'Conta' }">Contas</router-link>
                    <router-link class="dropdown-item" :to="{ name: 'CartaoCredito' }">Cartões de crédito</router-link>
                    <router-link class="dropdown-item" :to="{ name: 'Categoria' }">Categorias</router-link>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main class="container">
      <div class="row">
        <div class="col align-content-start text-left pt-3 pb-0">
          <router-view/> <!-- aqui vai o conteúdo da página -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
