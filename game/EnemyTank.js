class EnemyTank extends Tank {
	constructor (originalArgs = {}) {
		super({
			// Ключи, которые автоматически будут подмешиваться в спрайт.
			keysDefault: ['gray', 'type1'],
			...originalArgs
		})
	}

	collisionHandler (a, b) {
		// Если a - пуля, и она принадлежит этому танку:
		if (a instanceof Bullet) {
			// Если пуля a принадлежит этому танку:
			if (this.bullets.includes(a)) {
				// Игнорировать столкновения со своими собственными пулями.
				return
			}

			// Если пуля принадлежит другому вражескому танку:
			else if (a.isEnemy) {
				// Игнорировать столкновения с пулями других вражеских танков.
				return
			}

			// Если пуля столкнулась не с породившим её танком:
			else {
				// Уничтожить танк - последовательные шаги.
				// Удалить этот танк из аркадной физики:
				this.scene.arcadePhysics.remove(this)
				// Удалить этот танк из сцены:
				this.scene.remove(this)
				// Сделать этот танк невидимым:
				// this.visible = false
			}
		}

		this.velocity.x = 0
		this.velocity.y = 0
		// Задать случайным образом направление движения этого танка.
		this.nextDirect = Util.getRandomFrom('up', 'left', 'right', 'down')

	}
}