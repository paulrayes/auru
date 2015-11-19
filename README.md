auru
====

	Customizable slideshow module for modern websites

Installation
------------

Alternatively, get the latest version from the `build` folder.

Installation - Webkit/Browserify
--------------------------------

Install from npm:

```sh
npm install auru
```

Then in your code:

```js
var Auru = require('auru');
```

Also include the stylesheet:

```html
<link rel="stylesheet" href="auru.css" />
```

By default touch events will be enabled, which adds to the size of your built module as it includes Hammer.js. To disable this, set the global `AURU_TOUCH_ENABLED` to `false`.

Webkit:

```js
plugins: [
	new webpack.DefinePlugin({
		'AURU_TOUCH_ENABLED': false
	})
]
```

Browserify: TODO

Installation - Standalone
-------------------------

Include the pre-built script in your page, which will expose the `Auru` global:

```html
<script src="auru.min.js"></script>
```

Also include the stylesheet:

```html
<link rel="stylesheet" href="auru.css" />
```

There are four built versions:

- auru.js: full version, unminified
- auru.min.js: full version, minified
- auru.notouch.js: no touch events, unminified (smaller file size as touch code is not included)
- auru.notouch.min.js: no touch events, minified

Usage
-----

Make some HTML for the slideshow:

```html
<div id="auru">
	<img src="image1.jpg" />
	<img src="image2.jpg" />
	<img src="image3.jpg" />
</div>
```

Make some CSS to size things, here is how you would make a responsive slideshow that follows the golden ratio:

```css
#auru {
	width: 100%;
	margin-bottom: 61.8%;
}
#auru > * {
	width: 100%;
	height: auto;
}
```

Initialize it with Javascript:

```js
var slideshow = new Auru(document.getElementById('auru'));
```

API
---

You may pass a second argument to the Auru constructor with additional settings:

```js
var slideshow = new Auru(document.getElementById('auru'), options);
```

- options.slideDuration: How many seconds to show each slide for, or false to not play automatically. Default: 5
- options.classPrefix: Prefix to use for every CSS class, you may change this in case of a conflict. Default: "auru-"
- options.continuousLoop: `true` for the slides to form a continuous loop; `false` for the animation to reverse when moving from the last slide to the first, or vice versa.
- options.touch: Whether to enable touch events for swipe and tap. Default: false

The resulting object (named `slideshow` on this page) has the following properties. You should never write to these properties--consider them read-only.

- element: The DOM element you passed to the constructor (`DOMElement`)
- options: The full list of options used, including defaults and any you set (`object`)
- playing: Whether the slideshow is currently playing automatically (`bool`)
- currentIndex: (`int`)
- maxIndex: (`int`)
- previousSlide: The slide that was previously shown (`DOMElement`)
- currentSlide: The slide that is currently shown (`DOMElement`)

The following methods exist:

- play(): Start playing the slideshow automatically. Will do nothing if `options.slideDuration` is not a positive number.
- stop(): Stop playing the slideshow automatically.
- next(): Move to the next slide.
- previous(): Move to the previous slide.
- goToSlide(index): Move to the specified slide index (0-based)
- destroy(removeClasses=false): Completely destroy the slideshow object. If removeClasses is false, will not touch the DOM; if true, it will remove any classes it added but otherwise will not touch the DOM. Primarily useful for single-page applications.

The slideshow will emit events when things happen. The API is similar to that used for standard Node.js events--to listen to an event, do:

```js
slideshow.on('change', eventHandler);
```

The following events exist. Events do not include any additional data, thus event handlers do not need to accept any arguments.

- change: The current slide has changed
- swipe: The current slide has changed due to the user swiping (requires build with touch events)
- swipeleft: The current slide has changed due to the user swiping left (requires build with touch events)
- swiperight: The current slide has changed due to the user swiping right (requires build with touch events)
- tap: The user has clicked or tapped on the current slide (requires build with touch events)

License
-------

Copyright 2015 Paul Rayes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
