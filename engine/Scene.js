import Container from './Container'

/*
	Сцена - то, что на данный момент является актуальным, действующим
	выступлением. Меню - одна сцена. Игра - другая сцена.
	Третья сцена между матчами, где показаны счет, уровень.
	Сцена унаследована от Контейнера (расширенный Контейнер).
	Отличие в том, что есть псевдоним stage. Он ссылается на тот же объект,
	что и displayObjects.
*/
export default class Scene extends Container {
	constructor (args = {}) {
		super()

		// По умолчанию сцена не стартует автоматически.
		this.autoStart = args.autoStart || false
		// Имя сцены
		this.name = args.name || ''

		// По умолчанию статус: Ожидание.
		this.status = 'waiting'
		// stage - коллекция всех дочерних элементов Сцены.
		this.stage = this.displayObjects
		// Игра, в которой находится сцена:
		// this.game = null

		// args.loading - здесь функция.
		if (args.loading) {
			this.loading = args.loading.bind(this)
		}

		// args.init - здесь функция.
		if (args.init) {
			this.init = args.init.bind(this)
		}

		// args.update - здесь функция.
		if (args.update) {
			this.update = args.update.bind(this)
		}

		// args.beforeDestroy - здесь функция.
		if (args.beforeDestroy) {
			this.beforeDestroy = args.beforeDestroy.bind(this)
		}
	}

	loading () {}
	init () {}
	update () {}
	/*
		Метод beforeDestroy() будет вызываться после того,
		как сцена отжила своё, перед удалением сцены.
		Если в функции init() подпишемся на события
		(мыши, клавиатуры - в обход Keyboard'a, от сервера, сокеты),
		эти зависимости (все, что создали в init() ) нужно будет удалить,
		чтобы не занимать память. Пока сцена слушает события,
		сборщик мусора не сможет её удалить.
	*/
	beforeDestroy () {
		// Если beforeDestroy() не была встроена извне:
		// for (const key of Object.keys(this)) {
		// 	delete this[key]
		// }
	}
}