/*
	Класс Tank в принципе то же, что и Body.
	Но есть параметры по умолчанию, которые можно изменить и дополнить извне.
	Отчасти класс следует паттерну "Фабрика".
*/
class Tank extends GameEngine.Body {
	constructor (originalArgs = {}) {
		const args = Object.assign({
			scale: 4,
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

		super(Tank.texture, args)

		this.bullets = [] // Массив пуль.

		this.setFramesCollection(Tank.atlas.frames)
		this.setAnimationsCollection(Tank.atlas.actions)
		// С какого спрайта начать анимацию.
		this.startAnimation('moveUp')

		this.on('collision', (a, b) => {
			// Если b - пуля, и она принадлежит этому танку:
			if (b instanceof Bullet) {
				// Если пуля b принадлежит этому танку:
				if (this.bullets.includes(b)) {
					// Игнорировать столкновения со своими собственными пулями.
					return
				}

				// Если пуля столкнулась не с породившим её танком:
				else {
					// Сделать этот танк невидимым:
					this.visible = false
					// Удалить этот танк из аркадной физики:
					Util.getScene(this).arcadePhysics.remove(this)
				}
			}

			a.velocity.x = 0
			a.velocity.y = 0
		})
	}

	movementUpdate (keyboard) {
		this.velocity.x = 0
		this.velocity.y = 0

		if (keyboard.arrowLeft) {
			this.velocity.x = -Tank.NORMAL_SPEED
		}

		else if (keyboard.arrowRight) {
			this.velocity.x = Tank.NORMAL_SPEED
		}

		else if (keyboard.arrowDown) {
			this.velocity.y = Tank.NORMAL_SPEED
		}

		else if (keyboard.arrowUp) {
			this.velocity.y = -Tank.NORMAL_SPEED
		}
	}
}

Tank.texture = null
Tank.atlas = null

Tank.NORMAL_SPEED = 2
Tank.BULLET_TIMEOUT = 1000 // Ограничение частоты выстрела танка в мс.