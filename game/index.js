// Вытаскивание Loader, Renderer и Sprite из GameEngine, чтобы не писать каждый раз перед Loader'ом - GameEngine.
// Не нужно будет писать GameEngine.Loader
const { Sprite, Game, Scene } = GameEngine

// Создание сцены:
const mainScene = new Scene({
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
		// Создать спрайт (пока будет не отрисован):
		this.sprite = new Sprite(tilTexture, {
			scale: 0.25,
			anchorX: 0.5,
			anchorY: 0.5,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2
		})

		// Добавить спрайт в сцену (теперь он отрисуется):
		this.add(this.sprite)
	},

	update (timestamp) {
		this.sprite.rotation = timestamp / 1000
	}
})

// Создание сцены:
const mainScene2 = new Scene({
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
		// Создать спрайт (пока будет не отрисован):
		this.sprite = new Sprite(tilTexture, {
			scale: 0.25,
			anchorX: 0.5,
			anchorY: 0.5,
			x: this.parent.renderer.canvas.width / 2,
			y: this.parent.renderer.canvas.height / 2
		})

		// Добавить спрайт в сцену (теперь он отрисуется):
		this.add(this.sprite)
	},

	update (timestamp) {
		this.sprite.rotation = -timestamp / 1000
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
	*/
	scenes: [mainScene, mainScene2] // массив сцен (сюда передаем сцены)
})