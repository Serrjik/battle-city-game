// Модуль отвечает за загрузку данных и скриптов
export default class Loader {
	// Эта функция вызывается при создании экземпляра класса
	constructor () {
		// Объекты, которые нужно загрузить:
		this.loadOrder = {
			images: [],
			jsons: [],
			sounds: []
		}
		// Ресурсы:
		this.resources = {
			images: {},
			jsons: {},
			sounds: {}
		}
	}

	// Метод добавляет объект(изображение) в loadOrder, в очередь на загрузку
	addImage (name, src) {
		this.loadOrder.images.push({ name, src })
	}

	addJson (name, address) {
		this.loadOrder.jsons.push({ name, address })
	}

	addSound (name, src) {
		this.loadOrder.sounds.push({ name, src })
	}

	// Метод возвращает запрашиваемый ресурс
	getImage (name) {
		return this.resources.images[name]
	}

	// Метод возвращает запрашиваемый ресурс
	getJson (name) {
		return this.resources.jsons[name]
	}

	// Метод возвращает запрашиваемый ресурс
	getSound (name) {
		return this.resources.sounds[name]
	}

	/*
		callback - функция, которая будет вызвана,
		когда все изображения и JSON-файлы будут загружены.
	*/
	load (callback) {
		const promises = []

		// Пройдем по всем изображениям, которые нужно загрузить
		for (const imageData of this.loadOrder.images) {
			const { name, src } = imageData

			const promise = Loader
				.loadImage(src)
				.then(image => {
					this.resources.images[name] = image

					/*
						Здесь из очереди loadOrder удаляется
						запись о необходимости загрузки изображения
					*/
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

					/*
						Здесь из очереди loadOrder удаляется
						запись о необходимости загрузки изображения
					*/
					if (this.loadOrder.jsons.includes(jsonData)) {
						const index = this.loadOrder.jsons.indexOf(jsonData)
						this.loadOrder.jsons.splice(index, 1)
					}
				})

			promises.push(promise)
		}

		// Пройдем по всем audio-файлам, которые нужно загрузить
		for (const soundData of this.loadOrder.sounds) {
			const { name, src } = soundData

			const promise = Loader
				.loadSound(src)
				.then(audio => {
					this.resources.sounds[name] = audio

					/*
						Здесь из очереди loadOrder удаляется
						запись о необходимости загрузки изображения
					*/
					if (this.loadOrder.sounds.includes(soundData)) {
						const index = this.loadOrder.sounds.indexOf(soundData)
						this.loadOrder.sounds.splice(index, 1)
					}
				})

			promises.push(promise)
		}

		// promise скажет что элемент выполнен через определенное время.
		// promises.push(new Promise(resolve => setTimeout(resolve, 1000)))

		// Когда загрузятся все изображения и JSON-файлы
		Promise.all(promises).then(callback)
	}

	/*
		Это статический метод.
		Он принадлежит не экземпляру класса, а самому классу.
	*/
	// Метод загружает изображение правильным способом.
	static loadImage (src) {
		/*
			Promise принимает функцию с 2-мя методами.
			resolve вызывается когда нужный процесс был закончен, и Promise
			считается выполненным. reject вызывается при ошибке.
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

	// Метод загружает JSON-файл правильным способом.
	static loadJson (address) {
		/*
			Promise принимает функцию с 2-мя методами.
			resolve вызывается когда нужный процесс был закончен, и Promise
			считается выполненным. reject вызывается при ошибке.
		*/
		return new Promise((resolve, reject) => {
			fetch(address)
				.then(result => result.json())
				.then(result => resolve(result))
				// catch() подписывается на ошибку Promise'а
				.catch(err => reject(err))
		})
	}

	static loadSound (src) {
		return new Promise((resolve, reject) => {
			try {
				const audio = new Audio
				// audio.addEventListener('canplaythrough', () => waiter('canplaythrough'))
				// audio.addEventListener('ended', () => waiter('ended'))
				audio.src = src

				// let i = 0
				// function waiter (event) {
				// 	console.log(event)
				// 	i++

				// 	if (i >= 2) {
				// 		resolve(audio)
				// 	}
				// }
			}

			catch (error) {
				reject(error)
			}
		})
	}
}