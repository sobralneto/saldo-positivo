<template>
  <div v-cloak>

    <div class="row">

      <div class="col-md-3 col-sm-12">
        <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a class="nav-link active" id="v-receita-despesa-tab" data-toggle="pill" href="#v-pills-receita-despesa" role="tab" aria-controls="v-pills-receita-despesa">Receitas x Despesas</a>

          <a class="nav-link" id="v-pills-categoria-tab" data-toggle="pill" href="#v-pills-categoria" role="tab" aria-controls="v-pills-categoria">Categorias</a>

          <a class="nav-link" id="v-pills-conta-tab" data-toggle="pill" href="#v-pills-conta" role="tab" aria-controls="v-pills-conta">Contas</a>

          <a class="nav-link" id="v-pills-cartao-tab" data-toggle="pill" href="#v-pills-cartao" role="tab" aria-controls="v-pills-cartao">Cartões de crédito</a>
        </div>    
      </div>

      <div class="col-md-9 col-sm-12">

        <div class="row">
          <div class=" mx-auto">
            <filtro-lancamento></filtro-lancamento>
          </div>
        </div>

        <div class="col-12">

          <div class="tab-content" id="v-pills-tabContent">
            
            <div class="tab-pane fade show active" id="v-pills-receita-despesa" role="tabpanel" aria-labelledby="v-receita-despesa-tab">
              <div v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 p-0 mt-2">
                  <chart-receita-despesa></chart-receita-despesa>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="v-pills-categoria" role="tabpanel" aria-labelledby="v-pills-categoria-tab">
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
            </div>

            <div class="tab-pane fade" id="v-pills-conta" role="tabpanel" aria-labelledby="v-pills-conta-tab">
              <div v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 p-0 mt-2">
                  <chart-conta></chart-conta>
                </div>
              </div>
            </div>            

            <div class="tab-pane fade" id="v-pills-cartao" role="tabpanel" aria-labelledby="v-pills-cartao-tab">
              <div class="row" v-show="!mensagens.msgErro">
                <div class="col-md-12 col-sm-12 pt-2">
                  <chart-cartao-credito></chart-cartao-credito>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    
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
