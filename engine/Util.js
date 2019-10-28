// Модуль - коллекция инструментов.
;(function () {
	'use strict'

	const delayCollection = {}
	// Массив уникальных идентификаторов.
	const uids = []

	const Util = {}

	/*
		Метод позволяет проверить, прошло ли время timeoff в миллисекундах
		с момента создания экземпляра задержки с ключом name
	*/
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

	// Метод возвращает true, если точка point находится внутри прямоугольника rect.
	Util.isInside = function isInside (point, rect) {
		return rect.x <= point.x && point.x <= rect.x + rect.width
			&& rect.y <= point.y && point.y <= rect.y + rect.height
	}

	// Метод удаляет элементы из массива.
	Util.removeElements = function removeElements (array, ...elements) {
		for (const element of array) {
			if (array.includes(element)) {
				const index = array.indexOf(element)
				array.splice(index, 1)
			}
		}
	}

	// Метод возвращает сцену от заданного объекта.
	Util.getScene = function getScene (obj) {
		// Если объект отсутствует, или является экземпляром класса сцены:
		if (!obj || obj instanceof GameEngine.Scene) {
			return obj
		}

		return Util.getScene(obj, parent)
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