/*
	Класс Man в принципе то же, что и Body.
	Но есть параметры по умолчанию, которые можно изменить и дополнить извне.
	Отчасти класс следует паттерну "Фабрика".
*/

class Man extends GameEngine.Body {
	constructor (originalArgs = {}) {
		const args = Object.assign({
			scale: 3,
			anchorX: 0.5,
			anchorY: 0.5,
			debug: true,
			/*
				По параметрам body будем проверять столкновение 2-х объектов.
				Если красные поля пересеклись, значит объекты столкнулись.
			*/
			body: {
				x: 0,
				y: 0.5,
				width: 1,
				height: 0.5
			}
		}, originalArgs)

		super(Man.texture, args)

		this.setFramesCollection(Man.atlas.frames)
		this.setAnimationsCollection(Man.atlas.actions)
		this.startAnimation('stayDown')
	}
}

Man.texture = null
Man.atlas = null