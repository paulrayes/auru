(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Auru"] = factory();
	else
		root["Auru"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EventEmitter = __webpack_require__(1);
	var Hammer;
	var touchEnabled = "boolean" === 'undefined' || (false) === true;
	// webkit/uglify don't understand the variable above for dead code removal, so it's repeated in the if statement
	if (false) {
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
	
	var Auru = (function (_EventEmitter) {
		_inherits(Auru, _EventEmitter);
	
		function Auru(element, options) {
			_classCallCheck(this, Auru);
	
			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Auru).call(this));
	
			_this2.element = element;
			_this2.options = dumbMerge(defaultOptions, options || {});
	
			_this2.playing = false;
			_this2.currentIndex = 0;
			_this2.maxIndex = _this2.element.children.length - 1;
			_this2.previousSlide = _this2.element.children[_this2.maxIndex];
			_this2.currentSlide = _this2.element.children[_this2.currentIndex];
	
			_this2._initializeClasses();
	
			if (touchEnabled && _this2.options.touch) {
				_this2._initializeTouchEvents();
			}
	
			if (_this2.options.slideDuration) {
				_this2.play();
			}
			return _this2;
		}
	
		_createClass(Auru, [{
			key: '_initializeClasses',
			value: function _initializeClasses() {
				var prefix = this.options.classPrefix,
				    i = 0;
				this.element.classList.add(prefix + 'slideshow');
				Array.prototype.forEach.call(this.element.children, function (childNode) {
					childNode.classList.add(prefix + 'slide');
					if (i === 0) {
						childNode.classList.add(prefix + 'current');
					} else {
						childNode.classList.add(prefix + 'hidden');
					}
					i++;
				});
			}
		}, {
			key: '_removeClasses',
			value: function _removeClasses() {
				var prefix = this.options.classPrefix,
				    i = 0;
				this.element.classList.remove(prefix + 'slideshow');
				Array.prototype.forEach.call(this.element.children, function (childNode) {
					childNode.classList.remove(prefix + 'slide', prefix + 'current', prefix + 'previous', prefix + 'to-right', prefix + 'to-left', prefix + 'from-right', prefix + 'from-left');
					i++;
				});
			}
		}, {
			key: '_initializeTouchEvents',
			value: function _initializeTouchEvents() {
				var _this = this;
	
				this.hammer = new Hammer(this.element);
				this.hammer.on('swipeleft', function () {
					_this.next();
					_this.emit('swipe');
					_this.emit('swipeleft');
				});
				this.hammer.on('swiperight', function () {
					_this.previous();
					_this.emit('swipe');
					_this.emit('swiperight');
				});
				this.hammer.on('tap', function () {
					_this.emit('tap');
				});
			}
		}, {
			key: '_removeAnimationClasses',
			value: function _removeAnimationClasses(elem) {
				var prefix = this.options.classPrefix;
				elem.classList.remove(prefix + 'to-right', prefix + 'to-left', prefix + 'from-right', prefix + 'from-left');
			}
		}, {
			key: 'play',
			value: function play() {
				if (this.playing || typeof this.options.slideDuration !== 'number' || this.options.slideDuration <= 0) {
					return;
				}
				this.playing = true;
				this.timer = setInterval(this.next.bind(this), this.options.slideDuration * 1000);
			}
		}, {
			key: 'stop',
			value: function stop() {
				this.playing = false;
				clearInterval(this.timer);
			}
		}, {
			key: 'next',
			value: function next() {
				var nextIndex = this.currentIndex + 1;
				if (nextIndex > this.maxIndex) {
					nextIndex = 0;
				}
				return this.goToSlide(nextIndex);
			}
		}, {
			key: 'previous',
			value: function previous() {
				var nextIndex = this.currentIndex - 1;
				if (nextIndex < 0) {
					nextIndex = this.maxIndex;
				}
				return this.goToSlide(nextIndex);
			}
		}, {
			key: 'goToSlide',
			value: function goToSlide(index) {
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
		}, {
			key: 'destroy',
			value: function destroy(removeClasses) {
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
		}]);
	
		return Auru;
	})(EventEmitter);
	
	exports.default = Auru;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	;
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() {} /* Nothing to set */
	
	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event,
	      available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt],
	      len = arguments.length,
	      args,
	      i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1:
	        return listeners.fn.call(listeners.context), true;
	      case 2:
	        return listeners.fn.call(listeners.context, a1), true;
	      case 3:
	        return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4:
	        return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5:
	        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6:
	        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len - 1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length,
	        j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1:
	          listeners[i].fn.call(listeners[i].context);break;
	        case 2:
	          listeners[i].fn.call(listeners[i].context, a1);break;
	        case 3:
	          listeners[i].fn.call(listeners[i].context, a1, a2);break;
	        default:
	          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this),
	      evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true),
	      evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt],
	      events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=auru.notouch.js.map