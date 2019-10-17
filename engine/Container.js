// Класс Container хранит в себе список всех изображений, которые нужно отрисовать
;(function () {
	'use strict'

	class Container extends GameEngine.DisplayObject {
		constructor (args = {}) {
			/*
				super() вызывает конструктор родительского класса.
				Нужно ВСЕГДА вызывать в конструкторе.
			*/
			super(args)
			// объекты, которые нужно рисовать
			this.displayObjects = []
		}

		// Метод добавляет объекты в коллекцию
		add (displayObject) {
			// Если такого объекта ещё нет в коллекции, то добавить
			if (!this.displayObjects.includes(displayObject)) {
				this.displayObjects.push(displayObject)
			}
		}

		// Метод удаляет объекты из коллекции
		remove () {}

		/*
			Метод проходит по всем дочерним элементам класса
			и вызывает у них функцию draw()
		*/
		draw (canvas, context) {
			for (const displayObject of this.displayObjects) {
				displayObject.draw(canvas, context)
			}
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Container = Container
})();