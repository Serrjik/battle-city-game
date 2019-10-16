// Модуль отвечает за загрузку данных и скриптов

;(function () {
	'use strict'

	class Loader {
		// Эта функция вызывается при создании экземпляра класса
		constructor () {
			// Объекты, которые нужно загрузить:
			this.loadOrder = {
				images: [],
				jsons: []
			}
			// Ресурсы:
			this.resources = {
				images: [],
				jsons: []
			}
		}

		// Метод добавляет объект(изображение) в loadOrder, в очередь на загрузку
		addImage (name, src) {
			this.loadOrder.images.push({ name, src })
		}

		addJson (name, address) {
			this.loadOrder.jsons.push({ name, address })
		}

		// callback - функция, которая будет вызвана, когда все изображения и JSON-файлы будут загружены
		load (callback) {
			const promises = []

			// Пройдем по всем изображениям, которые нужно загрузить
			for (const imageData of this.loadOrder.images) {
				const { name, src } = imageData

				const promise = Loader
					.loadImage(src)
					.then(image => {
						this.resources.images[name] = image

						// Здесь из loadOrder удаляется запись о необходимости загрузки изображения
						if (this.loadOrder.images.includes(imageData)) {
							const index = this.loadOrder.images.indexOf(imageData)
							this.loadOrder.images.splice(index, 1)
						}
					})

				promises.push(promise)
			}

			// Пройдем по всем JSON-файлам, которые нужно загрузить
			for (const jsonData of this.loadOrder.jsons) {
				const { name, address } = jsonData

				const promise = Loader
					.loadJson(address)
					.then(json => {
						this.resources.jsons[name] = json

						// Здесь из loadOrder удаляется запись о необходимости загрузки изображения
						if (this.loadOrder.jsons.includes(jsonData)) {
							const index = this.loadOrder.jsons.indexOf(jsonData)
							this.loadOrder.jsons.splice(index, 1)
						}
					})

				promises.push(promise)
			}

			// Когда загрузятся все изображения и JSON-файлы
			Promise.all(promises).then(callback)
		}

		/*
			Это статический метод.
			Он принадлежит не экземпляру класса, а самому классу.
		*/
		// Метод загружает изображение правильным способом (нужно запомнить этот способ)
		static loadImage (src) {
			/*
				Promise принимает функцию с 2-мя методами.
				resolve вызывается когда нужный процесс был закончен, и Promise считается выполненным.
				reject вызывается при ошибке
			*/
			return new Promise((resolve, reject) => {
				try {
					const image = new Image
					image.onload = () => resolve(image)
					image.src = src
				}

				catch (err) {
					reject(err)
				}
			})
		}

		// Метод загружает JSON-файл правильным способом (нужно запомнить этот способ)
		static loadJson (address) {
			/*
				Promise принимает функцию с 2-мя методами.
				resolve вызывается когда нужный процесс был закончен, и Promise считается выполненным.
				reject вызывается при ошибке
			*/
			return new Promise((resolve, reject) => {
				fetch(address)
					.then(result => result.json())
					.then(result => resolve(result))
					// catch() подписывается на ошибку Promise'а
					.catch(err => reject(err))
			})
		}

	}

	/*
		Если этот файл является не первым, который пытается использовать GameEngine,
		то GameEngine его запоминает. А иначе создает объект.
	*/
	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Loader = Loader

})();