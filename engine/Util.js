// Модуль - коллекция инструментов.
;(function () {
	'use strict'

	const delayCollection = {}
	// Массив уникальных идентификаторов.
	const uids = []

	const Util = {}

	// Задержка
	Util.delay = function delay (name, timeoff = null) {
		// Если такая задержка отсутсвует:
		if (!delayCollection[name]) {
			delayCollection[name] = Date.now()
			return true
		}

		/*
			Если другой раз вызываем задержку с тем же имененем,
			проверим, прошло ли достаточное количество времени
			после создания этого экземпляра:
		*/
		if (delayCollection[name] + timeoff > Date.now()) {
			return false
		}

		delayCollection[name] = Date.now()

		return true
	}

	// Метод создает уникальный идентификатор.
	Util.generateUid = function generateUid (size = 10) {
		let uid = getRandomString()

		// Проверить, нет ли уже такой строки. Если есть, сгенерировать заново:
		while (uids.includes(uid)) {
			uid = getRandomString()
		}

		return uid
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Util = Util

	const alphabet = 'qwertyuiopasdfghjklzxcvbnm1234567890'

	// Функция возвращает случайный символ из заданной строки.
	function getRandomLetter () {
		return alphabet[Math.floor(Math.random() * alphabet.length)]
	}

	// Функция возвращает строку заданной длины из случайных символов.
	function getRandomString (size = 10) {
		let str = ''

		while (str.length < size) {
			str += getRandomLetter()
		}

		return str
	}
})();