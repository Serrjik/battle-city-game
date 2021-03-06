import { Body, Game, Scene, ArcadePhysics, Util, Sprite } from './../engine'
import Home from './Home'
import Intro from './Intro'
import Party from './Party'

export default new Game({
	// куда монтировать элемент (куда установить игру) - точка монтирования
	el: document.body,
	width: 650,
	height: 650,
	background: 'black',
	/*
		Сцена - то, что на данный момент является актуальным, действующим
		выступлением. Меню - одна сцена. Игра - другая сцена.
		Третья сцена между матчами, где показаны счет, уровень.
		Сцены в игре имеют только две характеристики:
		либо они ожидают старта, либо стартовали.
		Если сцену финишировали, она удаляется полностью.
		Чтобы запустить её снова, нужно будет создать её новый экземпляр,
		добавить его в game, потом заново запустить.
	*/
	// массив сцен (сюда передаем сцены)
	scenes: [
		new Home({ autoStart: true }),
		new Intro({ autoStart: false }),
		new Party({ autoStart: false })
	]
})