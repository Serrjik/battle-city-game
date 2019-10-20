/*
	Модуль отвечает за хранение и состояние всех сцен.
	Следит, в каком состоянии сейчас находится каждая сцена.
	Смотрит, какие сцены сейчас должны быть автоматически запущены.
	Запускает их, позволяет им указать, какие именно ресурсы понадобятся им в дальнейшем.
	Когда ресурсы понадобятся, модуль их запустит.
	Проверяет, какие сцены успели стартовать,
	и для них вызывается update(timestamp).
*/
;(function () {
	'use strict'

	class Game {
		constructor (args = {}) {
			this.renderer = new GameEngine.Renderer(args)
			this.loader = new GameEngine.Loader()
			// Контейнер со сценами, с которыми будем работать:
			this.scenesCollection = new GameEngine.Container()

			/*
				Если у нас есть сцена, вызываем метод addScene()
				и передаем туда массив всех сцен.
			*/
			if (args.scenes) {
				this.addScene(...args.scenes)
			}

			/*
				Если в args присутствует элемент, в который нужно установить игру,
				(точка монтирования) и у него есть метод appendChild(),
				добавим к этому элементу канвас
			*/
			if (args.el && args.el.appendChild) {
				args.el.appendChild(this.renderer.canvas)
			}

			// Массив всех сцен, которые автоматически активируются:
			const autoStartedScenes = this.scenes.filter(x => x.autoStart)

			// Пройти по всем сценам, которые автоматически активируются:
			for (const scene of autoStartedScenes) {
				// Поменять статус на 'loading' (сейчас происходит загрузка).
				scene.status = 'loading'
				/*
					Запустить сцену.
					Передаем в функцию loading() функцию loader().
					Функция loader() должна зарегистрировать все
					загружаемые в данную сцену материалы.
				*/
				scene.loading(this.loader)
			}

			this.loader.load(() => {
				/*
					После того, как все данные загрузятся,
					у всех сцен, по которым прошли,
					нужно запустить сначала init(), а потом update()
				*/
				// Ещё раз пройти по всем сценам, которые автоматически активируются:
				for (const scene of autoStartedScenes) {
					// После загрузки сцены изменить её статус на 'init'.
					scene.status = 'init'
					// Запустим у них init()
					scene.init()
				}

				for (const scene of autoStartedScenes) {
					// После 'init'a статус должен быть 'started'.
					scene.status = 'started'
				}

			})

			// Регистрация функции, которая постоянно вызывается,
			// чтобы обновлять изображение на канвасе
			requestAnimationFrame(timestamp => this.tick(timestamp))
		}

		// Метод привязывает контекст.
		addScene (...scenes) {
			this.scenesCollection.add(...scenes)

			/*
			Пройти по сценам и установить каждой
			поле parent будет ссылаться на саму игру.
			*/
			for (const scene of scenes) {
				scene.parent = this
			}
		}

		// Сами сцены, с которыми будем работать (геттер):
		get scenes () {
			return this.scenesCollection.displayObjects
		}

		/*
			Функция вызывает update() для всех сцен,
			передавая timestamp - сколько времени приложение уже работает,
			и renderer.clear().
		*/
		tick (timestamp) {
			// Пройти по всем сценам, которые стартовали:
			const startedScenes = this.scenes.filter(x => x.status === 'started')

			for (const scene of startedScenes) {
				// Сначала вызвать метод update()
				scene.update(timestamp)
			}

			this.renderer.clear()

			for (const scene of startedScenes) {
				/*
					Затем вызвать метод draw(), потому что сцена унаследована от контейнера.
					Метод отрисовывает изображение.
					Вызывать нужно после обновлений всех сцен, потому что
					возможно 2 сцены могут быть активны одновременно и
					взаимодействовать с одним и тем же ресурсом,
					и после update() в другой сцене отрисуется другая картинка,
					не та, что могла бы быть до update().
					Потому что первая сцена могла изменить состояние общего ресурса.
				*/
				scene.draw(this.renderer.canvas, this.renderer.context)
			}

			requestAnimationFrame(timestamp => this.tick(timestamp))
		}
	}

	window.GameEngine = window.GameEngine || {}
	window.GameEngine.Game = Game
})();