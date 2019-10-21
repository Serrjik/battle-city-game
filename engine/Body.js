// Модуль имеет так называемое Тело
;(function () {
	'use strict'

	class Body extends GameEngine.Sprite {
		// Текстура - то, что загрузили с клиента (изображение)
		constructor (texture, args = {}) {
			/*
				super() вызывает конструктор родительского класса.
				Нужно ВСЕГДА вызывать в конструкторе.
			*/
			super(texture, args)

			const body = args.body || {}

			// Если поле debug будет true, будем видеть тело спрайта.
			this.debug = args.debug || false

			this.body = {}
			this.body.x = body.x || 0
			this.body.y = body.y || 0
			this.body.width = body.width || 1
			this.body.height = body.height || 1
		}

		draw (canvas, context) {
			if (!this.visible) {
				return
			}

			context.save()
			context.translate(this.x, this.y)
			// - стоит для того чтобы вращение происходило против часовой стрелки
			context.rotate(-this.rotation)

			context.save()
			context.scale(this.scaleX, this.scaleY)

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
				this.absoluteX - this.x,
				this.absoluteY - this.y,
				/*
					Здесь не изменяем размер изображения,
					потому что он изменяется для всего контекста
				*/
				this.width,
				this.height
			)

			context.restore()

			// Если debug === true:
			if (this.debug) {
				context.fillStyle = 'red'
				context.strokeStyle = 'red'

				// Отрисуем якорь
				context.beginPath()
				context.arc(0, 0, 3, 0, Math.PI * 2)
				context.fill()
			}

			// Отображает, где якорь?
			/*context.beginPath()
			context.fillStyle = 'red'
			context.arc(0, 0, 5, 0, Math.PI * 2)
			context.fill()*/

			context.restore()
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Body = Body
})();