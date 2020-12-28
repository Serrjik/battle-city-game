import { Scene, Sprite, Util } from '../engine'

// Intro - стартовая сцена.
export default class Intro extends Scene {
	constructor (args = {}) {
		super({
			name: 'homeScene',
			...args
		})
	}

	loading (loader) {
		loader.addImage('home', 'static/home.jpg')
	}

	init () {
		const { loader } = this.parent

		// Запросить ресурс и добавить в сцену.
		this.image = new Sprite(loader.getImage('home'), {
			x: 0,
			y: this.parent.renderer.canvas.height,
			width: this.parent.renderer.canvas.width,
			height: this.parent.renderer.canvas.height
		})

		this.add(this.image)

		this.imageTweenStopper = Util.tween({
			// target должен изменить своё поле y за время duration.
			target: this.image,
			duration: 0.1,
			/*
				processer - функция,
				которая вызывается в течение времени duration.
			*/
			processer (target, percent, context) {
				if (percent === 0) {
					context.y = target.y
				}
				target.y = context.y * (1 - percent)
			}
		})
	}

	update (timestamp) {
		const { keyboard } = this.parent

		// Добавить задержку перед переходом к следующей сцене:
		if (keyboard.space) {
			delete this.imageTweenStopper
			this.parent.startScene('introScene')
			this.parent.finishScene(this)
		}
	}
}