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
	}

	init () {
		const { loader } = this.parent

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new GameEngine.ArcadePhysics

		// К моменту старта инициализовать все ресурсы:
		// Получить текстуру танка:
		Tank.texture = loader.getImage('spriteSheet')
		// Поличить атлас:
		console.log(Tank.atlas = loader.getJson('atlas'))

		// Получить текстуру пули:
		Bullet.texture = loader.getImage('spriteSheet')
		// Поличить атлас:
		Bullet.atlas = loader.getJson('atlas')

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