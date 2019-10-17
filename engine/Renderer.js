// Модуль отрисовывает

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

			// Создать экземпляр контейнера (stage)
			this.stage = new GameEngine.Container()

			// Регистрация функции, которая постоянно вызывается,
			// чтобы обновлять изображение на канвасе
			requestAnimationFrame(timestamp => this.tick(timestamp))
		}

		// Геттер возвращает все displayObjects контейнер со спрайтами всех вложенных контейнеров
		get displayObjects () {
			return _getDisplayObjects(this.stage)

			function _getDisplayObjects (container, result = []) {
				for (const displayObject of container.displayObjects) {
					if (displayObject instanceof GameEngine.Container) {
						_getDisplayObjects(displayObject, result)
					}

					else {
						result.push(displayObject)
					}
				}

				return result
			}
		}

		tick (timestamp) {
			this.update(timestamp)
			this.clear()
			this.render()

			requestAnimationFrame(timestamp => this.tick(timestamp))
		}

		/*
			Метод вызывает метод draw() с нужными параметрами.
			Инициирует отрисовку, но сам ей не занимается.
		*/
		render () {
			this.stage.draw(this.canvas, this.context)
		}

		// Метод рисует картинку
		draw (callback) {
			callback(this.canvas, this.context)
		}

		clear () {
			// this.draw((canvas, context) => {
				this.context.fillStyle = this.background
				this.context.beginPath()
				this.context.rect(0, 0, this.canvas.width, this.canvas.height)
				this.context.fill()
			// })
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Renderer = Renderer
})();