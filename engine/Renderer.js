;(function () {
	'use strict'

	class Renderer {
		// В конструкторе создаём канвас и его контекст
		// По умолчанию аргументом будет пустой объект
		constructor (args = {}) {
			this.canvas = document.createElement('canvas')
			this.context = this.canvas.getContext('2d')

			// Удобный синтаксис для задания значений по умолчанию
			this.background = args.background || 'black'
			this.canvas.width = args.width || 50
			this.canvas.height = args.height || 50
			this.update = args.update || (() => {})

			// Регистрация функции, которая постоянно вызывается,
			// чтобы обновлять изображение на канвасе
			requestAnimationFrame(timestamp => this.tick(timestamp))
		}

		tick (timestamp) {
			this.clear()
			
			this.update(timestamp)

			requestAnimationFrame(timestamp => this.tick(timestamp))
		}

		// Метод рисует картинку
		draw (callback) {
			callback(this.canvas, this.context)
		}

		clear () {
			this.draw((canvas, context) => {
				context.fillStyle = this.background
				context.beginPath()
				context.rect(0, 0, canvas.width, canvas.height)
				context.fill()
			})
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Renderer = Renderer
})();