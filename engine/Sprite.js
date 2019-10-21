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
			// фрейм - кусок изображения, который нужно отрисовать
			const frame = args.frame || {}
			const velocity = args.velocity || {}

			// текстура
			this.texture = texture

			/*
				Скорость.
				Вместо того, чтобы изменять координаты объекта, будем изменять его скорость.
				Координаты будут изменяться автоматом опираясь на скорость.
			*/
			this.velocity = {
				x: velocity.x || 0,
				y: velocity.y || 0
			}

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

		// Метод изменяет координаты спрайта, опираясь на скорость.
		tick (timestamp) {
			this.x += this.velocity.x
			this.y += this.velocity.y
		}

		// Функция рисует картинку основываясь на переданных канвасе и контексте
		draw (canvas, context) {
			/*
				super.draw() проверяет, объект - visible, или нет.
				Если объект видимый (visible === true),
				то сработает переданная в него функция и объект отрисуется.
			*/
			super.draw(() => {
				context.save()
				// Сместить координаты:
				context.translate(this.x, this.y)
				// - стоит для того чтобы вращение происходило против часовой стрелки
				context.rotate(-this.rotation)
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

				// Отображает, где якорь?
				/*context.beginPath()
				context.fillStyle = 'red'
				context.arc(0, 0, 5, 0, Math.PI * 2)
				context.fill()*/

				context.restore()
			})
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Sprite = Sprite
})();