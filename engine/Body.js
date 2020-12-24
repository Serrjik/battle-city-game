import Sprite from './Sprite'
import Util from './Util'

// Модуль имеет так называемое Тело
export default class Body extends Sprite {
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

		// Если static = true, то тело не проверяется на столкновение.
		this.static = args.static || false

		this.body = {}
		// x и y - смещения относительно осей x и y.
		this.body.x = body.x || 0
		this.body.y = body.y || 0
		// Тело 100% от спрайта и высота и длина 100% от высоты и длины спрайта.
		this.body.width = body.width || 1
		this.body.height = body.height || 1
	}

	/*
		Геттер возвращает координаты x, y, ширину и высоту относительно body
		(получим прямоугольник body в абсолютных величинах).
	*/
	get bodyRect () {
		// Учитываем scale
		return {
			x: this.absoluteX + this.width * this.scaleX * this.body.x,
			y: this.absoluteY + this.height * this.scaleY * this.body.y,
			width: this.width * this.scaleX * this.body.width,
			height: this.height * this.scaleY * this.body.height
		}
	}

	// Геттер возвращает массив всех 4-х вершин.
	get tops () {
		// Прямоугольник
		const { x, y, width, height } = this.bodyRect

		return [
			[x, y], // верхняя левая точка
			[x + width, y], // верхняя правая точка
			[x, y + height], // нижняя левая точка
			[x + width, y + height], // нижняя правая точка
		]
	}

	/*
		Метод проверяет,
		находится ли точка с координатами x, y внутри тела или нет.
		Возвращает true если находится внутри, иначе возвращает false.
	*/
	isInside (x, y) {
		// Проверяем наличие точки x, y внутри прямоугольника this.bodyRect:
		return Util.isInside({ x, y }, this.bodyRect)
	}

	draw (canvas, context) {
		if (!this.visible) {
			return
		}

		context.save()
		context.translate(this.x, this.y)
		// - стоит для того чтобы вращение происходило против часовой стрелки
		context.rotate(-this.rotation)

		// context.scale(this.scaleX, this.scaleY)

		context.drawImage(
			// текстура, которую нужно отрисовать
			this.texture,
			/*
				source-координаты (координаты участка изображения,
				который нужно отобразить)
			*/
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
			this.width * this.scaleX,
			this.height * this.scaleY
		)

		// Если debug === true, то рисуем точку:
		if (this.debug) {
			// Прямоугольник
			const { x, y, width, height } = this.bodyRect

			context.fillStyle = 'rgba(255, 0, 0, 0.2)'
			// Отрисуем якорь:
		/*	context.beginPath()
			context.arc(0, 0, 3, 0, Math.PI * 2)
			context.fill()*/

			// Наложим красный цвет поверх спрайта:
			context.beginPath()
			context.rect(x - this.x, y - this.y, width, height)
			context.fill()

			context.fillStyle = 'rgb(0, 255, 0)'
			// Отрисуем якорь:
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