/*
	Экземпляр класса DisplayObject содержит объект, который нужно отобразить
	(sprite, animation sprite, контейнер, и любая сущность, которую нужно отрисовать).
*/
;(function () {
	'use strict'

	class DisplayObject {
		constructor (args = {}) {
			// координаты содержащегося объекта
			this.x = args.x || 0
			this.y = args.y || 0
			// ширина и высота содержащегося объекта
			this.width = args.width || 0
			this.height = args.height || 0
			// на сколько нужно повернуть содержащийся объект
			this.rotation = args.rotation || 0
			/*
				Anchor содержащегося объекта (показывает, какую часть изображения в процентах нужно взять,
				чтобы получить настоящий центр изображения).
				Изначально центр изображения находится в его левом верхнем углу (координаты 0, 0).
			*/
			this.anchorX = args.anchorX || 0
			this.anchorY = args.anchorY || 0
			// Масштаб по оси X
			this.scaleX = args.scaleX || 1
			// Масштаб по оси Y
			this.scaleY = args.scaleY || 1

			if (args.scale !== undefined ) {
				this.setScale(args.scale)
			}
		}

		// Геттер - координата X левого верхнего угла
		get absoluteX () {
			return this.x - this.anchorX * this.width
		}

		// Сеттер - координата X левого верхнего угла
		set absoluteX (value) {
			this.x = value + this.anchorX * this.width
			return value
		}

		// Геттер - координата Y левого верхнего угла
		get absoluteY () {
			return this.y - this.anchorY * this.height
		}

		// Сеттер - координата Y левого верхнего угла
		set absoluteY (value) {
			this.y = value + this.anchorY * this.height
			return value
		}

		// Метод задает значение 2 полям (масштабы по осям X, Y)
		setScale (scale) {
			this.scaleX = scale
			this.scaleY = scale
		}

		/*
			Так как есть множество вариантов отрисовки различных объектов,
			метод draw() будет пустым и будет переопределяться для дочерних объектов.
		*/
		draw () {}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.DisplayObject = DisplayObject
})();
