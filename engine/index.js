import ArcadePhysics from './ArcadePhysics'
import Body from './Body'
import Container from './Container'
import DisplayObject from './DisplayObject'
import EventEmitter from './EventEmitter'
import Game from './Game'
import Keyboard from './Keyboard'
import Line from './Line'
import Loader from './Loader'
import Mouse from './Mouse'
import Point from './Point'
import Renderer from './Renderer'
import Scene from './Scene'
import Sprite from './Sprite'
import Util from './Util'

// Сделать перечисленные параметры доступными из Game.
Object.assign(Game, {
	ArcadePhysics,
	Body,
	Container,
	DisplayObject,
	EventEmitter,
	Game,
	Keyboard,
	Line,
	Loader,
	Mouse,
	Point,
	Renderer,
	Scene,
	Sprite,
	Util
})

export {
	ArcadePhysics,
	Body,
	Container,
	DisplayObject,
	EventEmitter,
	Game,
	Keyboard,
	Line,
	Loader,
	Mouse,
	Point,
	Renderer,
	Scene,
	Sprite,
	Util
}

// То, что достается с помощью import.
// Пусть Game будет корневой элемент.
export default Game