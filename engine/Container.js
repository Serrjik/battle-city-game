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
			/*
				Ширина и длина для контейнера не нужны - удалим их.
				Хотя так делать не положено, но мы сделали, потому что есть возможность.
			*/
			delete this.width
			delete this.height
		}

		// Метод добавляет объекты в коллекцию
		add (...displayObjects) {
			for (const displayObject of displayObjects) {
				// Если такого объекта ещё нет в коллекции, то добавить
				if (!this.displayObjects.includes(displayObject)) {
					this.displayObjects.push(displayObject)
					displayObject.setParent(this)
				}
			}
		}

		// Метод удаляет объекты из коллекции
		remove (...displayObjects) {
			for (const displayObject of displayObjects) {
				// Если такого объекта уже есть в коллекции, то удалить его
				if (this.displayObjects.includes(displayObject)) {
					const index = this.displayObjects.indexOf(displayObject)
					this.displayObjects.splice(index, 1)
					displayObject.setParent(null)
				}
			}
		}

		/*
			Метод проходит по всем дочерним элементам класса
			и вызывает у них функцию draw()
		*/
		draw (canvas, context) {
			/*
				Если объект видимый (visible === true),
				то сработает эта функция и объект отрисуется
			*/
			super.draw(() => {
				context.save()
				/*
					translate() переназначает начало системы координат.
					Изначально верхний левый угол имеет координаты 0, 0,
					но можно сделать так, что он будет иметь другие координаты.
				*/
				context.translate(this.x, this.y)
				/*
					Rotates the canvas clockwise around the current origin
					by the angle number of radians.
				*/
				// - стоит для того чтобы вращение происходило против часовой стрелки
				context.rotate(-this.rotation)
				/*
					Scales the canvas units by x horizontally and by y vertically.
					Both parameters are real numbers.
					Values that are smaller than 1.0 reduce the unit size
					and values above 1.0 increase the unit size.
					Values of 1.0 leave the units the same size.
				*/
				context.scale(this.scaleX, this.scaleY)

				for (const displayObject of this.displayObjects) {
					displayObject.draw(canvas, context)
				}

				context.restore()
			})
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Container = Container
})();