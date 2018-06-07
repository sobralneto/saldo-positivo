<template>
  <div v-cloak>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <label>Grupos de Categoria <font color="red">*</font></label>
        <select class="form-control" v-model="IdGrupoCategoria">
          <option v-for="gc in listaGrupoCategoria" :value="gc.IdGrupoCategoria" :key="gc.IdGrupoCategoria">{{ gc.Nome }}</option>
        </select>
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Categoria <font color="red">*</font></label>
        <input type="text" class="form-control" maxlength="200" v-model="NomeCategoria" autofocus id="txtCategoria" v-on:keyup.enter="cadastrarCategoria" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-12 pt-2">
        <button v-on:click="cadastrarCategoria" class="btn btn-primary">Cadastrar</button>
        <p v-if="mensagens.listaErros.length" class="pt-3">
          <b>{{ mensagens.listaErros.length }} erro(s) encontrado(s) no cadastro:</b>
          <ul>
            <li class="text-danger" v-for="error in mensagens.listaErros" :key="error">{{ error }}</li>
          </ul>
        </p>
        <div class="alert alert-danger" role="alert" v-show="mensagens.msgErro">
          {{ mensagens.msgErro }}
        </div>
        <div class="alert alert-success" role="alert" v-show="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
    <div class="row" v-if="listaCategorias.length">
      <div class="col-md-6 col-sm-12 pt-2">
        <table class="table table-hover table-striped table-sm">
          <caption>{{ listaCategorias.length }} categoria(s) cadastrada(s)</caption>
          <thead class="bg-primary text-white">
            <tr>
                <th><center>Grupo categoria</center></th>
                <th><center>Categoria</center></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in listaCategorias" :key="categoria.IdCategoria">
              <td>{{ categoria.NomeGrupoCategoria }}</td>
              <td>{{ categoria.Nome }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "Categoria",
  data() {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      IdGrupoCategoria: 0,
      NomeCategoria: null,
      listaGrupoCategoria: [],
      listaCategorias: [],
      mensagens: {
        listaErros: [],
        msgErro: '',
        msgSucesso: ''
      }
    };
  },
  created() {
    this.carregaListaGrupoCategoria();
    this.carregaListaCategorias();
  },
  methods: {
    checkFormCadastro () {

      this.mensagens.listaErros = [];
      if (!this.IdGrupoCategoria) this.mensagens.listaErros.push("Informe o grupo de categoria")
      if (!this.NomeCategoria) this.mensagens.listaErros.push("Informe a categoria")
      if (!this.mensagens.listaErros.length) return true
    },
    carregaListaGrupoCategoria () {

      axios.post(`${this.requestUrl}/categoria/listarGrupoCategorias`)
      .then(response => {
        this.listaGrupoCategoria = response.data        
      })
      .catch((error) => {
        this.mensagens.msgErro = error
      })

    },
    carregaListaCategorias () {

      axios.post(`${this.requestUrl}/categoria/ListarCategorias`)
      .then(response => {
        this.listaCategorias = response.data          
      })
      .catch((error) => {
        this.mensagens.msgErro = error
      })

    },
    cadastrarCategoria () {
        
      this.mensagens.listaErros = [];
      this.mensagens.msgErro = ''
      this.msgSucesso = '';

      if (this.checkFormCadastro()) {

        var model = {
            IdGrupoCategoria: parseInt(this.IdGrupoCategoria),
            NomeCategoria: this.NomeCategoria.toString()
        }

        axios.post(`${this.requestUrl}/categoria/cadastrar`, model, {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {

          this.mensagens.msgSucesso = 'Cadastro efetuado com sucesso'
          this.NomeCategoria = ''
          document.getElementById('txtCategoria').focus
          setTimeout(function () {
            this.mensagens.msgSucesso = ''
          }.bind(this), 2000)
          this.carregaListaCategorias()
        })
        .catch((error) => {
          this.mensagens.msgErro = error
        })

      }        
    } 
  }
};
</script>

<style scoped>
</style>
