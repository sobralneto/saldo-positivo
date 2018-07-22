<template>
  <div v-cloak>
    <div class="row mt-3">
      <div class=" mx-auto">
        <filtro-lancamento></filtro-lancamento>
      </div>
    </div>
    <div class="row mt-3">
      <b-card no-body class="col-12 p-0">
        <b-tabs pills card vertical>
          <b-tab title="Receitas x Despesas" active>
            <div v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 p-0 mt-2">
                  <chart-receita-despesa></chart-receita-despesa>
                </div>
              </div>
          </b-tab>
          <b-tab title="Categorias">
            <div class="row" v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 p-0 mt-2">
                  <chart-categoria></chart-categoria>
                  <div class="col-md-6 float-left">
                    <canvas id="chartPizzaCategoriaReceita" class="m-auto" style="max-height: 500px; max-width: 100%;"></canvas>
                  </div>

                  <div class="col-md-6 float-right">
                    <canvas id="chartPizzaCategoriaDespesa" class="m-auto" style="max-height: 500px; max-width: 100%;"></canvas>
                  </div>

                </div>
              </div>
          </b-tab>
          <b-tab title="Contas">
            <div v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 p-0 mt-2">
                  <chart-conta></chart-conta>
                </div>
              </div>
          </b-tab>
          <b-tab title="Cartões de Crédito">
            <div class="row" v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 pt-2">
                  <chart-cartao-credito></chart-cartao-credito>
                </div>
              </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="row" v-show="mensagens.msgErro">
          <div class="col-md-12 col-sm-12 pt-2 m-auto">
            <div class="alert alert-danger" role="alert">{{ mensagens.msgErro }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FiltroLancamento from '../../utilitarios/FiltroLancamento'
import ChartReceitaDespesa from './ChartReceitaDespesa'
import ChartConta from './ChartConta'
import ChartCartaoCredito from './ChartCartaoCredito'
import ChartCategoria from './ChartCategoria'

export default {
  name: 'Relatorio',
  components: {
    'filtro-lancamento': FiltroLancamento,
    'chart-receita-despesa': ChartReceitaDespesa,
    'chart-conta': ChartConta,
    'chart-cartao-credito': ChartCartaoCredito,
    'chart-categoria': ChartCategoria
  },
  data () {
    return {
      mensagens: {
        msgErro: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
