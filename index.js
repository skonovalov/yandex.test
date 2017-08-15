(function(){

let result = document.querySelector('#resultContainer');

document.addEventListener("DOMContentLoaded", () => {
	let submitBtn = document.querySelector('#submitButton');

	submitBtn.addEventListener('click', e => {
		e.preventDefault();

		MyForm.submit();
	});
});

let MyForm = {
	validate() {
		let isValid     = false;
		let errorFields = [];
		let data        = this.getData();

		for (let item in data) {
			if (item === 'fio' && ! utils.validateName(data[item])) {
				errorFields.push(item);
			}

			if (item === 'email' && ! utils.validateEmail(data[item])) {
				errorFields.push(item);
			}

			if (item === 'phone' && ! utils.validatePhone(data[item])) {
				errorFields.push(item);
			}
		}

		return {
			isValid: (errorFields.length === 0),
			errorFields
		};
	},

	getData() {
		return {
			fio  : document.querySelector('input[name="fio"]').value,
			email: document.querySelector('input[name="email"]').value,
			phone: document.querySelector('input[name="phone"]').value
		};
	},

	setData(Object) {

	},

	submit(){
		let validate = this.validate();

		if (! validate.isValid) {
			utils.sendRequest('error.json', utils.showStatus);
			result.classList.add('error');

			validate.errorFields.forEach((item) => {
				document.querySelector(`input[name="${item}"]`).classList.add('error');
			});
		} else if (validate.isValid) {
			utils.sendRequest('success.json', utils.showStatus);
		}
	}
};

let utils = {
	validateName(value) {
		return value.split(' ').filter(Boolean).length === 3;
	},

	validateEmail(value) {
		let domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];

		for (let item of domains) {
			if (value.indexOf(`@${item}`) !== -1) {
				return true;
			}
		}
	},

	validatePhone(value) {
		let reg    = /\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}/g;
		let accept = reg.test(value);
		let sum    = 0;

		for (let digit of value) {
			let val = parseInt(digit, 10);

			if (val >= 0 && val <= 9 && typeof val === 'number') {
				sum += val;
			}
		}

		return accept && sum <= 30;
	},

	showStatus(obj) {
		let text = document.createTextNode(obj.reason);

		result.appendChild(text);
	},

	sendRequest(url, callback) {
		let xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.send(null);

		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				callback(JSON.parse(this.responseText));
			}
		};
	}
};

})();
