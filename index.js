/*

При отправке формы должна срабатывать валидация полей по следующим правилам:
- ФИО: Ровно три слова.
- Email: Формат email-адреса, но только в доменах ya.ru, yandex.ru, yandex.ua,
yandex.by, yandex.kz, yandex.com.
- Телефон: Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99.
Кроме того, сумма всех цифр телефона не должна превышать 30. Например,
для +7(111)222-33-11 сумма равняется 24, а для +7(222)444-55-66 сумма равняется 47.

В глобальной области видимости должен быть определен объект MyForm с методами
validate() => { isValid: Boolean, errorFields: String[] }
getData() => Object
setData(Object) => undefined
submit() => undefined

Метод validate возвращает объект с признаком результата валидации (isValid) и
массивом названий полей, которые не прошли валидацию (errorFields).
Метод getData возвращает объект с данными формы, где имена свойств
совпадают с именами инпутов.
Метод setData принимает объект с данными формы и устанавливает их инпутам формы.
Поля кроме phone, fio, email игнорируются.
Метод submit выполняет валидацию полей и отправку ajax-запроса, если валидация пройдена.
Вызывается по клику на кнопку отправить.

*/

document.addEventListener("DOMContentLoaded", () => {
	let submitBtn = document.querySelector('#submitButton');

	submitBtn.addEventListener('click', e => {
		e.preventDefault();

		console.log(MyForm.validate());
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

	setData(Object) {},

	submit(){
		this.validate();
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
	}
};
