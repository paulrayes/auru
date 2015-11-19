'use strict';

var EventEmitter = require('eventemitter3');
var Hammer;
var touchEnabled = typeof AURU_TOUCH_ENABLED === 'undefined' || AURU_TOUCH_ENABLED === true;
if (touchEnabled) {
	Hammer = require('hammerjs');
}

var defaultOptions = {
	slideDuration: 5, // how many seconds to show each slide, false to not play automatically
	classPrefix: 'auru-',
	continuousLoop: true,
	touch: false
};

function dumbMerge(first, second) {
	var copy = {};
	for (var key in first) {
		copy[key] = first[key];
	}
	for (var key in second) {
		copy[key] = second[key];
	}
	return copy;
}

export default class Auru extends EventEmitter {
	constructor(element, options) {
		super();
		this.element = element;
		this.options = dumbMerge(defaultOptions, options || {});

		this.playing = false;
		this.currentIndex = 0;
		this.maxIndex = this.element.children.length - 1;
		this.previousSlide = this.element.children[this.maxIndex];
		this.currentSlide = this.element.children[this.currentIndex];

		this._initializeClasses();

		if (touchEnabled && this.options.touch) {
			this._initializeTouchEvents();
		}

		if (this.options.slideDuration) {
			this.play();
		}
	}
	_initializeClasses() {
		var prefix = this.options.classPrefix, i = 0;
		this.element.classList.add(prefix + 'slideshow');
		Array.prototype.forEach.call(this.element.children, childNode => {
			childNode.classList.add(prefix + 'slide');
			if (i === 0) {
				childNode.classList.add(prefix + 'current');
			} else {
				childNode.classList.add(prefix + 'hidden');
			}
			i++;
		});
	}
	_removeClasses() {
		var prefix = this.options.classPrefix, i = 0;
		this.element.classList.remove(prefix + 'slideshow');
		Array.prototype.forEach.call(this.element.children, childNode => {
			childNode.classList.remove(
				prefix + 'slide',
				prefix + 'current',
				prefix + 'previous',
				prefix + 'to-right',
				prefix + 'to-left',
				prefix + 'from-right',
				prefix + 'from-left'
			);
			i++;
		});
	}
	_initializeTouchEvents() {
		this.hammer = new Hammer(this.element);
		this.hammer.on('swipeleft', () => {
			this.next();
			this.emit('swipe');
			this.emit('swipeleft');
		});
		this.hammer.on('swiperight', () => {
			this.previous();
			this.emit('swipe');
			this.emit('swiperight');
		});
		this.hammer.on('tap', () => {
			this.emit('tap');
		});
	}
	_removeAnimationClasses(elem) {
		var prefix = this.options.classPrefix;
		elem.classList.remove(
			prefix + 'to-right',
			prefix + 'to-left',
			prefix + 'from-right',
			prefix + 'from-left'
		);
	}
	play() {
		if (this.playing || typeof this.options.slideDuration !== 'number' || this.options.slideDuration <= 0) {
			return;
		}
		this.playing = true;
		this.timer = setInterval(this.next.bind(this), this.options.slideDuration*1000);
	}
	stop() {
		this.playing = false;
		clearInterval(this.timer);
	}
	next() {
		var nextIndex = this.currentIndex+1;
		if (nextIndex > this.maxIndex) {
			nextIndex = 0;
		}
		return this.goToSlide(nextIndex);
	}
	previous() {
		var nextIndex = this.currentIndex-1;
		if (nextIndex < 0) {
			nextIndex = this.maxIndex;
		}
		return this.goToSlide(nextIndex);
	}
	goToSlide(index) {
		var prefix, children, oldPrevious, previous, current, oldIndex;

		if (index < 0 || index > this.maxIndex) {
			throw new TypeError('Slide index out of bounds');
		}

		if (index === this.currentIndex) {
			return;
		}

		prefix = this.options.classPrefix;
		children = this.element.children;

		oldPrevious = this.previousSlide;
		previous = this.currentSlide;

		oldIndex = this.currentIndex;
		this.currentIndex = index;
		current = children[index];

		this._removeAnimationClasses(oldPrevious);
		oldPrevious.classList.remove(prefix + 'previous');
		oldPrevious.classList.add(prefix + 'hidden');

		this._removeAnimationClasses(previous);
		previous.classList.remove(prefix + 'current');
		previous.classList.add(prefix + 'previous');
		if (this.options.continuousLoop && this.currentIndex === 0 && oldIndex === this.maxIndex) {
			previous.classList.add(prefix + 'to-left');
		} else if (this.options.continuousLoop && this.currentIndex === this.maxIndex && oldIndex === 0) {
			previous.classList.add(prefix + 'to-right');
		} else if (this.currentIndex > oldIndex) {
			previous.classList.add(prefix + 'to-left');
		} else {
			previous.classList.add(prefix + 'to-right');
		}

		current.classList.remove(prefix + 'hidden');
		current.classList.add(prefix + 'current');
		if (this.options.continuousLoop && this.currentIndex === 0 && oldIndex === this.maxIndex) {
			current.classList.add(prefix + 'from-right');
		} else if (this.options.continuousLoop && this.currentIndex === this.maxIndex && oldIndex === 0) {
			current.classList.add(prefix + 'from-left');
		} else if (this.currentIndex > oldIndex) {
			current.classList.add(prefix + 'from-right');
		} else {
			current.classList.add(prefix + 'from-left');
		}

		this.previousSlide = previous;
		this.currentSlide = current;

		this.emit('change');
	}
	destroy(removeClasses) {
		var prefix;
		if (touchEnabled && this.options.touch) {
			this.hammer.destroy();
		}
		if (removeClasses) {
			this._removeClasses();
		}
		this.stop();
		this.removeAllListeners();
	}
}
