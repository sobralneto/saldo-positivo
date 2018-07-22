import firebase from 'firebase'
import $ from 'jquery'

const Usuario = {

  getToken () {
    return localStorage.getItem(btoa('saldoPositivoToken'))
  },

  getTokenApi (idFirebase, email) {
    let url = `${process.env.VUE_APP_ROOT_API}/login/token`
    let postData = {Password: idFirebase, UserName: email, grant_type: 'password'}

    $.ajax({
      url: url,
      method: 'post',
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      data: postData,
      async: false,
      success: (response) => {
        if (response.access_token) {
          localStorage.setItem(btoa('saldoPositivoToken'), response.access_token)
          Usuario.setLogado(true)
        } else {
          Usuario.setLogado(false)
        }
      },
      error: (e) => {
        Usuario.setLogado(false)
      }
    })
  },

  getLogado () {
    let currentUser = firebase.auth().currentUser

    if (!currentUser) {
      this.setLogado(false)
      return false
    } else {
      let authenticated = ''

      if (localStorage.getItem(btoa('saldoPositivoLogado')) === null) {
        this.setLogado(false)
        authenticated = 'false'
      } else {
        authenticated = localStorage.getItem(btoa('saldoPositivoLogado'))
      }

      if (authenticated === 'true') {
        return true
      } else {
        return false
      }
    }
  },

  setLogado (logado) {
    localStorage.setItem(btoa('saldoPositivoLogado'), logado)
    if (!logado) {
      localStorage.removeItem(btoa('saldoPositivoToken'))
    }
  }

}

export default Usuario
