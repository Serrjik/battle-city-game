/*
	Вытаскивание Loader, Renderer и Sprite из GameEngine,
	чтобы не писать каждый раз перед Loader'ом - GameEngine (деструктуризация).
	Не нужно будет писать GameEngine.Loader
*/
const { Body, Sprite, Game, Scene, Point, Line, Container, Util } = GameEngine

// let n = 1 // Используется для подстановки номера фрейма: frame1 - 'frame' + n.

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
		const manTexture = this.parent.loader.getImage('man')
		const manAtlas = this.parent.loader.getJson('manAtlas')

		// Создать спрайт (пока будет не отрисован):
		this.man = new Body(manTexture, {
			scale: 0.5,
			anchorX: 0.5,
			anchorY: 0.5,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2,
			// debug: true,
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
		})

		this.man.setFramesCollection(manAtlas.frames)
		this.man.setAnimationsCollection(manAtlas.actions)
		this.man.startAnimation('moveDown')

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
		this.add(this.man)
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

		this.man.velocity.x = 0
		this.man.velocity.y = 0

		// Что делать, если нажата клавиша Вверх:
		if (keyboard.arrowUp) {
			this.man.velocity.y = -5
		}

		// Что делать, если нажата клавиша Вниз:
		if (keyboard.arrowDown) {
			this.man.velocity.y = 5
		}
	}
})

const game = new Game({
	// куда монтировать элемент (куда установить игру) - точка монтирования
	el: document.body,
	width: 500,
	height: 500,
	background: 'green',
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