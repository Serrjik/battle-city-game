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

			this.frames = []
			// this.frames = args.frames || []
			this.frameNumber = 0
			// Через какое количество времени нужно будет обновить картинку
			this.frameDelay = 0

			// this.animations = []
			this.animations = {}
			this.animation = '' // Название анимации, которая будет действовать

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

		// Метод задает массив frames
		setFramesCollection (framesCollection) {
			this.frames = framesCollection
			// console.log(this.frames)
		}

		setAnimationsCollection (animationsCollection) {
			this.animations = animationsCollection
		}

		// Метод назначает анимацию.
		startAnimation (name) {
			// Проверить, есть ли такая анимация?
			// Если такой анимации нет:
			if (!this.animations.hasOwnProperty(name)) {
				return false // Не удалось назначить такую анимацию.
			}

			// Если такая анимация есть:
			const { duration, frames } = this.animations[name]

			this.animation = name
			this.frameDelay = duration / frames.length
			// Обратиться к выбранной анимации и выбрать самый первый фрейм:
			this.setFrameByKeys(...frames[0])
		}

		setFrameByKeys (...keys) {
			const frame = this.getFrameByKeys(...keys)

			// Если фрейм не был найден:
			if (!frame) {
				return false
			}

			// Если фрейм был найден, задать параметры текущему фрейму:
			this.frame.x = frame.x
			this.frame.y = frame.y
			this.frame.width = frame.width
			this.frame.height = frame.height
		}

		getFrameByKeys (...keys) {
			/*
				Нужно найти среди всех фреймов фрейм,
				который подходит под переданные ключи.
			*/
			let flag = false

			for (const frame of this.frames) {
				// Предположим, что фрейм, который обрабатывается сейчас, подходит
				flag = true

				for (const key of keys) {
					// Если такого ключа не будет найдено, флаг опускаем.
					if (!frame.keys.includes(key)) {
						flag = false
						break
					}
				}

				if (flag) {
					return JSON.parse(JSON.stringify(frame))
				}
			}
		}

		// Метод изменяет координаты спрайта, опираясь на скорость.
		tick (timestamp) {
			if (this.animation && Util.delay(this.animation + this.uid, this.frameDelay)) {
				const { frames } = this.animations[this.animation]

				this.frameNumber = (this.frameNumber + 1) % frames.length
				this.setFrameByKeys(...frames[this.frameNumber])
			}

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