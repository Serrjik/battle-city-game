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
				const a = objects[i]
				const bodyA = a.bodyRect
				// Все вершины объекта.
				const topsA = a.tops
				// Будем рассматривать, попадает ли точка в фигуру именно после передвижения (важна скорость).
				const vxA = a.velocity.x
				const vyA = a.velocity.y

				// Здесь проверим все возможные комбинации пар:
				// j = i + 1 чтобы не проверять комбинацию пар дважды.
				for (let j = i + 1; j < objects.length; j++) {
					const b = objects[j]
					const bodyB = b.bodyRect
					// Все вершины объекта.
					const topsB = b.tops
					// Будем рассматривать, попадает ли точка в фигуру именно после передвижения (важна скорость).
					const vxB = b.velocity.x
					const vyB = b.velocity.y

					/*
						Чтобы понять, сталкиваются ли 2 тела, нужно понять,
						попадает ли одна из точек вершин одного тела внутрь другого тела
						после передвижения.
					*/
					// let flag = false // По умолчанию не сталкиваются - false.

					let crossing = false

					/*
						Здесь проверяется, находится ли точка вершины прямоугольника A после перемещения
						внутри прямоугольника B после его перемещения.
					*/
					for (const topA of topsA) {
						crossing = GameEngine.Util.isInside(
							{
								x: topA[0] + vxA,
								y: topA[1] + vyA
							},
							{
								x: bodyB.x + vxB,
								y: bodyB.y + vyB,
								width: bodyB.width,
								height: bodyB.height
							}
						)

						/*
							Если точка вершины прямоугольника A после перемещения
							находится внутри прямоугольника B после его перемещения:
						*/
						if (crossing) {
							break
						}
					}

					/*
						Если пересечение ещё не было найдено,
						делаем тоже самое, что и выше, только относительно вершины B
						(симметричная проверка).
					*/
					if (crossing === false) {
						/*
							Здесь проверяется, находится ли точка вершины прямоугольника B после перемещения
							внутри прямоугольника A после его перемещения.
						*/
						for (const topB of topsB) {
							crossing = GameEngine.Util.isInside(
								{
									x: topB[0] + vxB,
									y: topB[1] + vyB
								},
								{
									x: bodyA.x + vxA,
									y: bodyA.y + vyA,
									width: bodyA.width,
									height: bodyA.height
								}
							)

							/*
								Если точка вершины прямоугольника B после перемещения
								находится внутри прямоугольника A после его перемещения:
							*/
							if (crossing) {
								break
							}
						}
					}

					// Если пересечение обнаружено:
					if (crossing) {
						/*
							Передаем в каждый объект событие, сам этот элемент,
							и тот элемент, с которым он столкнулся.
						*/
						a.emit('collision', a, b)
						b.emit('collision', b, a)
					}
				}
			}
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.ArcadePhysics = ArcadePhysics
})();