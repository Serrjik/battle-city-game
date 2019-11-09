// Intro - стартовая сцена.
class Intro extends GameEngine.Scene {
	constructor (args = {}) {
		super({
			name: 'introScene',
			...args
		})
	}

	loading (loader) {
		loader.addImage('intro', 'static/intro.png')
		// loader.addSound('intro', 'static/sound/stage_start.ogg')
	}

	init () {
		const { loader } = this.parent

		// Запросить ресурс и добавить в сцену.
		this.image = new Sprite(loader.getImage('intro'), {
			x: 0,
			y: this.parent.renderer.canvas.height,
			width: this.parent.renderer.canvas.width,
			height: this.parent.renderer.canvas.height
		})

		this.add(this.image)

		this.imageTweenStopper = Util.tween({
			// target должен изменить своё поле y за время duration.
			target: this.image,
			duration: 3500,
			// processer - функция, которая будет вызываться в течение времени duration.
			processer (target, percent, context) {
				if (percent === 0) {
					// Запустить проигрывание звука.
					// loader.getSound('intro').play()
					context.y = target.y
				}
				target.y = context.y * (1 - percent)
			}
			/*fields: {
				y: 0,
				x: {
					finish: 100,
					duration: 1000
				}
			}*/
		})
	}

	update (timestamp) {
		const { keyboard } = this.parent

		// Добавить задержку перед переходом к следующей сцене:
		if (keyboard.space && Util.delay('introSpace', 1500)) {
			// По нажатию space картинка мгновенно станет на место.
			if (this.imageTweenStopper && this.image.y !== 0) {
				this.imageTweenStopper()
				delete this.imageTweenStopper
				this.image.y = 0
			}

			else {
				this.parent.startScene('party')
				this.parent.finishScene(this)
			}
		}
	}
}