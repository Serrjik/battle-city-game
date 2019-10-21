// Модуль следит за нажатиями клавиш.
;(function () {
	'use strict'

	class Keyboard {
		constructor () {
			// Так написано, потому что ниже обращение просто по this не работает.
			const keyboard = this

			// false - непрожаты, true - прожаты
			this.arrowUp = false
			this.arrowDown = false
			this.arrowLeft = false
			this.arrowRight = false
			this.space = false

			document.body.addEventListener('keydown', function (event) {
				console.log(event.code)
				switch (event.code) {
					case "ArrowUp":
						keyboard.arrowUp = true
						break

					case "ArrowDown":
						keyboard.arrowDown = true
						break
						
					case "ArrowRight":
						keyboard.arrowRight = true
						break
						
					case "ArrowLeft":
						keyboard.arrowLeft = true
						break

					case "Space":
						keyboard.space = true
						break
				}
			})

			document.body.addEventListener('keyup', function (event) {
				console.log(event.code)
				switch (event.code) {
					case "ArrowUp":
						keyboard.arrowUp = false
						break

					case "ArrowDown":
						keyboard.arrowDown = false
						break
						
					case "ArrowRight":
						keyboard.arrowRight = false
						break
						
					case "ArrowLeft":
						keyboard.arrowLeft = false
						break
						
					case "Space":
						keyboard.space = false
						break
				}
			})
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Keyboard = Keyboard
})();