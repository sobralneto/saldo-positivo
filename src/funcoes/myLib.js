
const myLib = {

  escapeRegExp (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
  },

  replaceAll (string, find, replace) {
    return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace)
  },

  formatMoedaReal (int) {
    if (int) {
      int = this.replaceAll(this.replaceAll(int.toString(), '.', ''), ',', '')
      var tmp = int + ''
      tmp = tmp.replace(/([0-9]{2})$/g, ',$1')
      if (tmp.length > 6) {
        tmp = tmp.replace(/([0-9]{3}).([0-9]{2}$)/g, '.$1,$2')
      }
      return tmp
    }
  },

  replaceVirgulaMoeda (value) {
    let valorFormatado = value.toString()
    if (valorFormatado.indexOf(',') > 0) {
      valorFormatado = this.replaceAll(this.replaceAll(valorFormatado, '.', ''), ',', '.')
    }
    return valorFormatado
  },

  capitalize (s) {
    return s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase() })
  },

  returnDate (type) {
    var date = new Date()
    switch (type) {
      case 'monthName':
        return this.capitalize(date.toLocaleString('pt-br', { month: 'long' }))
      case 'monthId':
        return parseInt(date.getMonth() + 1)
      case 'year':
        return parseInt(date.getFullYear())
      default:
        break
    }
  },

  Left (str, n) {
    if (n <= 0) {
      return ''
    } else if (n > String(str).length) {
      return str
    } else {
      return String(str).substring(0, n)
    }
  },

  Right (str, n) {
    if (n <= 0) {
      return ''
    } else if (n > String(str).length) {
      return str
    } else {
      var iLen = String(str).length
      return String(str).substring(iLen, iLen - n)
    }
  }

}

export default myLib
