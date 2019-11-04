/*
	Вытаскивание Loader, Renderer и Sprite из GameEngine,
	чтобы не писать каждый раз перед Loader'ом - GameEngine (деструктуризация).
	Не нужно будет писать GameEngine.Loader
*/
const DEBUG_MODE = true

const { Body, Game, Scene, ArcadePhysics, Util, Sprite } = GameEngine

// Создание сцены:
const mainScene = new Scene({
	// Имя сцены:
	name: 'mainScene',
	// Автоматически стартовать сцену:
	// autoStart: true,
	/*
		Функции loading(), init(), update() будут вызываться в контексте экземпляра класса Scene.
		Потому что в конструкторе значение параметра функции присваивается вместе с bind(this).
	*/
	/*
		Функция вызывается, чтобы добавить ресурсы,
		которые понадобятся в дальнейшем (будут использованы в сцене).
	*/
	loading (loader) {
		loader.addImage('spriteSheet', 'static/Battle City Sprites.png')
		loader.addJson('atlas', 'static/atlas.json')
		// loader.addSound('start', 'static/sound/stage_start.ogg')
	},

	/*
		Функция вызывается единожды после того, как будут загружены ресурсы сцены.
		Инициализирует сцену (создает объекты, спрайты, рисунки, тексты -
		всё, что нужно будет использовать в дальнейшем).
	*/

	init () {
		// Получить аудио:
		// const startSound = this.parent.loader.getSound('start')
		// console.log({ startSound })
		// Запустить проигрывание звука.
		// startSound.play().then().catch(error => {})
		// game.loader.resources.sounds.start.play()

		// Получить текстуру:
		Tank.texture = this.parent.loader.getImage('spriteSheet')
		// Поличить атлас:
		Tank.atlas = this.parent.loader.getJson('atlas')

		// Получить текстуру:
		Bullet.texture = this.parent.loader.getImage('spriteSheet')
		// Поличить атлас:
		Bullet.atlas = this.parent.loader.getJson('atlas')

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new ArcadePhysics

		// Создать спрайт (пока будет не отрисован):
		this.tank1 = new Tank({
			debug: DEBUG_MODE,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2 + 100
		})

		this.tank2 = new Tank({
			debug: DEBUG_MODE,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2
		})

		/*
			Добавить спрайт в сцену (теперь он отрисуется), точку и линию:
			Имеет значение порядок подключения
			(то, что подключено позже, отрисуется позже
			и закроет собой отрисованное ранее).
			Важна очередность.
			Сначала рисуется контейнер, затем отрисовываются
			первый дочерний элемент, второй и т.д.
			Затем отрисовывается следующий контейнер с элементами и т.д.
		*/
		this.add(this.tank1, this.tank2)
		// Добавить объект в аркаду (теперь к нему применится аркадная физика).
		this.arcadePhysics.add(this.tank1, this.tank2)

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
			width: this.parent.renderer.canvas.width + 20,
			height: 10
		}))

		// Стена снизу.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: this.parent.renderer.canvas.height,
			width: this.parent.renderer.canvas.width + 20,
			height: 10
		}))

		// Стена слева.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: -10,
			y: -10,
			width: 10,
			height: this.parent.renderer.canvas.height + 20
		}))

		// Стена справа.
		this.arcadePhysics.add(new Body(null, {
			static: true,
			x: this.parent.renderer.canvas.width,
			y: -10,
			width: 10,
			height: this.parent.renderer.canvas.height + 20
		}))
	},

	// init () {
	// 	// Получить текстуру:
	// 	Man.texture = this.parent.loader.getImage('man')
	// 	Man.atlas = this.parent.loader.getJson('manAtlas')

	// 	// Аркада будет на уровне сцены.
	// 	this.arcadePhysics = new ArcadePhysics

	// 	// Создать спрайт (пока будет не отрисован):
	// 	this.man1 = new Man({
	// 		x: this.parent.renderer.canvas.width / 2 - 100,
	// 		y: this.parent.renderer.canvas.height / 2
	// 	})

	// 	this.man2 = new Man({
	// 		x: this.parent.renderer.canvas.width / 2 + 100,
	// 		y: this.parent.renderer.canvas.height / 2
	// 	})

	// 	/*
	// 		Добавить спрайт в сцену (теперь он отрисуется), точку и линию:
	// 		Имеет значение порядок подключения
	// 		(то, что подключено позже, отрисуется позже
	// 		и закроет собой отрисованное ранее).
	// 		Важна очередность.
	// 		Сначала рисуется контейнер, затем отрисовываются
	// 		первый дочерний элемент, второй и т.д.
	// 		Затем отрисовывается следующий контейнер с элементами и т.д.
	// 	*/
	// 	this.add(this.man1, this.man2)
	// 	// Добавить объекты в аркаду (теперь к ним применится аркадная физика).
	// 	this.arcadePhysics.add(this.man1, this.man2)

	// 	// Подписаться на событие frameChange. this будет генерировать это событие.
	// 	/*this.man.on('frameChange', man => {
	// 		console.log('frameChange')
	// 	})*/

	// 	// this.man.setFrameByKeys('man', 'down', 'frame1')
	// 	// this.man.width = this.man.frame.width
	// 	// this.man.height = this.man.frame.height

	// 	/*
	// 		Если точка всегда будет на этой позиции, this можно не писать.
	// 		Задать через const.
	// 		Зато будет сложно достучаться до неё из update().
	// 	*/
	// 	/*const point = new Point({
	// 		// Установим координаты как у спрайта:
	// 		x: this.til.x,
	// 		y: this.til.y
	// 	})*/

	// 	/*
	// 		Если линия всегда будет на этой позиции, this можно не писать.
	// 		Задать через const.
	// 		Зато будет сложно достучаться до неё из update().
	// 	*/
	// 	/*const line = new Line({
	// 		x1: 0,
	// 		y1: 0,
	// 		x2: this.parent.renderer.canvas.width,
	// 		y2: this.parent.renderer.canvas.height
	// 	})*/

	// 	// graphicContainer.add(point, line)
	// },

	/*
		Функция будет вызываться перед удалением сцены
		Если в функции init() подпишемся на события
		(мыши, клавиатуры - в обход Keyboard'a, от сервера, сокеты),
		эти зависимости (все, что создали в init() ) нужно будет удалить,
		чтобы не занимать память. Пока сцена слушает события,
		сборщик мусора не сможет её удалить.
	*/
	// beforeDestroy () {
		/*
			Эта функция описана в объекте Scene.
			Однако если в функции init() мы подписываемся на канал,
			от которого нужно явно отписаться (написать remove/destroy),
			то лучше переопределить destroy здесь
			и всё-таки его использовать.
		*/
	// },

	update () {
		const { keyboard } = this.parent
		this.tank1.movementUpdate(keyboard)

		// Выстрел должен происходить не чаще, чем задано в BULLET_TIMEOUT.
		if (keyboard.space && Util.delay('tank' + this.tank1.uid, Tank.BULLET_TIMEOUT)) {
			const bullet = new Bullet({
				debug: DEBUG_MODE,
				x: this.tank1.x,
				y: this.tank1.y
			})

			// Запомнить, что эта пуля принадлежит непосредственно породившему её танку.
			this.tank1.bullets.push(bullet)
			bullet.tank = this.tank1

			// Скорость пули рассчитывается в зависимости от анимации.
			if (this.tank1.animation === 'moveUp') {
				bullet.velocity.y = -Bullet.NORMAL_SPEED
				bullet.setFrameByKeys('bullet', 'up')
			}

			// Добавить пулю в сцену.
			this.add(bullet)
			// Добавить пулю в аркадную физику.
			this.arcadePhysics.add(bullet)
		}

		/*
			В конце каждого события нужно проводить
			процессинг аркадной физики на случай столкновений объектов.
		*/
		this.arcadePhysics.processing()

		/*
			Теперь, после проверки всех соударений,
			пройти по всем пулям всех танков.
			Удалить те пули, у которых флаг toDestroy = true.
		*/
		for (const tank of [this.tank1, this.tank2]) {
			for (const bullet of tank.bullets) {
				if (bullet.toDestroy) {
					bullet.destroy()
				}
			}
		}
	}

	// update (timestamp) {
	// 	// Вытащить keyboard, чтобы не писать каждый раз длинный путь:
	// 	const { keyboard } = this.parent

	// 	this.man1.velocity.x = 0
	// 	this.man1.velocity.y = 0

	// 	this.man2.velocity.x = 0
	// 	this.man2.velocity.y = 0

	// 	// Что делать, если нажата клавиша Влево (KeyA):
	// 	if (keyboard.arrowLeft) {
	// 		this.man1.velocity.x = -2
	// 		// Если анимация не соответствует направлению, зададим её правильно:
	// 		if (this.man1.animation !== 'moveLeft') {
	// 			this.man1.startAnimation('moveLeft')
	// 		}
	// 	}

	// 	// Что делать, если нажата клавиша Вправо (KeyD):
	// 	if (keyboard.arrowRight) {
	// 		this.man1.velocity.x = 2
	// 	}

	// 	// Что делать, если нажата клавиша Вверх:
	// 	else if (keyboard.arrowUp) {
	// 		this.man1.velocity.y = -2
	// 	}

	// 	// Что делать, если нажата клавиша Вниз:
	// 	else if (keyboard.arrowDown) {
	// 		this.man1.velocity.y = 2

	// 		// Если анимация не соответствует направлению, зададим её правильно:
	// 		if (this.man1.animation !== 'moveDown') {
	// 			this.man1.startAnimation('moveDown')
	// 		}
	// 	}

	// 	else if (this.man1.animation === 'moveDown') {
	// 		this.man1.startAnimation('stayDown')
	// 	}

	// 	// В конце каждого события нужно проводить процессинг аркадной физики.
	// 	this.arcadePhysics.processing()
	// }
})

