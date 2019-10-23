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
				// console.log(event.code)
				switch (event.code) {
					case "KeyW":
						keyboard.arrowUp = true
						break

					case "KeyS":
						keyboard.arrowDown = true
						break
						
					case "KeyD":
						keyboard.arrowRight = true
						break
						
					case "KeyA":
						keyboard.arrowLeft = true
						break

					case "Space":
						keyboard.space = true
						break
				}
			})

			document.body.addEventListener('keyup', function (event) {
				// console.log(event.code)
				switch (event.code) {
					case "KeyW":
						keyboard.arrowUp = false
						break

					case "KeyS":
						keyboard.arrowDown = false
						break
						
					case "KeyD":
						keyboard.arrowRight = false
						break
						
					case "KeyA":
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