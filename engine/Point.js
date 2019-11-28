import DisplayObject from './DisplayObject'

/*
	Модуль будет рисовать точку, которую можно закрасить.
	В этом модуле переопределяется метод draw() родителя.
*/
export default class Point extends DisplayObject {
	constructor (args = {}) {
		super(args)

		this.color = args.color || 'red'
	}

	draw (canvas, context) {
		super.draw(() => {
			context.fillStyle = this.color
			context.beginPath()
			context.arc(this.x, this.y, 3, 0, Math.PI * 2)
			context.fill()
		})
	}
}