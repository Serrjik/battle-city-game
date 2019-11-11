// Party - сцена.
class Party extends GameEngine.Scene {
	constructor (args = {}) {
		super({
			name: 'party',
			...args
		})
	}

	loading (loader) {
		loader.addImage('spriteSheet', 'static/Battle City Sprites.png')
		loader.addJson('atlas', 'static/atlas.json')
		loader.addJson('map', 'static/map1.json')
	}

	init () {
		const { loader, renderer: { canvas: { width, height } } } = this.parent

		// К моменту старта инициализовать все ресурсы:
		// Получить текстуру пули, карты, танка:
		Bullet.texture = Topology.texture = Tank.texture = loader.getImage('spriteSheet')
		// Поличить атлас:
		Bullet.atlas = Topology.atlas = Tank.atlas = loader.getJson('atlas')

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new GameEngine.ArcadePhysics

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
			height: 10
		}))

		// Стена снизу.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: height,
			width: width + 20,
			height: 10
		}))

		// Стена слева.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: -10,
			width: 10,
			height: height + 20
		}))

		// Стена справа.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: width,
			y: -10,
			width: 10,
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
		this.mainTank.movementUpdate(keyboard)

		this.arcadePhysics.processing()

		for (const object of this.arcadePhysics.objects) {
			// Если это пуля и её нужно уничтожить:
			if (object instanceof Bullet && object.toDestroy) {
				// Уничтожить пулю.
				object.destroy()
			}

		}
	}
}