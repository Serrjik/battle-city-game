// Topology - контейнер, который хранит в себе все элементы карты.
class Topology extends GameEngine.Container {
	constructor (args = {}) {
		super({})

		this.map = args.map || [[]]
		this.size = args.fieldSize || 20

		// Перебрать все поля карты.
		for (let y = 0; y < this.map.length; y++) {
			for (let x = 0; x < this.map[y].length; x++) {
				const field = this.map[y][x]

				// Если поле пустое, ничего не делать.
				if (!field) {
					continue
				}
				// Если в поле Стена:
				if (field === 'brick') {
					/*
						Создать экземпляр стены - 4 шт. заполняют 1 поле
						(тело участвует в столкновениях).
					*/
					for (let dx = 0; dx <= 1; dx++) {
						for (let dy = 0; dy <= 1; dy++) {
							const body = new GameEngine.Body(Topology.texture, {
								debug: DEBUG_MODE,
								static: true,
								anchorX: dx,
								anchorY: dy
							})

							body.setFramesCollection(Topology.atlas.frames)
							body.setFrameByKeys('wall', 'brick')

							body.width = this.size / 2
							body.height = this.size / 2

							// Верхний левый угол будет иметь координаты:
							body.x = x * this.size
							body.y = y * this.size
console.log({ x, y })
							this.add(body)
						}
					}
				}
			}
		}
	}
}

Topology.texture = null
Topology.atlas = null