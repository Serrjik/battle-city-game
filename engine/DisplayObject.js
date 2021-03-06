import EventEmitter from './EventEmitter'
import Util from './Util'

/*
	Экземпляр класса DisplayObject содержит объект, который нужно отобразить
	(sprite, animation sprite, контейнер, и любая сущность, которую нужно
	отрисовать).
*/
export default class DisplayObject extends EventEmitter {
	constructor (args = {}) {
		super()

		this.uid = Util.generateUid()

		// координаты содержащегося объекта
		this.x = args.x || 0
		this.y = args.y || 0
		// ширина и высота содержащегося объекта
		this.width = args.width || 0
		this.height = args.height || 0
		// на сколько нужно повернуть содержащийся объект
		this.rotation = args.rotation || 0
		/*
			Anchor содержащегося объекта (показывает, какую часть изображения в
			процентах нужно взять, чтобы получить настоящий центр изображения).
			Изначально центр изображения находится в его левом верхнем углу
			(координаты 0, 0).
		*/
		this.anchorX = args.anchorX || 0
		this.anchorY = args.anchorY || 0

		// Масштаб
		this.scale = args.scale || 1
		// Масштаб по оси X
		this.scaleX = args.scaleX || 1
		// Масштаб по оси Y
		this.scaleY = args.scaleY || 1

		// Поле должно ссылаться на верхний по иерархии элемент.
		this.parent = null
		// Поле указывает, нужно отрисовывать объект либо нет.
		this.visible = true

		if (args.scale !== undefined ) {
			this.setScale(args.scale)
		}
	}

	// Геттер возвращает сцену, в которой находится объект.
	get scene () {
		return Util.getScene(this)
	}

	get game () {
		return this.scene.parent
	}

	// Геттер - координата X левого верхнего угла
	get absoluteX () {
		/*
			Здесь не используем scale, потому что он используется
			только в момент отрисовки изображения
		*/
		return this.x - this.anchorX * this.width * this.scaleX
	}

	// Сеттер - координата X левого верхнего угла
	set absoluteX (value) {
		this.x = value + this.anchorX * this.width * this.scaleX
		return value
	}

	// Геттер - координата Y левого верхнего угла
	get absoluteY () {
		/*
			Здесь не используем scale, потому что он используется
			только в момент отрисовки изображения
		*/
		return this.y - this.anchorY * this.height * this.scaleY
	}

	// Сеттер - координата Y левого верхнего угла
	set absoluteY (value) {
		this.y = value + this.anchorY * this.height * this.scaleY
		return value
	}

	// Геттер - координата x центра.
	get centerX () {
		return this.absoluteX + this.width / 2 * this.scaleX
	}

	// Сеттер - координата x центра.
	set centerX (value) {
		return this.absoluteX = value - this.width / 2
	}

	// Геттер - координата y центра.
	get centerY () {
		return this.absoluteY + this.height / 2 * this.scaleY
	}

	// Сеттер - координата y центра.
	set centerY (value) {
		return this.absoluteY = value - this.height / 2
	}

	// Метод задает значение 2 полям (масштабы по осям X, Y)
	setScale (scale) {
		this.scaleX = scale
		this.scaleY = scale
	}

	// Метод устанавливает родительский элемент.
	setParent (parent) {
		// Если родительский элемент уже есть
		if (this.parent && this.parent.remove) {
			// удалить этот элемент из родительского
			this.parent.remove(this)
		}

		// Добавить этот элемент в родительский
		if (parent && parent.add) {
			parent.add(this)
		}

		this.parent = parent
	}

	/*
		draw() будет вроде фильтра,
		который будет срабатывать только в том случае,если объект будет виден
	*/
	draw (callback) {
		if (this.visible) {
			callback()
		}
	}
}