import { Container, Body } from '../engine'

import { DEBUG_MODE } from './setting.json'

import Bullet from './Bullet'

// Topology - контейнер, который хранит в себе все элементы карты.
export default class Topology extends Container {
	constructor (args = {}) {
		super({})

		this.map = args.map || [[]]
		this.size = args.fieldSize || 20

		// Орёл.
		const [x, y] = this.getCoordinats('eagle', true)
		this.eagle = new Body(Topology.texture, {
			debug: DEBUG_MODE,
			static: true,
			x: x * this.size,
			y: y * this.size
		})

		this.eagle.setFramesCollection(Topology.atlas.frames)
		this.eagle.setFrameByKeys('eagle')

		this.eagle.width = this.size
		this.eagle.height = this.size

		this.add(this.eagle)

		// Пройти по всем кирпичам стен.
		for (const [x, y] of this.getCoordinats('brick')) {
			/*
				Создать экземпляр стены - 4 шт. заполняют 1 поле
				(тело участвует в столкновениях).
			*/
			for (let dx = 0; dx <= 1; dx++) {
				for (let dy = 0; dy <= 1; dy++) {
					const body = new Body(Topology.texture, {
						debug: DEBUG_MODE,
						static: true,
						anchorX: dx,
						anchorY: dy
					})

					body.setFramesCollection(Topology.atlas.frames)
					body.setFrameByKeys('wall', 'brick')

					// Ширина и высота кирпича стены.
					body.width = this.size / 2
					body.height = this.size / 2

					// Верхний левый угол кирпича будет иметь координаты:
					body.x = x * this.size + this.size / 2
					body.y = y * this.size + this.size / 2

					body.isBrick = true

					this.add(body)

					// Когда произойдет столкновение с неким объектом:
					body.on('collision', a => {
						// Если столкновение с пулей:
						if (a instanceof Bullet) {
							// Самоуничтожить кусок стены:
							this.remove(body)
							// Убрать этот кусок стены из аркадной физики:
							this.scene.arcadePhysics.remove(body)
						}
					})
				}
			}
		}
	}

	/*
		single значит - единственный элемент нужен, или много.
		false - нужно много, true - первый попавшийся.
	*/
	getCoordinats (type, single = false) {
		const results = []

		// Перебрать все поля карты.
		for (let y = 0; y < this.map.length; y++) {
			for (let x = 0; x < this.map[y].length; x++) {
				// Если тип такой, какой искали:
				if (this.map[y][x] === type) {
					if (single) {
						return [x, y]
					}
					results.push([x, y])
				}
			}
		}

		return results
	}
}

Topology.texture = null
Topology.atlas = null