/*
	Модуль будет рисовать линию, которую можно закрасить.
	В этом модуле переопределяется метод draw() родителя.
*/
;(function () {
	'use strict'

	// Линия будет рисоваться между 2-мя точками:
	class Line extends GameEngine.DisplayObject {
		constructor (args = {}) {
			super(args)

			this.color = args.color || 'red'
			this.x1 = args.x1 || 0
			this.y1 = args.y1 || 0
			this.x2 = args.x2 || 0
			this.y2 = args.y2 || 0
		}
 
		draw (canvas, context) {
			super.draw(() => {
				context.strokeStyle = this.color
				context.lineWidth = 1

				context.beginPath()
				context.moveTo(this.x1, this.y1)
				context.lineTo(this.x2, this.y2)
				context.stroke()
			})
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Line = Line
})();