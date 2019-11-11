/*
	Класс Tank в принципе то же, что и Body.
	Но есть параметры по умолчанию, которые можно изменить и дополнить извне.
	Отчасти класс следует паттерну "Фабрика".
*/
class Tank extends GameEngine.Body {
	constructor (originalArgs = {}) {
		const args = Object.assign({
			scale: 3.5,
			// Ключи, которые автоматически будут подмешиваться в спрайт.
			keysDefault: ['yellow', 'type1'],
			debug: DEBUG_MODE
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

		// Если произошло столкновение с объектом a:
		this.on('collision', a => {
			// Если a - пуля, и она принадлежит этому танку:
			if (a instanceof Bullet) {
				// Если пуля a принадлежит этому танку:
				if (this.bullets.includes(a)) {
					// Игнорировать столкновения со своими собственными пулями.
					return
				}

				// Если пуля столкнулась не с породившим её танком:
				else {
					// Сделать этот танк невидимым:
					this.visible = false
					// Удалить этот танк из аркадной физики:
					this.scene.arcadePhysics.remove(this)
				}
			}

			this.velocity.x = 0
			this.velocity.y = 0
		})
	}

	movementUpdate (keyboard) {
		this.velocity.x = 0
		this.velocity.y = 0

		if (this.animationPaused) {
			this.resumeAnimation()
		}

		if (keyboard.arrowLeft) {
			this.velocity.x = -Tank.NORMAL_SPEED

			if (this.animation !== 'moveLeft') {
				this.startAnimation('moveLeft')
			}
		}

		else if (keyboard.arrowRight) {
			this.velocity.x = Tank.NORMAL_SPEED

			if (this.animation !== 'moveRight') {
				this.startAnimation('moveRight')
			}
		}

		else if (keyboard.arrowDown) {
			this.velocity.y = Tank.NORMAL_SPEED

			if (this.animation !== 'moveDown') {
				this.startAnimation('moveDown')
			}	
		}

		else if (keyboard.arrowUp) {
			this.velocity.y = -Tank.NORMAL_SPEED

			if (this.animation !== 'moveUp') {
				this.startAnimation('moveUp')
			}
		}

		else {
			this.pauseAnimation()
		}

		// Выстрел должен происходить не чаще, чем задано в BULLET_TIMEOUT.
		if (keyboard.space && Util.delay('tank' + this.uid, Tank.BULLET_TIMEOUT)) {
			// Создать пулю.
			const bullet = new Bullet({
				debug: DEBUG_MODE,
				x: this.centerX,
				y: this.centerY
			})

			// Добавить пулю в породивший её танк, чтобы танк запомнил пулю.
			this.bullets.push(bullet)
			// Добавить породивший пулю танк в эту же пулю, чтобы пуля запомнила танк.
			bullet.tank = this

			// Скорость пули рассчитывается в зависимости от анимации.
			if (this.animation === 'moveUp') {
				bullet.velocity.y = -Bullet.NORMAL_SPEED
				bullet.setFrameByKeys('bullet', 'up')
			}

			else if (this.animation === 'moveDown') {
				bullet.velocity.y = Bullet.NORMAL_SPEED
				bullet.setFrameByKeys('bullet', 'down')
			}

			else if (this.animation === 'moveLeft') {
				bullet.velocity.x = -Bullet.NORMAL_SPEED
				bullet.setFrameByKeys('bullet', 'left')
			}

			else if (this.animation === 'moveRight') {
				bullet.velocity.x = Bullet.NORMAL_SPEED
				bullet.setFrameByKeys('bullet', 'right')
			}

			// Добавить пулю в сцену.
			// const scene = Util.getScene(this)
			this.scene.add(bullet)
			// Добавить пулю в аркадную физику.
			this.scene.arcadePhysics.add(bullet)
		}
	}
}

Tank.texture = null
Tank.atlas = null

Tank.NORMAL_SPEED = 2
Tank.BULLET_TIMEOUT = 250 // Ограничение частоты выстрела танка в мс.