const intro = new Intro({
	autoStart: true,
	name: 'introScene',

	loading (loader) {
		loader.addImage('intro', 'static/intro.png')
		// loader.addSound('intro', 'static/sound/stage_start.ogg')
	},

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
	},

	update (timestamp) {
		const { keyboard } = this.parent

		// По нажатию space картинка мгновенно станет на место.
		if (keyboard.space && this.imageTweenStopper && this.image.y !== 0) {
			this.imageTweenStopper()
			delete this.imageTweenStopper
			this.image.y = 0
		}

		else if (keyboard.space) {

		}
	}
})

const game = new Game({
	// куда монтировать элемент (куда установить игру) - точка монтирования
	el: document.body,
	width: 500,
	height: 500,
	background: 'gray',
	/*
		Сцена - то, что на данный момент является актуальным, действующим выступлением.
		Меню - одна сцена. Игра - другая сцена.
		Третья сцена между матчами, где показаны счет, уровень.
		Сцены в игре имеют только две характеристики:
		либо они ожидают старта, либо стартовали.
		Если сцену финишировали, она удаляется полностью.
		Чтобы запустить её снова, нужно будет создать её новый экземпляр,
		добавить его в game, потом заново запустить.
	*/
	scenes: [intro, mainScene] // массив сцен (сюда передаем сцены)
})