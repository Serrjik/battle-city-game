// Модуль отрисовывает
export default class Renderer {
	/*
		В конструкторе создаём канвас и его контекст.
		По умолчанию аргументом будет пустой объект.
	*/
	constructor (args = {}) {
		this.canvas = document.createElement('canvas')
		this.context = this.canvas.getContext('2d')

		// Удобный синтаксис для задания значений по умолчанию.
		this.background = args.background || 'black'
		this.canvas.width = args.width || 50
		this.canvas.height = args.height || 50
	}

	// Метод рисует картинку.
	draw (callback) {
		callback(this.canvas, this.context)
	}

	clear () {
		this.context.fillStyle = this.background
		this.context.beginPath()
		this.context.rect(0, 0, this.canvas.width, this.canvas.height)
		this.context.fill()
	}
}