/*
	Вытаскивание Loader, Renderer и Sprite из GameEngine,
	чтобы не писать каждый раз перед Loader'ом - GameEngine (деструктуризация).
	Не нужно будет писать GameEngine.Loader
*/
const { Body, Sprite, Game, Scene, Point, Line, Container } = GameEngine

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
		loader.addImage('til', 'static/til.jpg')
		loader.addJson('persons', 'static/persons.json')
	},

	/*
		Функция вызывается единожды после того, как будут загружены ресурсы сцены.
		Инициализирует сцену (создает объекты, спрайты, рисунки, тексты -
		всё, что нужно будет использовать в дальнейшем).
	*/
	init () {
		// Получить текстуру:
		const tilTexture = this.parent.loader.getImage('til')
		// Контейнер для точек, прямых, линий и т.д.
		const graphicContainer = new Container

		// Создать спрайт (пока будет не отрисован):
		this.til = new Body(tilTexture, {
			scale: 0.5,
			anchorX: 0.5,
			anchorY: 0.5,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2,
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
		})

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
		this.add(this.til)
		this.add(graphicContainer)
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

		let speedRotation = keyboard.space ? Math.PI / 100 : Math.PI / 200

		// Что делать, если нажата клавиша Вверх:
		if (keyboard.arrowUp) {
			this.til.rotation += speedRotation
		}

		// Что делать, если нажата клавиша Вниз:
		if (keyboard.arrowDown) {
			this.til.rotation -= speedRotation
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