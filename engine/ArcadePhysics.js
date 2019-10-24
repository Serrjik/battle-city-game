/*
	Модуль проверяет, где находится объект, куда он должен двигаться,
	сталкивается ли с другим телом.
	Если сталкивается, то он должен произвести событие столкновения других объектов.
*/
;(function () {
	'use strict'

	class ArcadePhysics {
		constructor () {
			/*
				Set - коллекция (тип данных похожий на массив,
				но в нем не может быть одинаковых элементов).
			*/
			this.objects = new Set
		}

		// Метод передает, какие именно объекты будут участвовать в аркадной физике.
		add (...objects) { // objects - Display Objects
			for (const object of objects) {
				this.objects.add(object)
			}
		}

		// Метод удаляет объекты из участия в аркадной физике.
		remove (...objects) { // objects - Display Objects
			for (const object of objects) {
				this.objects.delete(object)
			}
		}

		// Метод проверяет столкновения.
		processing () {
			/*
				Нужно перебрать все возможные комбинации пар у всех объектов,
				которые есть в аркадной физике.
			*/
			// Преобразовать коллекцию объектов в массив.
			const objects = Array.from(this.objects)

			// Пройти по всем возможным парам.
			for (let i = 0; i < objects.length - 1; i++) {
				// j = i + 1 чтобы не проверять комбинацию пар дважды.
				for (let j = i + 1; j < objects.length; j++) {
					// Здесь все возможные комбинации пар:
					const a = objects[i]
					const b = objects[j]

					/*
						Чтобы понять, сталкиваются ли 2 тела, нужно понять,
						попадает ли одна из точек вершин одного тела внутрь другого тела.
					*/
				}
			}
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.ArcadePhysics = ArcadePhysics
})();