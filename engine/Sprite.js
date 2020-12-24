import DisplayObject from './DisplayObject'
import Util from './Util'

// Модуль содержит что и как нужно рисовать
export default class Sprite extends DisplayObject {
	// Текстура - то, что загрузили с клиента (изображение)
	constructor (texture, args = {}) {
		super(args)

		// Фрейм - кусок изображения, который нужно отрисовать.
		const frame = args.frame || {}
		const velocity = args.velocity || {}

		// Текстура.
		this.texture = texture
		// Массив ключей, которые будут подмешиваться автоматически.
		this.keysDefault = args.keysDefault || []

		this.frames = []
		this.frameNumber = 0
		// Через какое количество времени нужно будет обновить картинку.
		this.frameDelay = 0

		this.animations = {}
		// Название анимации, которая будет действовать
		this.animation = ''
		this.animationPaused = false

		/*
			Скорость. Вместо того, чтобы изменять координаты объекта, будем
			изменять его скорость.
			Координаты будут изменяться автоматом опираясь на скорость.
		*/
		this.velocity = {
			x: velocity.x || 0,
			y: velocity.y || 0
		}

		this.frame = {
			x: frame.x || 0,
			y: frame.y || 0,
			width: frame.width || texture ? texture.width : 0,
			height: frame.height || texture ? texture.height : 0
		}

		if (args.width === undefined) {
			this.width = this.frame.width
		}

		if (args.height === undefined) {
			this.height = this.frame.height
		}
	}

	// Метод задает массив frames.
	setFramesCollection (framesCollection) {
		this.frames = framesCollection
	}

	setAnimationsCollection (animationsCollection) {
		this.animations = animationsCollection
	}

	// Метод назначает анимацию.
	startAnimation (name) {
		// Проверить, есть ли такая анимация?
		// Если такой анимации нет:
		if (!this.animations.hasOwnProperty(name)) {
			// Не удалось назначить такую анимацию.
			return false
		}

		// Если такая анимация есть:
		const { duration = Infinity, keys } = this.animations[name]

		this.animation = name
		this.frameDelay = duration / keys.length
		// Обратиться к выбранной анимации и выбрать самый первый фрейм.
		this.setFrameByKeys(...keys[0])
	}

	// Метод останавливает анимацию.
	pauseAnimation () {
		this.animationPaused = true
	}

	// Метод возобновлет анимацию.
	resumeAnimation () {
		this.animationPaused = false
	}

	setFrameByKeys (...keys) {
		const frame = this.getFrameByKeys(...keys, ...this.keysDefault)

		// Если фрейм не был найден:
		if (!frame) {
			return false
		}

		// Если фрейм был найден, задать параметры текущему фрейму:
		this.frame.x = frame.x
		this.frame.y = frame.y
		this.frame.width = frame.width
		this.frame.height = frame.height

		// Установить размеры объекта:
		this.width = this.frame.width
		this.height = this.frame.height
	}

	getFrameByKeys (...keys) {
		/*
			Нужно найти среди всех фреймов фрейм,
			который подходит под переданные ключи.
		*/
		let flag = false

		for (const frame of this.frames) {
			// Предположим, что фрейм, который обрабатывается сейчас, подходит.
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
		if (!this.animationPaused &&
		this.animation
		&& Util.delay(this.animation + this.uid, this.frameDelay)) {
			const { keys } = this.animations[this.animation]

			this.frameNumber = (this.frameNumber + 1) % keys.length
			this.setFrameByKeys(...keys[this.frameNumber])

			/*
				Каждый раз, перед тем как будет обновляться фрейм,
				будет генерироваться событие frameChange.
				И можно передавать список аргументов this (сколько угодно через
				запятую). Любой объект может генерировать события.
			*/
			this.emit('frameChange', this)
		}

		this.x += this.velocity.x
		this.y += this.velocity.y
	}

	// Функция рисует картинку основываясь на переданных канвасе и контексте.
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
			/*
				- стоит для того чтобы вращение происходило
				против часовой стрелки.
			*/
			context.rotate(-this.rotation)
			/*
				В спрайтах откажемся от масштаба
				ради упрощения проверки столкновения двух объеков.
			*/
			// context.scale(this.scaleX, this.scaleY)

			// Рисовать картинку в случае, если текстура есть.
			if (this.texture) {
				context.drawImage(
					// текстура, которую нужно отрисовать
					this.texture,
					/*
						source-координаты (координаты участка изображения,
						который нужно отобразить).
					*/
					this.frame.x,
					this.frame.y,
					this.frame.width,
					this.frame.height,
					// Координаты участка, где нужно отобразить.
					this.absoluteX - this.x,
					this.absoluteY - this.y,
					/*
						Здесь не изменяем размер изображения,
						потому что он изменяется для всего контекста.
						Масштабировать будем непосредственно здесь.
					*/
					this.width * this.scaleX,
					this.height * this.scaleY
				)
			}

			// Отображает, где якорь?
			// context.beginPath()
			// context.fillStyle = 'red'
			// context.arc(0, 0, 5, 0, Math.PI * 2)
			// context.fill()

			context.restore()
		})
	}
}