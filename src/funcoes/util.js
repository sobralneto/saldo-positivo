function formatMoedaReal (int) {
  if (int) {
    int = replaceAll(replaceAll(int.toString(), '.', ''), ',', '')      
    var tmp = int + ''
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1")
    if (tmp.length > 6) {
      tmp = tmp.replace(/([0-9]{3}).([0-9]{2}$)/g, ".$1,$2");
    }
    return tmp
  }
}

function replaceAll (string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function escapeRegExp (string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}

function replaceVirgulaMoeda (value) {
  let valorFormatado = value.toString()
  if (valorFormatado.indexOf(',') > 0) {
    valorFormatado = replaceAll(replaceAll(valorFormatado, '.', ''), ',', '.')
  }
  return valorFormatado
}

function capitalize (s) {
  return s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase() })
}

function returnDate (type) {
  let date = new Date()
  switch (type) {
    case 'monthName':
      return capitalize(date.toLocaleString('pt-br', { month: 'long' }))
    case 'monthId':
      return parseInt(date.getMonth() + 1)
    case 'year':
      return parseInt(date.getFullYear())
    default:
      break
  }
}

function Left (str, n) {
  if (n <= 0) {
    return ''
  } else if (n > String(str).length) {
    return str
  } else {
    return String(str).substring(0,n)
  }
}

function Right (str, n) {
  if (n <= 0) {
    return ''
  } else if (n > String(str).length) {
    return str
  } else {
    var iLen = String(str).length
    return String(str).substring(iLen, iLen - n)
  }
}
