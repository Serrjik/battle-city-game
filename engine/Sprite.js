// Модуль содержит что и как нужно рисовать
;(function () {
	'use strict'

	class Sprite extends GameEngine.DisplayObject {
		// Текстура - то, что загрузили с клиента (изображение)
		constructor (texture, args = {}) {
			/*
				super() вызывает конструктор родительского класса.
				Нужно ВСЕГДА вызывать в конструкторе.
			*/
			super(args)
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

			if (args.width === undefined) {
				this.width = this.frame.width
			}

			if (args.height === undefined) {
				this.height = this.frame.height
			}
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