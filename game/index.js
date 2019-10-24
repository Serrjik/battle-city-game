/*
	Вытаскивание Loader, Renderer и Sprite из GameEngine,
	чтобы не писать каждый раз перед Loader'ом - GameEngine (деструктуризация).
	Не нужно будет писать GameEngine.Loader
*/
const { Body, Game, Scene, ArcadePhysics } = GameEngine

// Создание сцены:
const mainScene = new Scene({
	// Имя сцены:
	name: 'mainScene',
	// Автоматически стартовать сцену:
	autoStart: true,
	/*
		Функции loading(), init(), update() будут вызываться в контексте экземпляра класса Scene.
		Потому что в конструкторе значение параметра функции присваивается вместе с bind(this).
	*/
	/*
		Функция вызывается, чтобы добавить ресурсы,
		которые понадобятся в дальнейшем (будут использованы в сцене).
	*/
	loading (loader) {
		loader.addImage('man', 'static/man.png')
		loader.addJson('manAtlas', 'static/manAtlas.json')
	},

	/*
		Функция вызывается единожды после того, как будут загружены ресурсы сцены.
		Инициализирует сцену (создает объекты, спрайты, рисунки, тексты -
		всё, что нужно будет использовать в дальнейшем).
	*/
	init () {
		// Получить текстуру:
		Man.texture = this.parent.loader.getImage('man')
		Man.atlas = this.parent.loader.getJson('manAtlas')

		// Аркада будет на уровне сцены.
		this.arcadePhysics = new ArcadePhysics

		// Создать спрайт (пока будет не отрисован):
		this.man1 = new Man({
			x: this.parent.renderer.canvas.width / 2 - 100,
			y: this.parent.renderer.canvas.height / 2
		})

		this.man2 = new Man({
			x: this.parent.renderer.canvas.width / 2 + 100,
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
		this.add(this.man1, this.man2)
		// Добавить объекты в аркаду (теперь к ним применится аркадная физика).
		this.arcadePhysics.add(this.man1, this.man2)

		// Подписаться на событие frameChange. this будет генерировать это событие.
		/*this.man.on('frameChange', man => {
			console.log('frameChange')
		})*/

		// this.man.setFrameByKeys('man', 'down', 'frame1')
		// this.man.width = this.man.frame.width
		// this.man.height = this.man.frame.height

		/*
			Если точка всегда будет на этой позиции, this можно не писать.
			Задать через const.
			Зато будет сложно достучаться до неё из update().
		*/
		/*const point = new Point({
			// Установим координаты как у спрайта:
			x: this.til.x,
			y: this.til.y
		})*/

		/*
			Если линия всегда будет на этой позиции, this можно не писать.
			Задать через const.
			Зато будет сложно достучаться до неё из update().
		*/
		/*const line = new Line({
			x1: 0,
			y1: 0,
			x2: this.parent.renderer.canvas.width,
			y2: this.parent.renderer.canvas.height
		})*/

		// graphicContainer.add(point, line)
	},

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

	update (timestamp) {
		// Вытащить keyboard, чтобы не писать каждый раз длинный путь:
		const { keyboard } = this.parent

		this.man1.velocity.x = 0
		this.man1.velocity.y = 0

		this.man2.velocity.x = 0
		this.man2.velocity.y = 0

		// Что делать, если нажата клавиша Влево (KeyA):
		if (keyboard.arrowLeft) {
			this.man1.velocity.x = -2
			// Если анимация не соответствует направлению, зададим её правильно:
			if (this.man1.animation !== 'moveLeft') {
				this.man1.startAnimation('moveLeft')
			}
		}

		// Что делать, если нажата клавиша Вправо (KeyD):
		if (keyboard.arrowRight) {
			this.man1.velocity.x = 2
		}

		// Что делать, если нажата клавиша Вверх:
		else if (keyboard.arrowUp) {
			this.man1.velocity.y = -2
		}

		// Что делать, если нажата клавиша Вниз:
		else if (keyboard.arrowDown) {
			this.man1.velocity.y = 2

			// Если анимация не соответствует направлению, зададим её правильно:
			if (this.man1.animation !== 'moveDown') {
				this.man1.startAnimation('moveDown')
			}
		}

		else if (this.man1.animation === 'moveDown') {
			this.man1.startAnimation('stayDown')
		}

		// В конце каждого события нужно проводить процессинг аркадной физики.
		this.arcadePhysics.processing()
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
	scenes: [mainScene] // массив сцен (сюда передаем сцены)
})