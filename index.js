(function(){

let result = document.querySelector('#resultContainer');
let fio    = document.querySelector('input[name="fio"]');
let email  = document.querySelector('input[name="email"]');
let phone  = document.querySelector('input[name="phone"]');
let submitBtn = document.querySelector('#submitButton');
let timeout   = 0;

document.addEventListener("DOMContentLoaded", () => {
	submitBtn.addEventListener('click', function(e) {
		e.preventDefault();

		MyForm.submit(this);
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
			fio  : fio.value,
			email: email.value,
			phone: phone.value
		};
	},

	setData(obj) {
		let array = obj.errorFields;

		if (array.indexOf(`fio`) !== -1) {
			fio.classList.add('error');
		} else {
			fio.classList.remove('error');
		}

		if (array.indexOf(`email`) !== -1) {
			email.classList.add('error');
		} else {
			email.classList.remove('error');
		}

		if (array.indexOf(`phone`) !== -1) {
			phone.classList.add('error');
		} else {
			phone.classList.remove('error');
		}
	},

	submit(elem){
		let validate = this.validate();
		let rand = getRandomInt(); console.log('1', rand);

		if (! validate.isValid) {
			utils.sendRequest('error.json', utils.showStatus);

			result.classList.add('error');
			result.classList.remove('success');
		} else if (validate.isValid) { //подумать над таймаутами
			while(rand > 5) {
				utils.sendRequest('progress.json', utils.setTimeout);

				setTimeout(() => {
					rand = getRandomInt();
					console.log(rand);
				}, timeout);
			}

			elem.setAttribute('disabled', 'disabled');
			utils.sendRequest('success.json', utils.showStatus);

			result.classList.add('success');
			result.classList.remove('error');
		}

		this.setData(validate);
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

		result.innerText = '';
		result.appendChild(text);
	},

	setTimeout(obj) {
		timeout =  parseInt(obj.timeout, 10);
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

function getRandomInt() {
	return Math.floor(Math.random() * (10)) + 0;
}

})();
