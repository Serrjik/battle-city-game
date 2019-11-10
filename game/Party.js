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
		const { loader } = this.parent

		// К моменту старта инициализовать все ресурсы:
		// Получить текстуру пули, карты, танка:
		Bullet.texture = Topology.texture = Tank.texture = loader.getImage('spriteSheet')
		// Поличить атлас:
		Bullet.atlas = Topology.atlas = Tank.atlas = loader.getJson('atlas')

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new GameEngine.ArcadePhysics

		// Получить элементы карты.
		this.topology = new Topology(loader.getJson('map'))
		this.add(this.topology)

		// К этому моменту у танка уже есть текстура и атлас.
		this.mainTank = new Tank()
		this.add(this.mainTank)
		// Добавить танк в аркадную физику:
		this.arcadePhysics.add(this.mainTank)
	}

	update () {
		// Экспортировать клавиатуру из игры.
		const { keyboard } = this.parent
		this.mainTank.movementUpdate(keyboard)
	}
}