// Модуль содержит что и как нужно рисовать
;(function () {
	'use strict'

	class Sprite {
		// Текстура - то, что загрузили с клиента (изображение)
		constructor (texture) {
			// текстура
			this.texture = texture
			// фрейм - кусок изображения, который нужно отрисовать
			this.frame = {
				x: 0,
				y: 0,
				width: texture.width,
				height: texture.height
			}
			// координаты изображения
			this.x = 0
			this.y = 0
			// ширина и высота отрисовываемого изображения
			this.width = this.frame.width
			this.height = this.frame.height
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
				this.x,
				this.y,
				this.width,
				this.height
			)
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Sprite = Sprite
})();