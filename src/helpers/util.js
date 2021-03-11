export const FormatDate = _value => {
	try {
		//recebe como YYYY-MM-DD
		//retorna como DD/MM/YYYY
		if (_value && !IsNullOrEmpty(_value) && OnlyNumbers(_value.substring(0, 10)).length === 8) {
			const ARRAY_DATE = _value.substring(0, 10).split('-');
			let dateFormatted = new Date(ARRAY_DATE[0], parseInt(ARRAY_DATE[1]) - 1, parseInt(ARRAY_DATE[2])).toLocaleString('pt-BR').substring(0, 10);
			return dateFormatted;
		} else {
			return '';
		}
	} catch {
		return '';
	}
};

export const FormatCurrency = _value => {
	try {
		return _value ? _value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
	} catch {
		return '';
	}
};

export const ReplaceValoresMoeda = _value => {
	return _value && _value.toString().indexOf(',') > 0 ? replaceAll(replaceAll(_value.toString(), '.', ''), ',', '.') : _value;
};

function replaceAll(string, find, replace) {
	if (string != null) {
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	} else {
		return '';
	}
}

function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\\[\]\\/\\])/g, '\\$1');
}

export const OnlyNumbers = _value => {
	try {
		return _value.toString().replace(/[^0-9]/g, '');
	} catch {
		return '';
	}
};

export const IsNullOrEmpty = _value => {
	try {
		return _value ? false : true;
	} catch {
		return true;
	}
};
