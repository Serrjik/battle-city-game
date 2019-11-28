import { Util, Body } from '../engine'

/*
	Класс Bullet в принципе то же, что и Body.
	Но есть параметры по умолчанию, которые можно изменить и дополнить извне.
	Отчасти класс следует паттерну "Фабрика".
*/
export default class Bullet extends Body {
	constructor (originalArgs = {}) {
		const args = Object.assign({
			scale: 2,
			anchorX: 0.5,
			anchorY: 0.5,
			// debug: true,
			/*
				По параметрам body будем проверять столкновение 2-х объектов.
				Если красные поля пересеклись, значит объекты столкнулись.
			*/
			// body: {
			// 	x: 0,
			// 	y: 0,
			// 	width: 1,
			// 	height: 1
			// }
		}, originalArgs)

		super(Bullet.texture, args)

		this.tank = null // Какому танку принадлежит пуля.
		this.toDestroy = false // Флаг - нужно ли удалить конкретную пулю.

		this.setFramesCollection(Bullet.atlas.frames)
		this.setAnimationsCollection(Bullet.atlas.actions)

		this.on('collision', (a, b) => {
			// Если a - танк, который породил пулю:
			if (a === this.tank) {
				// Игнорировать столкновения со своим собственным танком.
				return
			}

			// Если пуля вражеская и попала во вражеский объект.
			if (a.isEnemy && blur.isEnemy) {
				return
			}

			// Иначе уничтожить пулю.
			// this.destroy()
			/*
				Возможно пуля удалит сама себя из танка,
				тогда событие столкновения танка просто не сработает.
				Поэтому нельзя удалять пулю до того, как произойдет другое событие.
				Установить флаг пуле, что её нужно удалить.
			*/
			this.toDestroy = true
		})
	}

	// Метод уничтожает пулю.
	destroy () {
		// Удалить пулю из массива пуль, принадлежащих танку.
		Util.removeElements(this.tank.bullets, this)

		// Удалить танк.
		delete this.tank

		// Получить сцену, в которой находится пуля.
		const scene = this.scene
		
		// Если пуля сталкивается с чем-то ещё, то должна уничтожить себя.
		scene.arcadePhysics.remove(this)
		scene.remove(this)
	}
}

Bullet.texture = null
Bullet.atlas = null

Bullet.NORMAL_SPEED = 5