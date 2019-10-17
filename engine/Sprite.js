// Модуль содержит что и как нужно рисовать
;(function () {
	'use strict'

	class Sprite {
		// Текстура - то, что загрузили с клиента (изображение)
		constructor (texture, args = {}) {
			// текстура
			this.texture = texture
			// фрейм - кусок изображения, который нужно отрисовать
			const frame = args.frame || {}

			this.frame = {
				x: frame.x || 0,
				y: frame.y || 0,
				width: frame.width || texture.width,
				height: frame.height || texture.height
			}
			// координаты изображения
			this.x = args.x || 0
			this.y = args.y || 0
			/*
				Anchor изображения (показывает, какую часть изображения в процентах нужно взять,
				чтобы получить настоящий центр изображения).
				Изначально центр изображения находится в его левом верхнем углу (координаты 0, 0).
			*/
			this.anchorX = args.anchorX || 0
			this.anchorY = args.anchorY || 0
			// ширина и высота отрисовываемого изображения
			this.width = args.width || this.frame.width
			this.height = args.height || this.frame.height

			if (args.scale !== undefined ) {
				this.setScale(args.scale)
			}
		}

		// Метод задает значение 2 вычисляемым полям (масштабы по осям X, Y)
		setScale (value) {
			this.scaleX = value
			this.scaleY = value
		}

		// Координата X левого верхнего угла
		get absoluteX () {
			return this.x - this.anchorX * this.width
		}

		// Сеттер координаты X левого верхнего угла
		set absoluteX (value) {
			this.x = value + this.anchorX * this.width
			return value
		}

		// Координата Y левого верхнего угла
		get absoluteY () {
			return this.y - this.anchorY * this.height
		}

		// Сеттер координаты Y левого верхнего угла
		set absoluteY (value) {
			this.y = value + this.anchorY * this.height
			return value
		}

		// Геттер (метод) - вычисляемое на лету свойство
		get scaleX () {
			return this.width / this.frame.width
		}

		// Сеттер (метод) позволяет задавать значение вычисляемым полям
		set scaleX (value) {
			this.width = this.frame.width * value
			return value
		}

		// Геттер (метод) - вычисляемое на лету свойство
		get scaleY () {
			return this.height / this.frame.height
		}

		// Сеттер (метод) позволяет задавать значение вычисляемым полям
		set scaleY (value) {
			this.height = this.frame.height * value
			return value
		}

		// Функция рисует картинку основываясь на переданных канвасе и контексте
		draw (canvas, context) {
			context.drawImage(
				// текстура, которую нужно отрисовать
				this.texture,
				// source-координаты (координаты участка изображения,
				// который нужно отобразить)
				this.frame.x,
				this.frame.y,
				this.frame.width,
				this.frame.height,
				// координаты участка, где нужно отобразить
				this.absoluteX,
				this.absoluteY,
				this.width,
				this.height
			)
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Sprite = Sprite
})();