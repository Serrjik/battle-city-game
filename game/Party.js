import { Scene, Util, ArcadePhysics, Body } from '../engine'

import Bullet from './Bullet'
import EnemyTank from './EnemyTank'
import Topology from './Topology'
import Tank from './Tank'

// Party - сцена.
export default class Party extends Scene {
	constructor (args = {}) {
		super({
			name: 'party',
			...args
		})

		// Набор врагов.
		this.enemies = new Set
	}

	loading (loader) {
		loader.addImage('spriteSheet', 'static/Battle City Sprites.png')
		loader.addJson('atlas', 'static/atlas.json')
		loader.addJson('map', 'static/map1.json')
		loader.addJson('party', 'static/party.json')
	}

	init () {
		const { loader, renderer: { canvas: { width, height } } } = this.parent

		// К моменту старта инициализовать все ресурсы:
		// Получить текстуру пули, карты, танка:
		Bullet.texture = Topology.texture = Tank.texture = loader.getImage('spriteSheet')
		// Поличить атлас:
		Bullet.atlas = Topology.atlas = Tank.atlas = loader.getJson('atlas')

		this.partyData = loader.getJson('party')

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new ArcadePhysics

		/*
			Нарисовать невидимые стены (тела (Body) без текстур)
			по периметру игрового поля,
			но добавить их в аркаду,
			чтобы был невозможен выход за пределы игрового поля.
		*/
		// Стена сверху.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: -10,
			width: width + 20,
			// Высота такая, чтобы боты не застревали в стене.
			height: 9
		}))

		// Стена снизу.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: height,
			width: width + 20,
			height: 9
		}))

		// Стена слева.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: -10,
			width: 9,
			height: height + 20
		}))

		// Стена справа.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: width,
			y: -10,
			width: 9,
			height: height + 20
		}))

		// Получить элементы карты.
		this.topology = new Topology(loader.getJson('map'))
		this.add(this.topology)

		this.arcadePhysics.add(...this.topology.displayObjects)

		// Координаты места, в котором должен появиться танк.
		const [x, y] = this.topology.getCoordinats('tank1', true)
		// К этому моменту у танка уже есть текстура и атлас.
		this.mainTank = new Tank({
			x: x * this.topology.size,
			y: y * this.topology.size
		})
		this.add(this.mainTank)
		// Добавить танк в аркадную физику:
		this.arcadePhysics.add(this.mainTank)

		// Если орёл столкнулся с чем-то:
		if (this.topology.eagle) {
			this.topology.eagle.on('collision', a => {
				if (a instanceof Bullet) {
					this.game.startScene('resultScene')
					this.game.finishScene(this)
				}
			})
		}
	}

	update () {
		// Экспортировать клавиатуру из игры.
		const { keyboard } = this.parent
		// Массив танков противника для перенаправления движения.
		// const enemyTankForRedirect = []

		this.mainTank.movementUpdate(keyboard)

		// Перебрать вообще все танки противника.
		for (const enemyTank of this.enemies) {
			// Если танк был удалён:
			if (!this.displayObjects.includes(enemyTank)) {
				// Удалить танк из врагов.
				this.enemies.delete(enemyTank)
				continue
			}

			// Если у танка противника уже есть следующее направление:
			if (enemyTank.nextDirect) {
				// Перенаправить танк противника.
				enemyTank.setDirect(enemyTank.nextDirect)
				// И убрать следующее направление движения у этого танка.
				enemyTank.nextDirect = null
			}

			// Чтобы танки противника стреляли.
			if (Util.delay(enemyTank.uid + 'fired', Tank.BULLET_TIMEOUT)) {
				// Запомнить пулю, выпущенную танком.
				const bullet = enemyTank.fire()
				/*
					Флаг isEnemy означает, что пуля принадлежит
					какому-то из вражеских танков.
				*/
				bullet.isEnemy = true
			}

			// Задать танку врага новое направление.
			// enemyTank.direct = Util.getRandomFrom('up', 'left', 'right', 'down')
		}

		this.arcadePhysics.processing()

		// Генерация танков-ботов:
		/*
			Если на текущий момент количество врагов меньше, чем должно быть,
			и с момента генерации последнего врага прошло времени больше,
			чем spawnDelay.
		*/
		if (
			this.enemies.size < this.partyData.enemy.simultaneously
			&& Util.delay(this.uid + 'enemyGeneration', this.partyData.enemy.spawnDelay)
		) { // Генерировать новый танк!
			// Где будет располагаться танк противника.
			const [x, y] = Util.getRandomFrom(...this.topology.getCoordinats('enemy'))

			// Создание танка противника.
			const enemyTank = new EnemyTank({
				x: x * this.topology.size,
				y: y * this.topology.size
			})

			/*
				Флаг isEnemy означает, что пуля принадлежит
				какому-то из вражеских танков.
			*/
			enemyTank.isEnemy = true

			// Добавить танк противника в игровой мир.
			this.enemies.add(enemyTank)
			// Добавить танк противника в отрисовку.
			this.add(enemyTank)
			// Добавить танк противника в аркадную физику.
			this.arcadePhysics.add(enemyTank)

			// Установить первоначальное направление движения танка противника.
			enemyTank.setDirect('down')

			// enemyTank.on('collision', () => {
			// 	console.log('fired')
			// })

		}

		for (const enemyTank of this.enemies) {
			// console.log(enemyTank.direct)
			// enemyTank.setDirect(enemyTank.direct)
		}

		for (const object of this.arcadePhysics.objects) {
			// Если это пуля и её нужно уничтожить:
			if (object instanceof Bullet && object.toDestroy) {
				// Уничтожить пулю.
				object.destroy()
			}
		}
	}
}