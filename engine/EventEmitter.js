// Модуль генерирует События
;(function () {
	'use strict'

	class EventEmitter {
		// Текстура - то, что загрузили с клиента (изображение)
		constructor () {
			// Обработчики
			this.handlers = {}
		}

		// Метод-alias (короткая форма записи метода addEventListener() )
		on (...args) {
			this.addEventListener(...args)
		}

		// Метод-alias (короткая форма записи метода removeEventListener() )
		off (...args) {
			this.removeEventListener(...args)
		}

		addEventListener (name, handler) {
			// Если обработчик handler с именем name отсутствует:
			if (!this.handlers.hasOwnProperty(name)) {
				// Добавим его
				this.handlers[name] = []
			}

			this.handlers[name].push(handler)
		}

		removeEventListener (name = null, handler = null) {
	/*		// Если присутствую обработчик handler с именем name, значит мы хотим удалить его
			if (name && handler) {

			}*/
		}

		emit (name, ...args) {
			// Если нет события name, ничего не делать:
			if (!this.handlers.hasOwnProperty(name)) {
				return
			}

			/*
				Если событие name есть, пройдем по всем обработчикам события name,
				и зарегистрируем их вызов.
			*/
			for (const handler of this.handlers[name]) {
				handler(...args)
			}
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.EventEmitter = EventEmitter
})();