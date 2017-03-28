/*
Uniform v2.1.0
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.3 or newer
*/


(function ($, undef) {
	"use strict";

	/**
	 * Use .prop() if jQuery supports it, otherwise fall back to .attr()
	 *
	 * @param jQuery $el jQuery'd element on which we're calling attr/prop
	 * @param ... All other parameters are passed to jQuery's function
	 * @return The result from jQuery
	 */
	function attrOrProp($el) {
		var args = Array.prototype.slice.call(arguments, 1);

		if ($el.prop) {
			// jQuery 1.6+
			return $el.prop.apply($el, args);
		}

		// jQuery 1.5 and below
		return $el.attr.apply($el, args);
	}

	/**
	 * For backwards compatibility with older jQuery libraries, only bind
	 * one thing at a time.  Also, this function adds our namespace to
	 * events in one consistent location, shrinking the minified code.
	 *
	 * The properties on the events object are the names of the events
	 * that we are supposed to add to.  It can be a space separated list.
	 * The namespace will be added automatically.
	 *
	 * @param jQuery $el
	 * @param Object options Uniform options for this element
	 * @param Object events Events to bind, properties are event names
	 */
	function bindMany($el, options, events) {
		var name, namespaced;

		for (name in events) {
			if (events.hasOwnProperty(name)) {
				namespaced = name.replace(/ |$/g, options.eventNamespace);
				$el.bind(namespaced, events[name]);
			}
		}
	}

	/**
	 * Bind the hover, active, focus, and blur UI updates
	 *
	 * @param jQuery $el Original element
	 * @param jQuery $target Target for the events (our div/span)
	 * @param Object options Uniform options for the element $target
	 */
	function bindUi($el, $target, options) {
		bindMany($el, options, {
			focus: function () {
				$target.addClass(options.focusClass);
			},
			blur: function () {
				$target.removeClass(options.focusClass);
				$target.removeClass(options.activeClass);
			},
			mouseenter: function () {
				$target.addClass(options.hoverClass);
			},
			mouseleave: function () {
				$target.removeClass(options.hoverClass);
				$target.removeClass(options.activeClass);
			},
			"mousedown touchbegin": function () {
				if (!$el.is(":disabled")) {
					$target.addClass(options.activeClass);
				}
			},
			"mouseup touchend": function () {
				$target.removeClass(options.activeClass);
			}
		});
	}

	/**
	 * Remove the hover, focus, active classes.
	 *
	 * @param jQuery $el Element with classes
	 * @param Object options Uniform options for the element
	 */
	function classClearStandard($el, options) {
		$el.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);
	}

	/**
	 * Add or remove a class, depending on if it's "enabled"
	 *
	 * @param jQuery $el Element that has the class added/removed
	 * @param String className Class or classes to add/remove
	 * @param Boolean enabled True to add the class, false to remove
	 */
	function classUpdate($el, className, enabled) {
		if (enabled) {
			$el.addClass(className);
		} else {
			$el.removeClass(className);
		}
	}

	/**
	 * Updating the "checked" property can be a little tricky.  This
	 * changed in jQuery 1.6 and now we can pass booleans to .prop().
	 * Prior to that, one either adds an attribute ("checked=checked") or
	 * removes the attribute.
	 *
	 * @param jQuery $tag Our Uniform span/div
	 * @param jQuery $el Original form element
	 * @param Object options Uniform options for this element
	 */
	function classUpdateChecked($tag, $el, options) {
		var c = "checked",
			isChecked = $el.is(":" + c);

		if ($el.prop) {
			// jQuery 1.6+
			$el.prop(c, isChecked);
		} else {
			// jQuery 1.5 and below
			if (isChecked) {
				$el.attr(c, c);
			} else {
				$el.removeAttr(c);
			}
		}

		classUpdate($tag, options.checkedClass, isChecked);
	}

	/**
	 * Set or remove the "disabled" class for disabled elements, based on
	 * if the
	 *
	 * @param jQuery $tag Our Uniform span/div
	 * @param jQuery $el Original form element
	 * @param Object options Uniform options for this element
	 */
	function classUpdateDisabled($tag, $el, options) {
		classUpdate($tag, options.disabledClass, $el.is(":disabled"));
	}

	/**
	 * Wrap an element inside of a container or put the container next
	 * to the element.  See the code for examples of the different methods.
	 *
	 * Returns the container that was added to the HTML.
	 *
	 * @param jQuery $el Element to wrap
	 * @param jQuery $container Add this new container around/near $el
	 * @param String method One of "after", "before" or "wrap"
	 * @return $container after it has been cloned for adding to $el
	 */
	function divSpanWrap($el, $container, method) {
		switch (method) {
		case "after":
			// Result:  <element /> <container />
			$el.after($container);
			return $el.next();
		case "before":
			// Result:  <container /> <element />
			$el.before($container);
			return $el.prev();
		case "wrap":
			// Result:  <container> <element /> </container>
			$el.wrap($container);
			return $el.parent();
		}

		return null;
	}


	/**
	 * Create a div/span combo for uniforming an element
	 *
	 * @param jQuery $el Element to wrap
	 * @param Object options Options for the element, set by the user
	 * @param Object divSpanConfig Options for how we wrap the div/span
	 * @return Object Contains the div and span as properties
	 */
	function divSpan($el, options, divSpanConfig) {
		var $div, $span, id;

		if (!divSpanConfig) {
			divSpanConfig = {};
		}

		divSpanConfig = $.extend({
			bind: {},
			divClass: null,
			divWrap: "wrap",
			spanClass: null,
			spanHtml: null,
			spanWrap: "wrap"
		}, divSpanConfig);

		$div = $('<div />');
		$span = $('<span />');

		// Automatically hide this div/span if the element is hidden.
		// Do not hide if the element is hidden because a parent is hidden.
		if (options.autoHide && $el.is(':hidden') && $el.css('display') === 'none') {
			$div.hide();
		}

		if (divSpanConfig.divClass) {
			$div.addClass(divSpanConfig.divClass);
		}

		if (options.wrapperClass) {
			$div.addClass(options.wrapperClass);
		}

		if (divSpanConfig.spanClass) {
			$span.addClass(divSpanConfig.spanClass);
		}

		id = attrOrProp($el, 'id');

		if (options.useID && id) {
			attrOrProp($div, 'id', options.idPrefix + '-' + id);
		}

		if (divSpanConfig.spanHtml) {
			$span.html(divSpanConfig.spanHtml);
		}

		$div = divSpanWrap($el, $div, divSpanConfig.divWrap);
		$span = divSpanWrap($el, $span, divSpanConfig.spanWrap);
		classUpdateDisabled($div, $el, options);
		return {
			div: $div,
			span: $span
		};
	}


	/**
	 * Wrap an element with a span to apply a global wrapper class
	 *
	 * @param jQuery $el Element to wrap
	 * @param object options
	 * @return jQuery Wrapper element
	 */
	function wrapWithWrapperClass($el, options) {
		var $span;

		if (!options.wrapperClass) {
			return null;
		}

		$span = $('<span />').addClass(options.wrapperClass);
		$span = divSpanWrap($el, $span, "wrap");
		return $span;
	}


	/**
	 * Test if high contrast mode is enabled.
	 *
	 * In high contrast mode, background images can not be set and
	 * they are always returned as 'none'.
	 *
	 * @return boolean True if in high contrast mode
	 */
	function highContrast() {
		var c, $div, el, rgb;

		// High contrast mode deals with white and black
		rgb = 'rgb(120,2,153)';
		$div = $('<div style="width:0;height:0;color:' + rgb + '">');
		$('body').append($div);
		el = $div.get(0);

		// $div.css() will get the style definition, not
		// the actually displaying style
		if (window.getComputedStyle) {
			c = window.getComputedStyle(el, null).color;
		} else {
			c = (el.currentStyle || el.style || {}).color;
		}

		$div.remove();
		return c.replace(/ /g, '') !== rgb;
	}


	/**
	 * Change text into safe HTML
	 *
	 * @param String text
	 * @return String HTML version
	 */
	function htmlify(text) {
		if (!text) {
			return "";
		}

		return $('<span />').text(text).html();
	}

	/**
	 * If not MSIE, return false.
	 * If it is, return the version number.
	 *
	 * @return false|number
	 */
	function isMsie() {
		return navigator.cpuClass && !navigator.product;
	}

	/**
	 * Return true if this version of IE allows styling
	 *
	 * @return boolean
	 */
	function isMsieSevenOrNewer() {
		if (typeof window.XMLHttpRequest !== 'undefined') {
			return true;
		}

		return false;
	}

	/**
	 * Test if the element is a multiselect
	 *
	 * @param jQuery $el Element
	 * @return boolean true/false
	 */
	function isMultiselect($el) {
		var elSize;

		if ($el[0].multiple) {
			return true;
		}

		elSize = attrOrProp($el, "size");

		if (!elSize || elSize <= 1) {
			return false;
		}

		return true;
	}

	/**
	 * Meaningless utility function.  Used mostly for improving minification.
	 *
	 * @return false
	 */
	function returnFalse() {
		return false;
	}

	/**
	 * noSelect plugin, very slightly modified
	 * http://mths.be/noselect v1.0.3
	 *
	 * @param jQuery $elem Element that we don't want to select
	 * @param Object options Uniform options for the element
	 */
	function noSelect($elem, options) {
		var none = 'none';
		bindMany($elem, options, {
			'selectstart dragstart mousedown': returnFalse
		});

		$elem.css({
			MozUserSelect: none,
			msUserSelect: none,
			webkitUserSelect: none,
			userSelect: none
		});
	}

	/**
	 * Updates the filename tag based on the value of the real input
	 * element.
	 *
	 * @param jQuery $el Actual form element
	 * @param jQuery $filenameTag Span/div to update
	 * @param Object options Uniform options for this element
	 */
	function setFilename($el, $filenameTag, options) {
		var filename = $el.val();

		if (filename === "") {
			filename = options.fileDefaultHtml;
		} else {
			filename = filename.split(/[\/\\]+/);
			filename = filename[(filename.length - 1)];
		}

		$filenameTag.text(filename);
	}


	/**
	 * Function from jQuery to swap some CSS values, run a callback,
	 * then restore the CSS.  Modified to pass JSLint and handle undefined
	 * values with 'use strict'.
	 *
	 * @param jQuery $el Element
	 * @param object newCss CSS values to swap out
	 * @param Function callback Function to run
	 */
	function swap($elements, newCss, callback) {
		var restore, item;

		restore = [];

		$elements.each(function () {
			var name;

			for (name in newCss) {
				if (Object.prototype.hasOwnProperty.call(newCss, name)) {
					restore.push({
						el: this,
						name: name,
						old: this.style[name]
					});

					this.style[name] = newCss[name];
				}
			}
		});

		callback();

		while (restore.length) {
			item = restore.pop();
			item.el.style[item.name] = item.old;
		}
	}


	/**
	 * The browser doesn't provide sizes of elements that are not visible.
	 * This will clone an element and add it to the DOM for calculations.
	 *
	 * @param jQuery $el
	 * @param String method
	 */
	function sizingInvisible($el, callback) {
		var targets;

		// We wish to target ourselves and any parents as long as
		// they are not visible
		targets = $el.parents();
		targets.push($el[0]);
		targets = targets.not(':visible');
		swap(targets, {
			visibility: "hidden",
			display: "block",
			position: "absolute"
		}, callback);
	}


	/**
	 * Standard way to unwrap the div/span combination from an element
	 *
	 * @param jQuery $el Element that we wish to preserve
	 * @param Object options Uniform options for the element
	 * @return Function This generated function will perform the given work
	 */
	function unwrapUnwrapUnbindFunction($el, options) {
		return function () {
			$el.unwrap().unwrap().unbind(options.eventNamespace);
		};
	}

	var allowStyling = true,  // False if IE6 or other unsupported browsers
		highContrastTest = false,  // Was the high contrast test ran?
		uniformHandlers = [  // Objects that take care of "unification"
			{
				// Buttons
				match: function ($el) {
					return $el.is("a, button, :submit, :reset, input[type='button']");
				},
				apply: function ($el, options) {
					var $div, defaultSpanHtml, ds, getHtml, doingClickEvent;
					defaultSpanHtml = options.submitDefaultHtml;

					if ($el.is(":reset")) {
						defaultSpanHtml = options.resetDefaultHtml;
					}

					if ($el.is("a, button")) {
						// Use the HTML inside the tag
						getHtml = function () {
							return $el.html() || defaultSpanHtml;
						};
					} else {
						// Use the value property of the element
						getHtml = function () {
							return htmlify(attrOrProp($el, "value")) || defaultSpanHtml;
						};
					}

					ds = divSpan($el, options, {
						divClass: options.buttonClass,
						spanHtml: getHtml()
					});
					$div = ds.div;
					bindUi($el, $div, options);
					doingClickEvent = false;
					bindMany($div, options, {
						"click touchend": function () {
							var ev, res, target, href;

							if (doingClickEvent) {
								return;
							}

							if ($el.is(':disabled')) {
								return;
							}

							doingClickEvent = true;

							if ($el[0].dispatchEvent) {
								ev = document.createEvent("MouseEvents");
								ev.initEvent("click", true, true);
								res = $el[0].dispatchEvent(ev);

								if ($el.is('a') && res) {
									target = attrOrProp($el, 'target');
									href = attrOrProp($el, 'href');

									if (!target || target === '_self') {
										document.location.href = href;
									} else {
										window.open(href, target);
									}
								}
							} else {
								$el.click();
							}

							doingClickEvent = false;
						}
					});
					noSelect($div, options);
					return {
						remove: function () {
							// Move $el out
							$div.after($el);

							// Remove div and span
							$div.remove();

							// Unbind events
							$el.unbind(options.eventNamespace);
							return $el;
						},
						update: function () {
							classClearStandard($div, options);
							classUpdateDisabled($div, $el, options);
							$el.detach();
							ds.span.html(getHtml()).append($el);
						}
					};
				}
			},
			{
				// Checkboxes
				match: function ($el) {
					return $el.is(":checkbox");
				},
				apply: function ($el, options) {
					var ds, $div, $span;
					ds = divSpan($el, options, {
						divClass: options.checkboxClass
					});
					$div = ds.div;
					$span = ds.span;

					// Add focus classes, toggling, active, etc.
					bindUi($el, $div, options);
					bindMany($el, options, {
						"click touchend": function () {
							classUpdateChecked($span, $el, options);
						}
					});
					classUpdateChecked($span, $el, options);
					return {
						remove: unwrapUnwrapUnbindFunction($el, options),
						update: function () {
							classClearStandard($div, options);
							$span.removeClass(options.checkedClass);
							classUpdateChecked($span, $el, options);
							classUpdateDisabled($div, $el, options);
						}
					};
				}
			},
			{
				// File selection / uploads
				match: function ($el) {
					return $el.is(":file");
				},
				apply: function ($el, options) {
					var ds, $div, $filename, $button;

					// The "span" is the button
					ds = divSpan($el, options, {
						divClass: options.fileClass,
						spanClass: options.fileButtonClass,
						spanHtml: options.fileButtonHtml,
						spanWrap: "after"
					});
					$div = ds.div;
					$button = ds.span;
					$filename = $("<span />").html(options.fileDefaultHtml);
					$filename.addClass(options.filenameClass);
					$filename = divSpanWrap($el, $filename, "after");

					// Set the size
					if (!attrOrProp($el, "size")) {
						attrOrProp($el, "size", $div.width() / 10);
					}

					// Actions
					function filenameUpdate() {
						setFilename($el, $filename, options);
					}

					bindUi($el, $div, options);

					// Account for input saved across refreshes
					filenameUpdate();

					// IE7 doesn't fire onChange until blur or second fire.
					if (isMsie()) {
						// IE considers browser chrome blocking I/O, so it
						// suspends tiemouts until after the file has
						// been selected.
						bindMany($el, options, {
							click: function () {
								$el.trigger("change");
								setTimeout(filenameUpdate, 0);
							}
						});
					} else {
						// All other browsers behave properly
						bindMany($el, options, {
							change: filenameUpdate
						});
					}

					noSelect($filename, options);
					noSelect($button, options);
					return {
						remove: function () {
							// Remove filename and button
							$filename.remove();
							$button.remove();

							// Unwrap parent div, remove events
							return $el.unwrap().unbind(options.eventNamespace);
						},
						update: function () {
							classClearStandard($div, options);
							setFilename($el, $filename, options);
							classUpdateDisabled($div, $el, options);
						}
					};
				}
			},
			{
				// Input fields (text)
				match: function ($el) {
					if ($el.is("input")) {
						var t = (" " + attrOrProp($el, "type") + " ").toLowerCase(),
							allowed = " color date datetime datetime-local email month number password search tel text time url week ";
						return allowed.indexOf(t) >= 0;
					}

					return false;
				},
				apply: function ($el, options) {
					var elType, $wrapper;

					elType = attrOrProp($el, "type");
					$el.addClass(options.inputClass);
					$wrapper = wrapWithWrapperClass($el, options);
					bindUi($el, $el, options);

					if (options.inputAddTypeAsClass) {
						$el.addClass(elType);
					}

					return {
						remove: function () {
							$el.removeClass(options.inputClass);

							if (options.inputAddTypeAsClass) {
								$el.removeClass(elType);
							}

							if ($wrapper) {
								$el.unwrap();
							}
						},
						update: returnFalse
					};
				}
			},
			{
				// Radio buttons
				match: function ($el) {
					return $el.is(":radio");
				},
				apply: function ($el, options) {
					var ds, $div, $span;
					ds = divSpan($el, options, {
						divClass: options.radioClass
					});
					$div = ds.div;
					$span = ds.span;

					// Add classes for focus, handle active, checked
					bindUi($el, $div, options);
					bindMany($el, options, {
						"click touchend": function () {
							// Find all radios with the same name, then update
							// them with $.uniform.update() so the right
							// per-element options are used
							$.uniform.update($(':radio[name="' + attrOrProp($el, "name") + '"]'));
						}
					});
					classUpdateChecked($span, $el, options);
					return {
						remove: unwrapUnwrapUnbindFunction($el, options),
						update: function () {
							classClearStandard($div, options);
							classUpdateChecked($span, $el, options);
							classUpdateDisabled($div, $el, options);
						}
					};
				}
			},
			{
				// Select lists, but do not style multiselects here
				match: function ($el) {
					if ($el.is("select") && !isMultiselect($el)) {
						return true;
					}

					return false;
				},
				apply: function ($el, options) {
					var ds, $div, $span, origElemWidth;

					if (options.selectAutoWidth) {
						sizingInvisible($el, function () {
							origElemWidth = $el.width();
						});
					}

					ds = divSpan($el, options, {
						divClass: options.selectClass,
						spanHtml: ($el.find(":selected:first") || $el.find("option:first")).html(),
						spanWrap: "before"
					});
					$div = ds.div;
					$span = ds.span;

					if (options.selectAutoWidth) {
						// Use the width of the select and adjust the
						// span and div accordingly
						sizingInvisible($el, function () {
							// Force "display: block" - related to bug #287
							swap($([ $span[0], $div[0] ]), {
								display: "block"
							}, function () {
								var spanPad;
								spanPad = $span.outerWidth() - $span.width();
								$div.width(origElemWidth + spanPad);
								$span.width(origElemWidth);
							});
						});
					} else {
						// Force the select to fill the size of the div
						$div.addClass('fixedWidth');
					}

					// Take care of events
					bindUi($el, $div, options);
					bindMany($el, options, {
						change: function () {
							$span.html($el.find(":selected").html());
							$div.removeClass(options.activeClass);
						},
						"click touchend": function () {
							// IE7 and IE8 may not update the value right
							// until after click event - issue #238
							var selHtml = $el.find(":selected").html();

							if ($span.html() !== selHtml) {
								// Change was detected
								// Fire the change event on the select tag
								$el.trigger('change');
							}
						},
						keyup: function () {
							$span.html($el.find(":selected").html());
						}
					});
					noSelect($span, options);
					return {
						remove: function () {
							// Remove sibling span
							$span.remove();

							// Unwrap parent div
							$el.unwrap().unbind(options.eventNamespace);
							return $el;
						},
						update: function () {
							if (options.selectAutoWidth) {
								// Easier to remove and reapply formatting
								$.uniform.restore($el);
								$el.uniform(options);
							} else {
								classClearStandard($div, options);

								// Reset current selected text
								$span.html($el.find(":selected").html());
								classUpdateDisabled($div, $el, options);
							}
						}
					};
				}
			},
			{
				// Select lists - multiselect lists only
				match: function ($el) {
					if ($el.is("select") && isMultiselect($el)) {
						return true;
					}

					return false;
				},
				apply: function ($el, options) {
					var $wrapper;

					$el.addClass(options.selectMultiClass);
					$wrapper = wrapWithWrapperClass($el, options);
					bindUi($el, $el, options);

					return {
						remove: function () {
							$el.removeClass(options.selectMultiClass);

							if ($wrapper) {
								$el.unwrap();
							}
						},
						update: returnFalse
					};
				}
			},
			{
				// Textareas
				match: function ($el) {
					return $el.is("textarea");
				},
				apply: function ($el, options) {
					var $wrapper;

					$el.addClass(options.textareaClass);
					$wrapper = wrapWithWrapperClass($el, options);
					bindUi($el, $el, options);

					return {
						remove: function () {
							$el.removeClass(options.textareaClass);

							if ($wrapper) {
								$el.unwrap();
							}
						},
						update: returnFalse
					};
				}
			}
		];

	// IE6 can't be styled - can't set opacity on select
	if (isMsie() && !isMsieSevenOrNewer()) {
		allowStyling = false;
	}

	$.uniform = {
		// Default options that can be overridden globally or when uniformed
		// globally:  $.uniform.defaults.fileButtonHtml = "Pick A File";
		// on uniform:  $('input').uniform({fileButtonHtml: "Pick a File"});
		defaults: {
			activeClass: "active",
			autoHide: true,
			buttonClass: "button",
			checkboxClass: "checker",
			checkedClass: "checked",
			disabledClass: "disabled",
			eventNamespace: ".uniform",
			fileButtonClass: "action",
			fileButtonHtml: "选择文件",
			fileClass: "uploader",
			fileDefaultHtml: "未选择文件",
			filenameClass: "filename",
			focusClass: "focus",
			hoverClass: "hover",
			idPrefix: "uniform",
			inputAddTypeAsClass: true,
			inputClass: "uniform-input",
			radioClass: "radio",
			resetDefaultHtml: "Reset",
			resetSelector: false,  // We'll use our own function when you don't specify one
			selectAutoWidth: true,
			selectClass: "selector",
			selectMultiClass: "uniform-multiselect",
			submitDefaultHtml: "Submit",  // Only text allowed
			textareaClass: "uniform",
			useID: true,
			wrapperClass: null
		},

		// All uniformed elements - DOM objects
		elements: []
	};

	$.fn.uniform = function (options) {
		var el = this;
		options = $.extend({}, $.uniform.defaults, options);

		// If we are in high contrast mode, do not allow styling
		if (!highContrastTest) {
			highContrastTest = true;

			if (highContrast()) {
				allowStyling = false;
			}
		}

		// Only uniform on browsers that work
		if (!allowStyling) {
			return this;
		}

		// Code for specifying a reset button
		if (options.resetSelector) {
			$(options.resetSelector).mouseup(function () {
				window.setTimeout(function () {
					$.uniform.update(el);
				}, 10);
			});
		}

		return this.each(function () {
			var $el = $(this), i, handler, callbacks;

			// Avoid uniforming elements already uniformed - just update
			if ($el.data("uniformed")) {
				$.uniform.update($el);
				return;
			}

			// See if we have any handler for this type of element
			for (i = 0; i < uniformHandlers.length; i = i + 1) {
				handler = uniformHandlers[i];

				if (handler.match($el, options)) {
					callbacks = handler.apply($el, options);
					$el.data("uniformed", callbacks);

					// Store element in our global array
					$.uniform.elements.push($el.get(0));
					return;
				}
			}

			// Could not style this element
		});
	};

	$.uniform.restore = $.fn.uniform.restore = function (elem) {
		if (elem === undef) {
			elem = $.uniform.elements;
		}

		$(elem).each(function () {
			var $el = $(this), index, elementData;
			elementData = $el.data("uniformed");

			// Skip elements that are not uniformed
			if (!elementData) {
				return;
			}

			// Unbind events, remove additional markup that was added
			elementData.remove();

			// Remove item from list of uniformed elements
			index = $.inArray(this, $.uniform.elements);

			if (index >= 0) {
				$.uniform.elements.splice(index, 1);
			}

			$el.removeData("uniformed");
		});
	};

	$.uniform.update = $.fn.uniform.update = function (elem) {
		if (elem === undef) {
			elem = $.uniform.elements;
		}

		$(elem).each(function () {
			var $el = $(this), elementData;
			elementData = $el.data("uniformed");

			// Skip elements that are not uniformed
			if (!elementData) {
				return;
			}

			elementData.update($el, elementData.options);
		});
	};
}(jQuery));

/**
 * Chosen.js
 */

// Chosen, a Select Box Enhancer for jQuery and Prototype
// by Patrick Filler for Harvest, http://getharvest.com
//
// Version 0.11.1
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `grunt build`, do not edit it by hand.
(function () {
    var SelectParser;

    SelectParser = (function () {
        function SelectParser() {
            this.options_index = 0;
            this.parsed = [];
        }

        SelectParser.prototype.add_node = function (child) {
            if (child.nodeName.toUpperCase() === "OPTGROUP") {
                return this.add_group(child);
            } else {
                return this.add_option(child);
            }
        };

        SelectParser.prototype.add_group = function (group) {
            var group_position, option, _i, _len, _ref, _results;

            group_position = this.parsed.length;
            this.parsed.push({
                array_index: group_position,
                group: true,
                label: group.label,
                children: 0,
                disabled: group.disabled
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };

        SelectParser.prototype.add_option = function (option, group_position, group_disabled) {
            if (option.nodeName.toUpperCase() === "OPTION") {
                if (option.text !== "") {
                    if (group_position != null) {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        html: option.innerHTML,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        classes: option.className,
                        style: option.style.cssText
                    });
                } else {
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };

        return SelectParser;

    })();

    SelectParser.select_to_array = function (select) {
        var child, parser, _i, _len, _ref;

        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };

    this.SelectParser = SelectParser;

}).call(this);

(function () {
    var AbstractChosen, root;

    root = this;

    AbstractChosen = (function () {
        function AbstractChosen(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            if (!AbstractChosen.browser_is_supported()) {
                return;
            }
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
            this.finish_setup();
        }

        AbstractChosen.prototype.set_default_values = function () {
            var _this = this;

            this.click_test_action = function (evt) {
                return _this.test_active_click(evt);
            };
            this.activate_action = function (evt) {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.result_single_selected = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.search_contains = this.options.search_contains || false;
            this.single_backstroke_delete = this.options.single_backstroke_delete || false;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            return this.inherit_select_classes = this.options.inherit_select_classes || false;
        };

        AbstractChosen.prototype.set_default_text = function () {
            if (this.form_field.getAttribute("data-placeholder")) {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            } else if (this.is_multiple) {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
            } else {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
        };

        AbstractChosen.prototype.mouse_enter = function () {
            return this.mouse_on_container = true;
        };

        AbstractChosen.prototype.mouse_leave = function () {
            return this.mouse_on_container = false;
        };

        AbstractChosen.prototype.input_focus = function (evt) {
            var _this = this;

            if (this.is_multiple) {
                if (!this.active_field) {
                    return setTimeout((function () {
                        return _this.container_mousedown();
                    }), 50);
                }
            } else {
                if (!this.active_field) {
                    return this.activate_field();
                }
            }
        };

        AbstractChosen.prototype.input_blur = function (evt) {
            var _this = this;

            if (!this.mouse_on_container) {
                this.active_field = false;
                return setTimeout((function () {
                    return _this.blur_test();
                }), 100);
            }
        };

        AbstractChosen.prototype.result_add_option = function (option) {
            var classes, style;

            option.dom_id = this.container_id + "_o_" + option.array_index;
            classes = [];
            if (!option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("active-result");
            }
            if (option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("disabled-result");
            }
            if (option.selected) {
                classes.push("result-selected");
            }
            if (option.group_array_index != null) {
                classes.push("group-option");
            }
            if (option.classes !== "") {
                classes.push(option.classes);
            }
            style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
            return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
        };

        AbstractChosen.prototype.results_update_field = function () {
            this.set_default_text();
            if (!this.is_multiple) {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.result_single_selected = null;
            return this.results_build();
        };

        AbstractChosen.prototype.results_toggle = function () {
            if (this.results_showing) {
                return this.results_hide();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.results_search = function (evt) {
            if (this.results_showing) {
                return this.winnow_results();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.choices_count = function () {
            var option, _i, _len, _ref;

            if (this.selected_option_count != null) {
                return this.selected_option_count;
            }
            this.selected_option_count = 0;
            _ref = this.form_field.options;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (option.selected) {
                    this.selected_option_count += 1;
                }
            }
            return this.selected_option_count;
        };

        AbstractChosen.prototype.choices_click = function (evt) {
            evt.preventDefault();
            if (!(this.results_showing || this.is_disabled)) {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.keyup_checker = function (evt) {
            var stroke, _ref;

            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke) {
                case 8:
                    if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
                        return this.keydown_backstroke();
                    } else if (!this.pending_backstroke) {
                        this.result_clear_highlight();
                        return this.results_search();
                    }
                    break;
                case 13:
                    evt.preventDefault();
                    if (this.results_showing) {
                        return this.result_select(evt);
                    }
                    break;
                case 27:
                    if (this.results_showing) {
                        this.results_hide();
                    }
                    return true;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                    break;
                default:
                    return this.results_search();
            }
        };

        AbstractChosen.prototype.generate_field_id = function () {
            var new_id;

            new_id = this.generate_random_id();
            this.form_field.id = new_id;
            return new_id;
        };

        AbstractChosen.prototype.generate_random_char = function () {
            var chars, newchar, rand;

            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            rand = Math.floor(Math.random() * chars.length);
            return newchar = chars.substring(rand, rand + 1);
        };

        AbstractChosen.prototype.container_width = function () {
            if (this.options.width != null) {
                return this.options.width;
            } else {
                return  this.form_field.offsetWidth + 10;
            }
        };

        AbstractChosen.browser_is_supported = function () {
            var _ref;

            if (window.navigator.appName === "Microsoft Internet Explorer") {
                return (null !== (_ref = document.documentMode) && _ref >= 8);
            }
            return true;
        };

        AbstractChosen.default_multiple_text = "Select Some Options";

        AbstractChosen.default_single_text = "Select an Option";

        AbstractChosen.default_no_result_text = "No results match";

        return AbstractChosen;

    })();

    root.AbstractChosen = AbstractChosen;

}).call(this);

(function () {
    var $, Chosen, root, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    root = this;

    $ = jQuery;

    $.fn.extend({
        chosen: function (options) {
            if (!AbstractChosen.browser_is_supported()) {
                return this;
            }
            return this.each(function (input_field) {
                var $this;

                $this = $(this);
                if (!$this.hasClass("chzn-done")) {
                    return $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });

    Chosen = (function (_super) {
        __extends(Chosen, _super);

        function Chosen() {
            _ref = Chosen.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        Chosen.prototype.setup = function () {
            this.form_field_jq = $(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
        };

        Chosen.prototype.finish_setup = function () {
            return this.form_field_jq.addClass("chzn-done");
        };

        Chosen.prototype.set_up_html = function () {
            var container_classes, container_props;

            this.container_id = this.form_field.id.length ? this.form_field.id.replace(/[^\w]/g, '_') : this.generate_field_id();
            this.container_id += "_chzn";
            container_classes = ["chzn-container"];
            container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className) {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl) {
                container_classes.push("chzn-rtl");
            }
            container_props = {
                'id': this.container_id,
                'class': container_classes.join(' '),
                'style': "width:" + (this.container_width()) + "px;",
                'title': this.form_field.title
            };
            this.container = $("<div />", container_props);
            if (this.is_multiple) {
                this.container.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop"><ul class="chzn-results"></ul></div>');
            } else {
                this.container.html('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chzn-drop"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
            }
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find('div.chzn-drop').first();
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chzn-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple) {
                this.search_choices = this.container.find('ul.chzn-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.search_container = this.container.find('div.chzn-search').first();
                this.selected_item = this.container.find('.chzn-single').first();
            }
            this.results_build();
            this.set_tab_index();
            this.set_label_behavior();
            return this.form_field_jq.trigger("liszt:ready", {
                chosen: this
            });
        };

        Chosen.prototype.register_observers = function () {
            var _this = this;

            this.container.mousedown(function (evt) {
                _this.container_mousedown(evt);
            });
            this.container.mouseup(function (evt) {
                _this.container_mouseup(evt);
            });
            this.container.mouseenter(function (evt) {
                _this.mouse_enter(evt);
            });
            this.container.mouseleave(function (evt) {
                _this.mouse_leave(evt);
            });
            this.search_results.mouseup(function (evt) {
                _this.search_results_mouseup(evt);
            });
            this.search_results.mouseover(function (evt) {
                _this.search_results_mouseover(evt);
            });
            this.search_results.mouseout(function (evt) {
                _this.search_results_mouseout(evt);
            });
            this.search_results.bind('mousewheel DOMMouseScroll', function (evt) {
                _this.search_results_mousewheel(evt);
            });
            this.form_field_jq.bind("liszt:updated", function (evt) {
                _this.results_update_field(evt);
            });
            this.form_field_jq.bind("liszt:activate", function (evt) {
                _this.activate_field(evt);
            });
            this.form_field_jq.bind("liszt:open", function (evt) {
                _this.container_mousedown(evt);
            });
            this.search_field.blur(function (evt) {
                _this.input_blur(evt);
            });
            this.search_field.keyup(function (evt) {
                _this.keyup_checker(evt);
            });
            this.search_field.keydown(function (evt) {
                _this.keydown_checker(evt);
            });
            this.search_field.focus(function (evt) {
                _this.input_focus(evt);
            });
            if (this.is_multiple) {
                return this.search_choices.click(function (evt) {
                    _this.choices_click(evt);
                });
            } else {
                return this.container.click(function (evt) {
                    evt.preventDefault();
                });
            }
        };

        Chosen.prototype.search_field_disabled = function () {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled) {
                this.container.addClass('chzn-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple) {
                    this.selected_item.unbind("focus", this.activate_action);
                }
                return this.close_field();
            } else {
                this.container.removeClass('chzn-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple) {
                    return this.selected_item.bind("focus", this.activate_action);
                }
            }
        };

        Chosen.prototype.container_mousedown = function (evt) {
            if (!this.is_disabled) {
                if (evt && evt.type === "mousedown" && !this.results_showing) {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
                    if (!this.active_field) {
                        if (this.is_multiple) {
                            this.search_field.val("");
                        }
                        $(document).click(this.click_test_action);
                        this.results_show();
                    } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chzn-single").length)) {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };

        Chosen.prototype.container_mouseup = function (evt) {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
                return this.results_reset(evt);
            }
        };

        Chosen.prototype.search_results_mousewheel = function (evt) {
            var delta, _ref1, _ref2;

            delta = -((_ref1 = evt.originalEvent) != null ? _ref1.wheelDelta : void 0) || ((_ref2 = evt.originialEvent) != null ? _ref2.detail : void 0);
            if (delta != null) {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll') {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };

        Chosen.prototype.blur_test = function (evt) {
            if (!this.active_field && this.container.hasClass("chzn-container-active")) {
                return this.close_field();
            }
        };

        Chosen.prototype.close_field = function () {
            $(document).unbind("click", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chzn-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };

        Chosen.prototype.activate_field = function () {
            this.container.addClass("chzn-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };

        Chosen.prototype.test_active_click = function (evt) {
            if ($(evt.target).parents('#' + this.container_id).length) {
                return this.active_field = true;
            } else {
                return this.close_field();
            }
        };

        Chosen.prototype.results_build = function () {
            var content, data, _i, _len, _ref1;

            this.parsing = true;
            this.selected_option_count = null;
            this.results_data = root.SelectParser.select_to_array(this.form_field);
            if (this.is_multiple) {
                this.search_choices.find("li.search-choice").remove();
            } else if (!this.is_multiple) {
                this.selected_item.addClass("chzn-default").find("span").text(this.default_text);
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                    this.search_field[0].readOnly = true;
                    this.container.addClass("chzn-container-single-nosearch");
                } else {
                    this.search_field[0].readOnly = false;
                    this.container.removeClass("chzn-container-single-nosearch");
                }
            }
            content = '';
            _ref1 = this.results_data;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                data = _ref1[_i];
                if (data.group) {
                    content += this.result_add_group(data);
                } else if (!data.empty) {
                    content += this.result_add_option(data);
                    if (data.selected && this.is_multiple) {
                        this.choice_build(data);
                    } else if (data.selected && !this.is_multiple) {
                        this.selected_item.removeClass("chzn-default").find("span").text(data.text);
                        if (this.allow_single_deselect) {
                            this.single_deselect_control_build();
                        }
                    }
                }
            }
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            this.search_results.html(content);
            return this.parsing = false;
        };

        Chosen.prototype.result_add_group = function (group) {
            group.dom_id = this.container_id + "_g_" + group.array_index;
            return '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>';
        };

        Chosen.prototype.result_do_highlight = function (el) {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;

            if (el.length) {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom) {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                } else if (high_top < visible_top) {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };

        Chosen.prototype.result_clear_highlight = function () {
            if (this.result_highlight) {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };

        Chosen.prototype.results_show = function () {
            if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                this.form_field_jq.trigger("liszt:maxselected", {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chzn-with-drop");
            this.form_field_jq.trigger("liszt:showing_dropdown", {
                chosen: this
            });
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            return this.winnow_results();
        };

        Chosen.prototype.results_hide = function () {
            if (this.results_showing) {
                this.result_clear_highlight();
                this.container.removeClass("chzn-with-drop");
                this.form_field_jq.trigger("liszt:hiding_dropdown", {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };

        Chosen.prototype.set_tab_index = function (el) {
            var ti;

            if (this.form_field_jq.attr("tabindex")) {
                ti = this.form_field_jq.attr("tabindex");
                this.form_field_jq.attr("tabindex", -1);
                return this.search_field.attr("tabindex", ti);
            }
        };

        Chosen.prototype.set_label_behavior = function () {
            var _this = this;

            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length) {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0) {
                return this.form_field_label.click(function (evt) {
                    if (_this.is_multiple) {
                        return _this.container_mousedown(evt);
                    } else {
                        return _this.activate_field();
                    }
                });
            }
        };

        Chosen.prototype.show_search_field_default = function () {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            } else {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };

        Chosen.prototype.search_results_mouseup = function (evt) {
            var target;

            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length) {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };

        Chosen.prototype.search_results_mouseover = function (evt) {
            var target;

            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target) {
                return this.result_do_highlight(target);
            }
        };

        Chosen.prototype.search_results_mouseout = function (evt) {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
                return this.result_clear_highlight();
            }
        };

        Chosen.prototype.choice_build = function (item) {
            var choice, close_link,
                _this = this;

            choice = $('<li />', {
                "class": "search-choice"
            }).html("<span>" + item.html + "</span>");
            if (item.disabled) {
                choice.addClass('search-choice-disabled');
            } else {
                close_link = $('<a />', {
                    href: '#',
                    "class": 'search-choice-close',
                    rel: item.array_index
                });
                close_link.click(function (evt) {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };

        Chosen.prototype.choice_destroy_link_click = function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled) {
                return this.choice_destroy($(evt.target));
            }
        };

        Chosen.prototype.choice_destroy = function (link) {
            if (this.result_deselect(link.attr("rel"))) {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };

        Chosen.prototype.results_reset = function () {
            this.form_field.options[0].selected = true;
            this.selected_option_count = null;
            this.selected_item.find("span").text(this.default_text);
            if (!this.is_multiple) {
                this.selected_item.addClass("chzn-default");
            }
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) {
                return this.results_hide();
            }
        };

        Chosen.prototype.results_reset_cleanup = function () {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };

        Chosen.prototype.result_select = function (evt) {
            var high, high_id, item, position;

            if (this.result_highlight) {
                high = this.result_highlight;
                high_id = high.attr("id");
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                    this.form_field_jq.trigger("liszt:maxselected", {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple) {
                    high.removeClass("active-result");
                } else {
                    this.search_results.find(".result-selected").removeClass("result-selected");
                    this.result_single_selected = high;
                    this.selected_item.removeClass("chzn-default");
                }
                high.addClass("result-selected");
                position = high_id.substr(high_id.lastIndexOf("_") + 1);
                item = this.results_data[position];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple) {
                    this.choice_build(item);
                } else {
                    this.selected_item.find("span").first().text(item.text);
                    if (this.allow_single_deselect) {
                        this.single_deselect_control_build();
                    }
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
                    this.form_field_jq.trigger("change", {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.search_field_scale();
            }
        };

        Chosen.prototype.result_activate = function (el, option) {
            if (option.disabled) {
                return el.addClass("disabled-result");
            } else if (this.is_multiple && option.selected) {
                return el.addClass("result-selected");
            } else {
                return el.addClass("active-result");
            }
        };

        Chosen.prototype.result_deactivate = function (el) {
            return el.removeClass("active-result result-selected disabled-result");
        };

        Chosen.prototype.result_deselect = function (pos) {
            var result, result_data;

            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled) {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                result = $("#" + this.container_id + "_o_" + pos);
                result.removeClass("result-selected").addClass("active-result").show();
                this.result_clear_highlight();
                this.winnow_results();
                this.form_field_jq.trigger("change", {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            } else {
                return false;
            }
        };

        Chosen.prototype.single_deselect_control_build = function () {
            if (!this.allow_single_deselect) {
                return;
            }
            if (!this.selected_item.find("abbr").length) {
                this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
            return this.selected_item.addClass("chzn-single-with-deselect");
        };

        Chosen.prototype.winnow_results = function () {
            var found, option, part, parts, regex, regexAnchor, result, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len1, _ref1;

            this.no_results_clear();
            results = 0;
            searchText = this.search_field.val() === this.default_text ? "" : $('<div/>').text($.trim(this.search_field.val())).html();
            regexAnchor = this.search_contains ? "" : "^";
            regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            _ref1 = this.results_data;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                option = _ref1[_i];
                if (!option.empty) {
                    if (option.group) {
                        $('#' + option.dom_id).css('display', 'none');
                    } else {
                        found = false;
                        result_id = option.dom_id;
                        result = $("#" + result_id);
                        if (regex.test(option.html)) {
                            found = true;
                            results += 1;
                        } else if (this.enable_split_word_search && (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0)) {
                            parts = option.html.replace(/\[|\]/g, "").split(" ");
                            if (parts.length) {
                                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                                    part = parts[_j];
                                    if (regex.test(part)) {
                                        found = true;
                                        results += 1;
                                    }
                                }
                            }
                        }
                        if (found) {
                            if (searchText.length) {
                                startpos = option.html.search(zregex);
                                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            } else {
                                text = option.html;
                            }
                            result.html(text);
                            this.result_activate(result, option);
                            if (option.group_array_index != null) {
                                $("#" + this.results_data[option.group_array_index].dom_id).css('display', 'list-item');
                            }
                        } else {
                            if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                                this.result_clear_highlight();
                            }
                            this.result_deactivate(result);
                        }
                    }
                }
            }
            if (results < 1 && searchText.length) {
                return this.no_results(searchText);
            } else {
                return this.winnow_results_set_highlight();
            }
        };

        Chosen.prototype.winnow_results_set_highlight = function () {
            var do_high, selected_results;

            if (!this.result_highlight) {
                selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
                do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
                if (do_high != null) {
                    return this.result_do_highlight(do_high);
                }
            }
        };

        Chosen.prototype.no_results = function (terms) {
            var no_results_html;

            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            return this.search_results.append(no_results_html);
        };

        Chosen.prototype.no_results_clear = function () {
            return this.search_results.find(".no-results").remove();
        };

        Chosen.prototype.keydown_arrow = function () {
            var next_sib;

            if (this.results_showing && this.result_highlight) {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib) {
                    return this.result_do_highlight(next_sib);
                }
            } else {
                return this.results_show();
            }
        };

        Chosen.prototype.keyup_arrow = function () {
            var prev_sibs;

            if (!this.results_showing && !this.is_multiple) {
                return this.results_show();
            } else if (this.result_highlight) {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length) {
                    return this.result_do_highlight(prev_sibs.first());
                } else {
                    if (this.choices_count() > 0) {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };

        Chosen.prototype.keydown_backstroke = function () {
            var next_available_destroy;

            if (this.pending_backstroke) {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            } else {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete) {
                        return this.keydown_backstroke();
                    } else {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };

        Chosen.prototype.clear_backstroke = function () {
            if (this.pending_backstroke) {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };

        Chosen.prototype.keydown_checker = function (evt) {
            var stroke, _ref1;

            stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke) {
                this.clear_backstroke();
            }
            switch (stroke) {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    if (this.results_showing && !this.is_multiple) {
                        this.result_select(evt);
                    }
                    this.mouse_on_container = false;
                    break;
                case 13:
                    evt.preventDefault();
                    break;
                case 38:
                    evt.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    evt.preventDefault();
                    this.keydown_arrow();
                    break;
            }
        };

        Chosen.prototype.search_field_scale = function () {
            var div, h, style, style_block, styles, w, _i, _len;

            if (this.is_multiple) {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++) {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />', {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                if (!this.f_width) {
                    this.f_width = this.container.outerWidth();
                }
                if (w > this.f_width - 10) {
                    w = this.f_width - 10;
                }
                return this.search_field.css({
                    'width': w + 'px'
                });
            }
        };

        Chosen.prototype.generate_random_id = function () {
            var string;

            string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
            while ($("#" + string).length > 0) {
                string += this.generate_random_char();
            }
            return string;
        };

        return Chosen;

    })(AbstractChosen);

    root.Chosen = Chosen;

}).call(this);


/*!
 CLEditor WYSIWYG HTML Editor v1.4.3
 http://premiumsoftware.net/CLEditor
 requires jQuery v1.4.2 or later

 Copyright 2010, Chris Landowski, Premium Software, LLC
 Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function ($) {

    //==============
    // jQuery Plugin
    //==============

    $.cleditor = {

        // Define the defaults used for all new cleditor instances
        defaultOptions: {
            width: 'auto', // width not including margins, borders or padding
            height: 250, // height not including margins, borders or padding
            controls:     // controls to add to the toolbar
                "bold italic underline strikethrough subscript superscript | font size " +
                    "style | color highlight removeformat | bullets numbering | outdent " +
                    "indent | alignleft center alignright justify | undo redo | " +
                    "rule image link unlink | cut copy paste pastetext | print source",
            colors:       // colors in the color popup
                "FFF FCC FC9 FF9 FFC 9F9 9FF CFF CCF FCF " +
                    "CCC F66 F96 FF6 FF3 6F9 3FF 6FF 99F F9F " +
                    "BBB F00 F90 FC6 FF0 3F3 6CC 3CF 66C C6C " +
                    "999 C00 F60 FC3 FC0 3C0 0CC 36F 63F C3C " +
                    "666 900 C60 C93 990 090 399 33F 60C 939 " +
                    "333 600 930 963 660 060 366 009 339 636 " +
                    "000 300 630 633 330 030 033 006 309 303",
            fonts:        // font names in the font popup
                "Arial,Arial Black,Comic Sans MS,Courier New,Narrow,Garamond," +
                    "Georgia,Impact,Sans Serif,Serif,Tahoma,Trebuchet MS,Verdana",
            sizes:        // sizes in the font size popup
                "1,2,3,4,5,6,7",
            styles:       // styles in the style popup
                [
                    ["Paragraph", "<p>"],
                    ["Header 1", "<h1>"],
                    ["Header 2", "<h2>"],
                    ["Header 3", "<h3>"],
                    ["Header 4", "<h4>"],
                    ["Header 5", "<h5>"],
                    ["Header 6", "<h6>"]
                ],
            useCSS: true, // use CSS to style HTML when possible (not supported in ie)
            docType:      // Document type contained within the editor
                '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
            docCSSFile:   // CSS file used to style the document contained within the editor
                "",
            bodyStyle:    // style to assign to document body contained within the editor
                "margin:4px; font:10pt Arial,Verdana; cursor:text"
        },

        // Define all usable toolbar buttons - the init string property is
        //   expanded during initialization back into the buttons object and
        //   seperate object properties are created for each button.
        //   e.g. buttons.size.title = "Font Size"
        buttons: {
            // name,title,command,popupName (""=use name)
            init: "bold,,|" +
                "italic,,|" +
                "underline,,|" +
                "strikethrough,,|" +
                "subscript,,|" +
                "superscript,,|" +
                "font,,fontname,|" +
                "size,Font Size,fontsize,|" +
                "style,,formatblock,|" +
                "color,Font Color,forecolor,|" +
                "highlight,Text Highlight Color,hilitecolor,color|" +
                "removeformat,Remove Formatting,|" +
                "bullets,,insertunorderedlist|" +
                "numbering,,insertorderedlist|" +
                "outdent,,|" +
                "indent,,|" +
                "alignleft,Align Text Left,justifyleft|" +
                "center,,justifycenter|" +
                "alignright,Align Text Right,justifyright|" +
                "justify,,justifyfull|" +
                "undo,,|" +
                "redo,,|" +
                "rule,Insert Horizontal Rule,inserthorizontalrule|" +
                "image,Insert Image,insertimage,url|" +
                "link,Insert Hyperlink,createlink,url|" +
                "unlink,Remove Hyperlink,|" +
                "cut,,|" +
                "copy,,|" +
                "paste,,|" +
                "pastetext,Paste as Text,inserthtml,|" +
                "print,,|" +
                "source,Show Source"
        },

        // imagesPath - returns the path to the images folder
        imagesPath: function () {
            return imagesPath();
        }

    };

    // cleditor - creates a new editor for each of the matched textareas
    $.fn.cleditor = function (options) {

        // Create a new jQuery object to hold the results
        var $result = $([]);

        // Loop through all matching textareas and create the editors
        this.each(function (idx, elem) {
            if (elem.tagName.toUpperCase() == "TEXTAREA") {
                var data = $.data(elem, CLEDITOR);
                if (!data) data = new cleditor(elem, options);
                $result = $result.add(data);
            }
        });

        // return the new jQuery object
        return $result;

    };

    //==================
    // Private Variables
    //==================

    var

    // Misc constants
        BACKGROUND_COLOR = "backgroundColor",
        BUTTON = "button",
        BUTTON_NAME = "buttonName",
        CHANGE = "change",
        CLEDITOR = "cleditor",
        CLICK = "click",
        DISABLED = "disabled",
        DIV_TAG = "<div>",
        TRANSPARENT = "transparent",
        UNSELECTABLE = "unselectable",

    // Class name constants
        MAIN_CLASS = "cleditorMain",    // main containing div
        TOOLBAR_CLASS = "cleditorToolbar", // toolbar div inside main div
        GROUP_CLASS = "cleditorGroup",   // group divs inside the toolbar div
        BUTTON_CLASS = "cleditorButton",  // button divs inside group div
        DISABLED_CLASS = "cleditorDisabled",// disabled button divs
        DIVIDER_CLASS = "cleditorDivider", // divider divs inside group div
        POPUP_CLASS = "cleditorPopup",   // popup divs inside body
        LIST_CLASS = "cleditorList",    // list popup divs inside body
        COLOR_CLASS = "cleditorColor",   // color popup div inside body
        PROMPT_CLASS = "cleditorPrompt",  // prompt popup divs inside body
        MSG_CLASS = "cleditorMsg",     // message popup div inside body

    // Browser detection
        ua = navigator.userAgent.toLowerCase(),
        ie = /msie/.test(ua),
        ie6 = /msie\s6/.test(ua),
        webkit = /webkit/.test(ua),

    // Test for iPhone/iTouch/iPad
        iOS = /iphone|ipad|ipod/i.test(ua),

    // Popups are created once as needed and shared by all editor instances
        popups = {},

    // Used to prevent the document click event from being bound more than once
        documentClickAssigned,

    // Local copy of the buttons object
        buttons = $.cleditor.buttons;

    //===============
    // Initialization
    //===============

    // Expand the buttons.init string back into the buttons object
    //   and create seperate object properties for each button.
    //   e.g. buttons.size.title = "Font Size"
    $.each(buttons.init.split("|"), function (idx, button) {
        var items = button.split(","), name = items[0];
        buttons[name] = {
            stripIndex: idx,
            name: name,
            title: items[1] === "" ? name.charAt(0).toUpperCase() + name.substr(1) : items[1],
            command: items[2] === "" ? name : items[2],
            popupName: items[3] === "" ? name : items[3]
        };
    });
    delete buttons.init;

    //============
    // Constructor
    //============

    // cleditor - creates a new editor for the passed in textarea element
    cleditor = function (area, options) {

        var editor = this;

        // Get the defaults and override with options
        editor.options = options = $.extend({}, $.cleditor.defaultOptions, options);

        // Hide the textarea and associate it with this editor
        var $area = editor.$area = $(area)
            .hide()
            .data(CLEDITOR, editor)
            .blur(function () {
                // Update the iframe when the textarea loses focus
                updateFrame(editor, true);
            });

        // Create the main container and append the textarea
        var $main = editor.$main = $(DIV_TAG)
            .addClass(MAIN_CLASS)
            .width(options.width)
            .height(options.height);

        // Create the toolbar
        var $toolbar = editor.$toolbar = $(DIV_TAG)
            .addClass(TOOLBAR_CLASS)
            .appendTo($main);

        // Add the first group to the toolbar
        var $group = $(DIV_TAG)
            .addClass(GROUP_CLASS)
            .appendTo($toolbar);

        // Initialize the group width
        var groupWidth = 0;

        // Add the buttons to the toolbar
        $.each(options.controls.split(" "), function (idx, buttonName) {
            if (buttonName === "") return true;

            // Divider
            if (buttonName == "|") {

                // Add a new divider to the group
                var $div = $(DIV_TAG)
                    .addClass(DIVIDER_CLASS)
                    .appendTo($group);

                // Update the group width
                $group.width(groupWidth + 1);
                groupWidth = 0;

                // Create a new group
                $group = $(DIV_TAG)
                    .addClass(GROUP_CLASS)
                    .appendTo($toolbar);

            }

            // Button
            else {

                // Get the button definition
                var button = buttons[buttonName];

                // Add a new button to the group
                var $buttonDiv = $(DIV_TAG)
                    .data(BUTTON_NAME, button.name)
                    .addClass(BUTTON_CLASS)
                    .attr("title", button.title)
                    .bind(CLICK, $.proxy(buttonClick, editor))
                    .appendTo($group)
                    .hover(hoverEnter, hoverLeave);

                // Update the group width
                groupWidth += 24;
                $group.width(groupWidth + 1);

                // Prepare the button image
                var map = {};
                if (button.css) map = button.css;
                else if (button.image) map.backgroundImage = imageUrl(button.image);
                if (button.stripIndex) map.backgroundPosition = button.stripIndex * -24;
                $buttonDiv.css(map);

                // Add the unselectable attribute for ie
                if (ie)
                    $buttonDiv.attr(UNSELECTABLE, "on");

                // Create the popup
                if (button.popupName)
                    createPopup(button.popupName, options, button.popupClass,
                        button.popupContent, button.popupHover);

            }

        });

        // Add the main div to the DOM and append the textarea
        $main.insertBefore($area)
            .append($area);

        // Bind the document click event handler
        if (!documentClickAssigned) {
            $(document).click(function (e) {
                // Dismiss all non-prompt popups
                var $target = $(e.target);
                if (!$target.add($target.parents()).is("." + PROMPT_CLASS))
                    hidePopups();
            });
            documentClickAssigned = true;
        }

        // Bind the window resize event when the width or height is auto or %
        if (/auto|%/.test("" + options.width + options.height))
            $(window).bind('resize.cleditor', function () {
                refresh(editor);
            });

        // Create the iframe and resize the controls
        refresh(editor);

    };

    //===============
    // Public Methods
    //===============

    var fn = cleditor.prototype,

    // Expose the following private functions as methods on the cleditor object.
    // The closure compiler will rename the private functions. However, the
    // exposed method names on the cleditor object will remain fixed.
        methods = [
            ["clear", clear],
            ["disable", disable],
            ["execCommand", execCommand],
            ["focus", focus],
            ["hidePopups", hidePopups],
            ["sourceMode", sourceMode, true],
            ["refresh", refresh],
            ["select", select],
            ["selectedHTML", selectedHTML, true],
            ["selectedText", selectedText, true],
            ["showMessage", showMessage],
            ["updateFrame", updateFrame],
            ["updateTextArea", updateTextArea]
        ];

    $.each(methods, function (idx, method) {
        fn[method[0]] = function () {
            var editor = this, args = [editor];
            // using each here would cast booleans into objects!
            for (var x = 0; x < arguments.length; x++) {
                args.push(arguments[x]);
            }
            var result = method[1].apply(editor, args);
            if (method[2]) return result;
            return editor;
        };
    });

    // change - shortcut for .bind("change", handler) or .trigger("change")
    fn.change = function (handler) {
        var $this = $(this);
        return handler ? $this.bind(CHANGE, handler) : $this.trigger(CHANGE);
    };

    //===============
    // Event Handlers
    //===============

    // buttonClick - click event handler for toolbar buttons
    function buttonClick(e) {

        var editor = this,
            buttonDiv = e.target,
            buttonName = $.data(buttonDiv, BUTTON_NAME),
            button = buttons[buttonName],
            popupName = button.popupName,
            popup = popups[popupName];

        // Check if disabled
        if (editor.disabled || $(buttonDiv).attr(DISABLED) == DISABLED)
            return;

        // Fire the buttonClick event
        var data = {
            editor: editor,
            button: buttonDiv,
            buttonName: buttonName,
            popup: popup,
            popupName: popupName,
            command: button.command,
            useCSS: editor.options.useCSS
        };

        if (button.buttonClick && button.buttonClick(e, data) === false)
            return false;

        // Toggle source
        if (buttonName == "source") {

            // Show the iframe
            if (sourceMode(editor)) {
                delete editor.range;
                editor.$area.hide();
                editor.$frame.show();
                buttonDiv.title = button.title;
            }

            // Show the textarea
            else {
                editor.$frame.hide();
                editor.$area.show();
                buttonDiv.title = "Show Rich Text";
            }

            // Enable or disable the toolbar buttons
            // IE requires the timeout
            setTimeout(function () {
                refreshButtons(editor);
            }, 100);

        }

        // Check for rich text mode
        else if (!sourceMode(editor)) {

            // Handle popups
            if (popupName) {
                var $popup = $(popup);

                // URL
                if (popupName == "url") {

                    // Check for selection before showing the link url popup
                    if (buttonName == "link" && selectedText(editor) === "") {
                        showMessage(editor, "A selection is required when inserting a link.", buttonDiv);
                        return false;
                    }

                    // Wire up the submit button click event handler
                    $popup.children(":button")
                        .unbind(CLICK)
                        .bind(CLICK, function () {

                            // Insert the image or link if a url was entered
                            var $text = $popup.find(":text"),
                                url = $.trim($text.val());
                            if (url !== "")
                                execCommand(editor, data.command, url, null, data.button);

                            // Reset the text, hide the popup and set focus
                            $text.val("http://");
                            hidePopups();
                            focus(editor);

                        });

                }

                // Paste as Text
                else if (popupName == "pastetext") {

                    // Wire up the submit button click event handler
                    $popup.children(":button")
                        .unbind(CLICK)
                        .bind(CLICK, function () {

                            // Insert the unformatted text replacing new lines with break tags
                            var $textarea = $popup.find("textarea"),
                                text = $textarea.val().replace(/\n/g, "<br />");
                            if (text !== "")
                                execCommand(editor, data.command, text, null, data.button);

                            // Reset the text, hide the popup and set focus
                            $textarea.val("");
                            hidePopups();
                            focus(editor);

                        });

                }

                // Show the popup if not already showing for this button
                if (buttonDiv !== $.data(popup, BUTTON)) {
                    showPopup(editor, popup, buttonDiv);
                    return false; // stop propagination to document click
                }

                // propaginate to document click
                return;

            }

            // Print
            else if (buttonName == "print")
                editor.$frame[0].contentWindow.print();

            // All other buttons
            else if (!execCommand(editor, data.command, data.value, data.useCSS, buttonDiv))
                return false;

        }

        // Focus the editor
        focus(editor);

    }

    // hoverEnter - mouseenter event handler for buttons and popup items
    function hoverEnter(e) {
        var $div = $(e.target).closest("div");
        $div.css(BACKGROUND_COLOR, $div.data(BUTTON_NAME) ? "#FFF" : "#FFC");
    }

    // hoverLeave - mouseleave event handler for buttons and popup items
    function hoverLeave(e) {
        $(e.target).closest("div").css(BACKGROUND_COLOR, "transparent");
    }

    // popupClick - click event handler for popup items
    function popupClick(e) {

        var editor = this,
            popup = e.data.popup,
            target = e.target;

        // Check for message and prompt popups
        if (popup === popups.msg || $(popup).hasClass(PROMPT_CLASS))
            return;

        // Get the button info
        var buttonDiv = $.data(popup, BUTTON),
            buttonName = $.data(buttonDiv, BUTTON_NAME),
            button = buttons[buttonName],
            command = button.command,
            value,
            useCSS = editor.options.useCSS;

        // Get the command value
        if (buttonName == "font")
        // Opera returns the fontfamily wrapped in quotes
            value = target.style.fontFamily.replace(/"/g, "");
        else if (buttonName == "size") {
            if (target.tagName.toUpperCase() == "DIV")
                target = target.children[0];
            value = target.innerHTML;
        }
        else if (buttonName == "style")
            value = "<" + target.tagName + ">";
        else if (buttonName == "color")
            value = hex(target.style.backgroundColor);
        else if (buttonName == "highlight") {
            value = hex(target.style.backgroundColor);
            if (ie) command = 'backcolor';
            else useCSS = true;
        }

        // Fire the popupClick event
        var data = {
            editor: editor,
            button: buttonDiv,
            buttonName: buttonName,
            popup: popup,
            popupName: button.popupName,
            command: command,
            value: value,
            useCSS: useCSS
        };

        if (button.popupClick && button.popupClick(e, data) === false)
            return;

        // Execute the command
        if (data.command && !execCommand(editor, data.command, data.value, data.useCSS, buttonDiv))
            return false;

        // Hide the popup and focus the editor
        hidePopups();
        focus(editor);

    }

    //==================
    // Private Functions
    //==================

    // checksum - returns a checksum using the Adler-32 method
    function checksum(text) {
        var a = 1, b = 0;
        for (var index = 0; index < text.length; ++index) {
            a = (a + text.charCodeAt(index)) % 65521;
            b = (b + a) % 65521;
        }
        return (b << 16) | a;
    }

    // clear - clears the contents of the editor
    function clear(editor) {
        editor.$area.val("");
        updateFrame(editor);
    }

    // createPopup - creates a popup and adds it to the body
    function createPopup(popupName, options, popupTypeClass, popupContent, popupHover) {

        // Check if popup already exists
        if (popups[popupName])
            return popups[popupName];

        // Create the popup
        var $popup = $(DIV_TAG)
            .hide()
            .addClass(POPUP_CLASS)
            .appendTo("body");

        // Add the content

        // Custom popup
        if (popupContent)
            $popup.html(popupContent);

        // Color
        else if (popupName == "color") {
            var colors = options.colors.split(" ");
            if (colors.length < 10)
                $popup.width("auto");
            $.each(colors, function (idx, color) {
                $(DIV_TAG).appendTo($popup)
                    .css(BACKGROUND_COLOR, "#" + color);
            });
            popupTypeClass = COLOR_CLASS;
        }

        // Font
        else if (popupName == "font")
            $.each(options.fonts.split(","), function (idx, font) {
                $(DIV_TAG).appendTo($popup)
                    .css("fontFamily", font)
                    .html(font);
            });

        // Size
        else if (popupName == "size")
            $.each(options.sizes.split(","), function (idx, size) {
                $(DIV_TAG).appendTo($popup)
                    .html('<font size="' + size + '">' + size + '</font>');
            });

        // Style
        else if (popupName == "style")
            $.each(options.styles, function (idx, style) {
                $(DIV_TAG).appendTo($popup)
                    .html(style[1] + style[0] + style[1].replace("<", "</"));
            });

        // URL
        else if (popupName == "url") {
            $popup.html('Enter URL:<br /><input type="text" value="http://" size="35" /><br /><input type="button" value="Submit" />');
            popupTypeClass = PROMPT_CLASS;
        }

        // Paste as Text
        else if (popupName == "pastetext") {
            $popup.html('Paste your content here and click submit.<br /><textarea cols="40" rows="3"></textarea><br /><input type="button" value="Submit" />');
            popupTypeClass = PROMPT_CLASS;
        }

        // Add the popup type class name
        if (!popupTypeClass && !popupContent)
            popupTypeClass = LIST_CLASS;
        $popup.addClass(popupTypeClass);

        // Add the unselectable attribute to all items
        if (ie) {
            $popup.attr(UNSELECTABLE, "on")
                .find("div,font,p,h1,h2,h3,h4,h5,h6")
                .attr(UNSELECTABLE, "on");
        }

        // Add the hover effect to all items
        if ($popup.hasClass(LIST_CLASS) || popupHover === true)
            $popup.children().hover(hoverEnter, hoverLeave);

        // Add the popup to the array and return it
        popups[popupName] = $popup[0];
        return $popup[0];

    }

    // disable - enables or disables the editor
    function disable(editor, disabled) {

        // Update the textarea and save the state
        if (disabled) {
            editor.$area.attr(DISABLED, DISABLED);
            editor.disabled = true;
        }
        else {
            editor.$area.removeAttr(DISABLED);
            delete editor.disabled;
        }

        // Switch the iframe into design mode.
        // ie6 does not support designMode.
        // ie7 & ie8 do not properly support designMode="off".
        try {
            if (ie) editor.doc.body.contentEditable = !disabled;
            else editor.doc.designMode = !disabled ? "on" : "off";
        }
            // Firefox 1.5 throws an exception that can be ignored
            // when toggling designMode from off to on.
        catch (err) {
        }

        // Enable or disable the toolbar buttons
        refreshButtons(editor);

    }

    // execCommand - executes a designMode command
    function execCommand(editor, command, value, useCSS, button) {

        // Restore the current ie selection
        restoreRange(editor);

        // Set the styling method
        if (!ie) {
            if (useCSS === undefined || useCSS === null)
                useCSS = editor.options.useCSS;
            editor.doc.execCommand("styleWithCSS", 0, useCSS.toString());
        }

        // Execute the command and check for error
        var success = true, message;
        if (ie && command.toLowerCase() == "inserthtml")
            getRange(editor).pasteHTML(value);
        else {
            try {
                success = editor.doc.execCommand(command, 0, value || null);
            }
            catch (err) {
                message = err.message;
                success = false;
            }
            if (!success) {
                if ("cutcopypaste".indexOf(command) > -1)
                    showMessage(editor, "For security reasons, your browser does not support the " +
                        command + " command. Try using the keyboard shortcut or context menu instead.",
                        button);
                else
                    showMessage(editor,
                        (message ? message : "Error executing the " + command + " command."),
                        button);
            }
        }

        // Enable the buttons and update the textarea
        refreshButtons(editor);
        updateTextArea(editor, true);
        return success;

    }

    // focus - sets focus to either the textarea or iframe
    function focus(editor) {
        setTimeout(function () {
            if (sourceMode(editor)) editor.$area.focus();
            else editor.$frame[0].contentWindow.focus();
            refreshButtons(editor);
        }, 0);
    }

    // getRange - gets the current text range object
    function getRange(editor) {
        if (ie) return getSelection(editor).createRange();
        return getSelection(editor).getRangeAt(0);
    }

    // getSelection - gets the current text range object
    function getSelection(editor) {
        if (ie) return editor.doc.selection;
        return editor.$frame[0].contentWindow.getSelection();
    }

    // hex - returns the hex value for the passed in color string
    function hex(s) {

        // hex("rgb(255, 0, 0)") returns #FF0000
        var m = /rgba?\((\d+), (\d+), (\d+)/.exec(s);
        if (m) {
            s = (m[1] << 16 | m[2] << 8 | m[3]).toString(16);
            while (s.length < 6)
                s = "0" + s;
            return "#" + s;
        }

        // hex("#F00") returns #FF0000
        var c = s.split("");
        if (s.length == 4)
            return "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];

        // hex("#FF0000") returns #FF0000
        return s;

    }

    // hidePopups - hides all popups
    function hidePopups() {
        $.each(popups, function (idx, popup) {
            $(popup)
                .hide()
                .unbind(CLICK)
                .removeData(BUTTON);
        });
    }

    // imagesPath - returns the path to the images folder
    function imagesPath() {
        var href = $("link[href*=cleditor]").attr("href");
        return href.replace(/^(.*\/)[^\/]+$/, '$1') + "images/";
    }

    // imageUrl - Returns the css url string for a filemane
    function imageUrl(filename) {
        return "url(" + imagesPath() + filename + ")";
    }

    // refresh - creates the iframe and resizes the controls
    function refresh(editor) {

        var $main = editor.$main,
            options = editor.options;

        // Remove the old iframe
        if (editor.$frame)
            editor.$frame.remove();

        // Create a new iframe
        var $frame = editor.$frame = $('<iframe frameborder="0" src="javascript:true;" />')
            .hide()
            .appendTo($main);

        // Load the iframe document content
        var contentWindow = $frame[0].contentWindow,
            doc = editor.doc = contentWindow.document,
            $doc = $(doc);

        doc.open();
        doc.write(
            options.docType +
                '<html>' +
                ((options.docCSSFile === '') ? '' : '<head><link rel="stylesheet" type="text/css" href="' + options.docCSSFile + '" /></head>') +
                '<body style="' + options.bodyStyle + '"></body></html>'
        );
        doc.close();

        // Work around for bug in IE which causes the editor to lose
        // focus when clicking below the end of the document.
        if (ie)
            $doc.click(function () {
                focus(editor);
            });

        // Load the content
        updateFrame(editor);

        // Bind the ie specific iframe event handlers
        if (ie) {

            // Save the current user selection. This code is needed since IE will
            // reset the selection just after the beforedeactivate event and just
            // before the beforeactivate event.
            $doc.bind("beforedeactivate beforeactivate selectionchange keypress", function (e) {

                // Flag the editor as inactive
                if (e.type == "beforedeactivate")
                    editor.inactive = true;

                // Get rid of the bogus selection and flag the editor as active
                else if (e.type == "beforeactivate") {
                    if (!editor.inactive && editor.range && editor.range.length > 1)
                        editor.range.shift();
                    delete editor.inactive;
                }

                // Save the selection when the editor is active
                else if (!editor.inactive) {
                    if (!editor.range)
                        editor.range = [];
                    editor.range.unshift(getRange(editor));

                    // We only need the last 2 selections
                    while (editor.range.length > 2)
                        editor.range.pop();
                }

            });

            // Restore the text range when the iframe gains focus
            $frame.focus(function () {
                restoreRange(editor);
            });

        }

        // Enable the toolbar buttons and update the textarea as the user types or clicks
        $doc.click(hidePopups)
            .bind("keyup mouseup", function () {
                refreshButtons(editor);
                updateTextArea(editor, true);
            });

        // Show the textarea for iPhone/iTouch/iPad or
        // the iframe when design mode is supported.
        if (iOS) editor.$area.show();
        else $frame.show();

        // Wait for the layout to finish - shortcut for $(document).ready()
        $(function () {

            var $toolbar = editor.$toolbar,
                $group = $toolbar.children("div:last"),
                wid = $main.width();

            // Resize the toolbar
            var hgt = $group.offset().top + $group.outerHeight() - $toolbar.offset().top + 1;
            $toolbar.height(hgt);

            // Resize the iframe
            hgt = (/%/.test("" + options.height) ? $main.height() : parseInt(options.height)) - hgt;
            $frame.width(wid).height(hgt);

            // Resize the textarea. IE6 textareas have a 1px top
            // & bottom margin that cannot be removed using css.
            editor.$area.width(wid).height(ie6 ? hgt - 2 : hgt);

            // Switch the iframe into design mode if enabled
            disable(editor, editor.disabled);

            // Enable or disable the toolbar buttons
            refreshButtons(editor);

        });

    }

    // refreshButtons - enables or disables buttons based on availability
    function refreshButtons(editor) {

        // Webkit requires focus before queryCommandEnabled will return anything but false
        if (!iOS && webkit && !editor.focused) {
            editor.$frame[0].contentWindow.focus();
            window.focus();
            editor.focused = true;
        }

        // Get the object used for checking queryCommandEnabled
        var queryObj = editor.doc;
        if (ie) queryObj = getRange(editor);

        // Loop through each button
        var inSourceMode = sourceMode(editor);
        $.each(editor.$toolbar.find("." + BUTTON_CLASS), function (idx, elem) {

            var $elem = $(elem),
                button = $.cleditor.buttons[$.data(elem, BUTTON_NAME)],
                command = button.command,
                enabled = true;

            // Determine the state
            if (editor.disabled)
                enabled = false;
            else if (button.getEnabled) {
                var data = {
                    editor: editor,
                    button: elem,
                    buttonName: button.name,
                    popup: popups[button.popupName],
                    popupName: button.popupName,
                    command: button.command,
                    useCSS: editor.options.useCSS
                };
                enabled = button.getEnabled(data);
                if (enabled === undefined)
                    enabled = true;
            }
            else if (((inSourceMode || iOS) && button.name != "source") ||
                (ie && (command == "undo" || command == "redo")))
                enabled = false;
            else if (command && command != "print") {
                if (ie && command == "hilitecolor")
                    command = "backcolor";
                // IE does not support inserthtml, so it's always enabled
                if (!ie || command != "inserthtml") {
                    try {
                        enabled = queryObj.queryCommandEnabled(command);
                    }
                    catch (err) {
                        enabled = false;
                    }
                }
            }

            // Enable or disable the button
            if (enabled) {
                $elem.removeClass(DISABLED_CLASS);
                $elem.removeAttr(DISABLED);
            }
            else {
                $elem.addClass(DISABLED_CLASS);
                $elem.attr(DISABLED, DISABLED);
            }

        });
    }

    // restoreRange - restores the current ie selection
    function restoreRange(editor) {
        if (ie && editor.range)
            editor.range[0].select();
    }

    // select - selects all the text in either the textarea or iframe
    function select(editor) {
        setTimeout(function () {
            if (sourceMode(editor)) editor.$area.select();
            else execCommand(editor, "selectall");
        }, 0);
    }

    // selectedHTML - returns the current HTML selection or and empty string
    function selectedHTML(editor) {
        restoreRange(editor);
        var range = getRange(editor);
        if (ie)
            return range.htmlText;
        var layer = $("<layer>")[0];
        layer.appendChild(range.cloneContents());
        var html = layer.innerHTML;
        layer = null;
        return html;
    }

    // selectedText - returns the current text selection or and empty string
    function selectedText(editor) {
        restoreRange(editor);
        if (ie) return getRange(editor).text;
        return getSelection(editor).toString();
    }

    // showMessage - alert replacement
    function showMessage(editor, message, button) {
        var popup = createPopup("msg", editor.options, MSG_CLASS);
        popup.innerHTML = message;
        showPopup(editor, popup, button);
    }

    // showPopup - shows a popup
    function showPopup(editor, popup, button) {

        var offset, left, top, $popup = $(popup);

        // Determine the popup location
        if (button) {
            var $button = $(button);
            offset = $button.offset();
            left = --offset.left;
            top = offset.top + $button.height();
        }
        else {
            var $toolbar = editor.$toolbar;
            offset = $toolbar.offset();
            left = Math.floor(($toolbar.width() - $popup.width()) / 2) + offset.left;
            top = offset.top + $toolbar.height() - 2;
        }

        // Position and show the popup
        hidePopups();
        $popup.css({left: left, top: top})
            .show();

        // Assign the popup button and click event handler
        if (button) {
            $.data(popup, BUTTON, button);
            $popup.bind(CLICK, {popup: popup}, $.proxy(popupClick, editor));
        }

        // Focus the first input element if any
        setTimeout(function () {
            $popup.find(":text,textarea").eq(0).focus().select();
        }, 100);

    }

    // sourceMode - returns true if the textarea is showing
    function sourceMode(editor) {
        return editor.$area.is(":visible");
    }

    // updateFrame - updates the iframe with the textarea contents
    function updateFrame(editor, checkForChange) {

        var code = editor.$area.val(),
            options = editor.options,
            updateFrameCallback = options.updateFrame,
            $body = $(editor.doc.body);

        // Check for textarea change to avoid unnecessary firing
        // of potentially heavy updateFrame callbacks.
        if (updateFrameCallback) {
            var sum = checksum(code);
            if (checkForChange && editor.areaChecksum == sum)
                return;
            editor.areaChecksum = sum;
        }

        // Convert the textarea source code into iframe html
        var html = updateFrameCallback ? updateFrameCallback(code) : code;

        // Prevent script injection attacks by html encoding script tags
        html = html.replace(/<(?=\/?script)/ig, "&lt;");

        // Update the iframe checksum
        if (options.updateTextArea)
            editor.frameChecksum = checksum(html);

        // Update the iframe and trigger the change event
        if (html != $body.html()) {
            $body.html(html);
            $(editor).triggerHandler(CHANGE);
        }

    }

    // updateTextArea - updates the textarea with the iframe contents
    function updateTextArea(editor, checkForChange) {

        var html = $(editor.doc.body).html(),
            options = editor.options,
            updateTextAreaCallback = options.updateTextArea,
            $area = editor.$area;

        // Check for iframe change to avoid unnecessary firing
        // of potentially heavy updateTextArea callbacks.
        if (updateTextAreaCallback) {
            var sum = checksum(html);
            if (checkForChange && editor.frameChecksum == sum)
                return;
            editor.frameChecksum = sum;
        }

        // Convert the iframe html into textarea source code
        var code = updateTextAreaCallback ? updateTextAreaCallback(html) : html;

        // Update the textarea checksum
        if (options.updateFrame)
            editor.areaChecksum = checksum(code);

        // Update the textarea and trigger the change event
        if (code != $area.val()) {
            $area.val(code);
            $(editor).triggerHandler(CHANGE);
        }

    }

})(jQuery);


/*
 * jQuery timepicker addon
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 1.3
 * Last Modified: 05/05/2013
 *
 * Copyright 2013 Trent Richardson
 * You may use this project under MIT or GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 *
 *
 * 2013-11-06 modified by liz
 * add functiong _gotoNow() , modified function _gotoToday()
 * 增加“现在”，修改“今天”
 */

/*jslint evil: true, white: false, undef: false, nomen: false */

(function ($) {

    /*
     * Lets not redefine timepicker, Prevent "Uncaught RangeError: Maximum call stack size exceeded"
     */
    $.ui.timepicker = $.ui.timepicker || {};
    if ($.ui.timepicker.version) {
        return;
    }

    /*
     * Extend jQueryUI, get it started with our version number
     */
    $.extend($.ui, {
        timepicker: {
            version: "1.3"
        }
    });

    /*
     * Timepicker manager.
     * Use the singleton instance of this class, $.timepicker, to interact with the time picker.
     * Settings for (groups of) time pickers are maintained in an instance object,
     * allowing multiple different settings on the same page.
     */
    var Timepicker = function () {
        this.regional = []; // Available regional settings, indexed by language code
        this.regional[''] = { // Default regional settings
//			currentText: 'Now',
//			closeText: 'Done',
//			amNames: ['AM', 'A'],
//			pmNames: ['PM', 'P'],
//			timeFormat: 'HH:mm',
//			timeSuffix: '',
//			timeOnlyTitle: 'Choose Time',
//			timeText: 'Time',
//			hourText: 'Hour',
//			minuteText: 'Minute',
//			secondText: 'Second',
            millisecText: 'Millisecond',
            microsecText: 'Microsecond',
            timezoneText: 'Time Zone',
            isRTL: false,
            currentText: '今天',
            currentText2: '现在',
            closeText: '完成',
            amNames: ['AM', 'A'],
            pmNames: ['PM', 'P'],
            timeFormat: 'HH:mm:ss',
            timeSuffix: '',
            timeOnlyTitle: 'Choose Time',
            timeText: '时间',
            hourText: '时',
            minuteText: '分',
            secondText: '秒'
        };
        this._defaults = { // Global defaults for all the datetime picker instances
            showButtonPanel: true,
            timeOnly: false,
            showHour: null,
            showMinute: null,
//			showSecond: null,
            showSecond: true,//修改设置默认显示秒
            showMillisec: null,
            showMicrosec: null,
            showTimezone: null,
            showTime: true,
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            stepMillisec: 1,
            stepMicrosec: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisec: 0,
            microsec: 0,
            timezone: null,
            hourMin: 0,
            minuteMin: 0,
            secondMin: 0,
            millisecMin: 0,
            microsecMin: 0,
            hourMax: 23,
            minuteMax: 59,
            secondMax: 59,
            millisecMax: 999,
            microsecMax: 999,
            minDateTime: null,
            maxDateTime: null,
            onSelect: null,
            hourGrid: 0,
            minuteGrid: 0,
            secondGrid: 0,
            millisecGrid: 0,
            microsecGrid: 0,
            alwaysSetTime: true,
            separator: ' ',
            altFieldTimeOnly: true,
            altTimeFormat: null,
            altSeparator: null,
            altTimeSuffix: null,
            pickerTimeFormat: null,
            pickerTimeSuffix: null,
            showTimepicker: true,
            timezoneList: null,
            addSliderAccess: false,
            sliderAccessArgs: null,
            controlType: 'slider',
            defaultValue: null,
            parse: 'strict'
        };
        $.extend(this._defaults, this.regional['']);
    };

    $.extend(Timepicker.prototype, {
        $input: null,
        $altInput: null,
        $timeObj: null,
        inst: null,
        hour_slider: null,
        minute_slider: null,
        second_slider: null,
        millisec_slider: null,
        microsec_slider: null,
        timezone_select: null,
        hour: 0,
        minute: 0,
        second: 0,
        millisec: 0,
        microsec: 0,
        timezone: null,
        hourMinOriginal: null,
        minuteMinOriginal: null,
        secondMinOriginal: null,
        millisecMinOriginal: null,
        microsecMinOriginal: null,
        hourMaxOriginal: null,
        minuteMaxOriginal: null,
        secondMaxOriginal: null,
        millisecMaxOriginal: null,
        microsecMaxOriginal: null,
        ampm: '',
        formattedDate: '',
        formattedTime: '',
        formattedDateTime: '',
        timezoneList: null,
        units: ['hour', 'minute', 'second', 'millisec', 'microsec'],
        support: {},
        control: null,

        /*
         * Override the default settings for all instances of the time picker.
         * @param  settings  object - the new settings to use as defaults (anonymous object)
         * @return the manager object
         */
        setDefaults: function (settings) {
            extendRemove(this._defaults, settings || {});
            return this;
        },

        /*
         * Create a new Timepicker instance
         */
        _newInst: function ($input, o) {
            var tp_inst = new Timepicker(),
                inlineSettings = {},
                fns = {},
                overrides, i;

            for (var attrName in this._defaults) {
                if (this._defaults.hasOwnProperty(attrName)) {
                    var attrValue = $input.attr('time:' + attrName);
                    if (attrValue) {
                        try {
                            inlineSettings[attrName] = eval(attrValue);
                        } catch (err) {
                            inlineSettings[attrName] = attrValue;
                        }
                    }
                }
            }

            overrides = {
                beforeShow: function (input, dp_inst) {
                    if ($.isFunction(tp_inst._defaults.evnts.beforeShow)) {
                        return tp_inst._defaults.evnts.beforeShow.call($input[0], input, dp_inst, tp_inst);
                    }
                },
                onChangeMonthYear: function (year, month, dp_inst) {
                    // Update the time as well : this prevents the time from disappearing from the $input field.
                    tp_inst._updateDateTime(dp_inst);
                    if ($.isFunction(tp_inst._defaults.evnts.onChangeMonthYear)) {
                        tp_inst._defaults.evnts.onChangeMonthYear.call($input[0], year, month, dp_inst, tp_inst);
                    }
                },
                onClose: function (dateText, dp_inst) {
                    if (tp_inst.timeDefined === true && $input.val() !== '') {
                        tp_inst._updateDateTime(dp_inst);
                    }
                    if ($.isFunction(tp_inst._defaults.evnts.onClose)) {
                        tp_inst._defaults.evnts.onClose.call($input[0], dateText, dp_inst, tp_inst);
                    }
                }
            };
            for (i in overrides) {
                if (overrides.hasOwnProperty(i)) {
                    fns[i] = o[i] || null;
                }
            }

            tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, o, overrides, {
                evnts: fns,
                timepicker: tp_inst // add timepicker as a property of datepicker: $.datepicker._get(dp_inst, 'timepicker');
            });
            tp_inst.amNames = $.map(tp_inst._defaults.amNames, function (val) {
                return val.toUpperCase();
            });
            tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, function (val) {
                return val.toUpperCase();
            });

            // detect which units are supported
            tp_inst.support = detectSupport(
                tp_inst._defaults.timeFormat +
                    (tp_inst._defaults.pickerTimeFormat ? tp_inst._defaults.pickerTimeFormat : '') +
                    (tp_inst._defaults.altTimeFormat ? tp_inst._defaults.altTimeFormat : ''));

            // controlType is string - key to our this._controls
            if (typeof(tp_inst._defaults.controlType) === 'string') {
                if (tp_inst._defaults.controlType == 'slider' && typeof(jQuery.ui.slider) === 'undefined') {
                    tp_inst._defaults.controlType = 'select';
                }
                tp_inst.control = tp_inst._controls[tp_inst._defaults.controlType];
            }
            // controlType is an object and must implement create, options, value methods
            else {
                tp_inst.control = tp_inst._defaults.controlType;
            }

            // prep the timezone options
            var timezoneList = [-720, -660, -600, -570, -540, -480, -420, -360, -300, -270, -240, -210, -180, -120, -60,
                0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 525, 540, 570, 600, 630, 660, 690, 720, 765, 780, 840];
            if (tp_inst._defaults.timezoneList !== null) {
                timezoneList = tp_inst._defaults.timezoneList;
            }
            var tzl = timezoneList.length, tzi = 0, tzv = null;
            if (tzl > 0 && typeof timezoneList[0] !== 'object') {
                for (; tzi < tzl; tzi++) {
                    tzv = timezoneList[tzi];
                    timezoneList[tzi] = { value: tzv, label: $.timepicker.timezoneOffsetString(tzv, tp_inst.support.iso8601) };
                }
            }
            tp_inst._defaults.timezoneList = timezoneList;

            // set the default units
            tp_inst.timezone = tp_inst._defaults.timezone !== null ? $.timepicker.timezoneOffsetNumber(tp_inst._defaults.timezone) :
                ((new Date()).getTimezoneOffset() * -1);
            tp_inst.hour = tp_inst._defaults.hour < tp_inst._defaults.hourMin ? tp_inst._defaults.hourMin :
                tp_inst._defaults.hour > tp_inst._defaults.hourMax ? tp_inst._defaults.hourMax : tp_inst._defaults.hour;
            tp_inst.minute = tp_inst._defaults.minute < tp_inst._defaults.minuteMin ? tp_inst._defaults.minuteMin :
                tp_inst._defaults.minute > tp_inst._defaults.minuteMax ? tp_inst._defaults.minuteMax : tp_inst._defaults.minute;
            tp_inst.second = tp_inst._defaults.second < tp_inst._defaults.secondMin ? tp_inst._defaults.secondMin :
                tp_inst._defaults.second > tp_inst._defaults.secondMax ? tp_inst._defaults.secondMax : tp_inst._defaults.second;
            tp_inst.millisec = tp_inst._defaults.millisec < tp_inst._defaults.millisecMin ? tp_inst._defaults.millisecMin :
                tp_inst._defaults.millisec > tp_inst._defaults.millisecMax ? tp_inst._defaults.millisecMax : tp_inst._defaults.millisec;
            tp_inst.microsec = tp_inst._defaults.microsec < tp_inst._defaults.microsecMin ? tp_inst._defaults.microsecMin :
                tp_inst._defaults.microsec > tp_inst._defaults.microsecMax ? tp_inst._defaults.microsecMax : tp_inst._defaults.microsec;
            tp_inst.ampm = '';
            tp_inst.$input = $input;

            if (o.altField) {
                tp_inst.$altInput = $(o.altField).css({
                    cursor: 'pointer'
                }).focus(function () {
                        $input.trigger("focus");
                    });
            }

            if (tp_inst._defaults.minDate === 0 || tp_inst._defaults.minDateTime === 0) {
                tp_inst._defaults.minDate = new Date();
            }
            if (tp_inst._defaults.maxDate === 0 || tp_inst._defaults.maxDateTime === 0) {
                tp_inst._defaults.maxDate = new Date();
            }

            // datepicker needs minDate/maxDate, timepicker needs minDateTime/maxDateTime..
            if (tp_inst._defaults.minDate !== undefined && tp_inst._defaults.minDate instanceof Date) {
                tp_inst._defaults.minDateTime = new Date(tp_inst._defaults.minDate.getTime());
            }
            if (tp_inst._defaults.minDateTime !== undefined && tp_inst._defaults.minDateTime instanceof Date) {
                tp_inst._defaults.minDate = new Date(tp_inst._defaults.minDateTime.getTime());
            }
            if (tp_inst._defaults.maxDate !== undefined && tp_inst._defaults.maxDate instanceof Date) {
                tp_inst._defaults.maxDateTime = new Date(tp_inst._defaults.maxDate.getTime());
            }
            if (tp_inst._defaults.maxDateTime !== undefined && tp_inst._defaults.maxDateTime instanceof Date) {
                tp_inst._defaults.maxDate = new Date(tp_inst._defaults.maxDateTime.getTime());
            }
            tp_inst.$input.bind('focus', function () {
                tp_inst._onFocus();
            });

            return tp_inst;
        },

        /*
         * add our sliders to the calendar
         */
        _addTimePicker: function (dp_inst) {
            var currDT = (this.$altInput && this._defaults.altFieldTimeOnly) ? this.$input.val() + ' ' + this.$altInput.val() : this.$input.val();

            this.timeDefined = this._parseTime(currDT);
            this._limitMinMaxDateTime(dp_inst, false);
            this._injectTimePicker();
        },

        /*
         * parse the time string from input value or _setTime
         */
        _parseTime: function (timeString, withDate) {
            if (!this.inst) {
                this.inst = $.datepicker._getInst(this.$input[0]);
            }

            if (withDate || !this._defaults.timeOnly) {
                var dp_dateFormat = $.datepicker._get(this.inst, 'dateFormat');
                try {
                    var parseRes = parseDateTimeInternal(dp_dateFormat, this._defaults.timeFormat, timeString, $.datepicker._getFormatConfig(this.inst), this._defaults);
                    if (!parseRes.timeObj) {
                        return false;
                    }
                    $.extend(this, parseRes.timeObj);
                } catch (err) {
                    $.timepicker.log("Error parsing the date/time string: " + err +
                        "\ndate/time string = " + timeString +
                        "\ntimeFormat = " + this._defaults.timeFormat +
                        "\ndateFormat = " + dp_dateFormat);
                    return false;
                }
                return true;
            } else {
                var timeObj = $.datepicker.parseTime(this._defaults.timeFormat, timeString, this._defaults);
                if (!timeObj) {
                    return false;
                }
                $.extend(this, timeObj);
                return true;
            }
        },

        /*
         * generate and inject html for timepicker into ui datepicker
         */
        _injectTimePicker: function () {
            var $dp = this.inst.dpDiv,
                o = this.inst.settings,
                tp_inst = this,
                litem = '',
                uitem = '',
                show = null,
                max = {},
                gridSize = {},
                size = null,
                i = 0,
                l = 0;

            // Prevent displaying twice
            if ($dp.find("div.ui-timepicker-div").length === 0 && o.showTimepicker) {
                var noDisplay = ' style="display:none;"',
                    html = '<div class="ui-timepicker-div' + (o.isRTL ? ' ui-timepicker-rtl' : '') + '"><dl>' + '<dt class="ui_tpicker_time_label"' + ((o.showTime) ? '' : noDisplay) + '>' + o.timeText + '</dt>' +
                        '<dd class="ui_tpicker_time"' + ((o.showTime) ? '' : noDisplay) + '></dd>';

                // Create the markup
                for (i = 0, l = this.units.length; i < l; i++) {
                    litem = this.units[i];
                    uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
                    show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

                    // Added by Peter Medeiros:
                    // - Figure out what the hour/minute/second max should be based on the step values.
                    // - Example: if stepMinute is 15, then minMax is 45.
                    max[litem] = parseInt((o[litem + 'Max'] - ((o[litem + 'Max'] - o[litem + 'Min']) % o['step' + uitem])), 10);
                    gridSize[litem] = 0;

                    html += '<dt class="ui_tpicker_' + litem + '_label"' + (show ? '' : noDisplay) + '>' + o[litem + 'Text'] + '</dt>' +
                        '<dd class="ui_tpicker_' + litem + '"><div class="ui_tpicker_' + litem + '_slider"' + (show ? '' : noDisplay) + '></div>';

                    if (show && o[litem + 'Grid'] > 0) {
                        html += '<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';

                        if (litem == 'hour') {
                            for (var h = o[litem + 'Min']; h <= max[litem]; h += parseInt(o[litem + 'Grid'], 10)) {
                                gridSize[litem]++;
                                var tmph = $.datepicker.formatTime(this.support.ampm ? 'hht' : 'HH', {hour: h}, o);
                                html += '<td data-for="' + litem + '">' + tmph + '</td>';
                            }
                        }
                        else {
                            for (var m = o[litem + 'Min']; m <= max[litem]; m += parseInt(o[litem + 'Grid'], 10)) {
                                gridSize[litem]++;
                                html += '<td data-for="' + litem + '">' + ((m < 10) ? '0' : '') + m + '</td>';
                            }
                        }

                        html += '</tr></table></div>';
                    }
                    html += '</dd>';
                }

                // Timezone
                var showTz = o.showTimezone !== null ? o.showTimezone : this.support.timezone;
                html += '<dt class="ui_tpicker_timezone_label"' + (showTz ? '' : noDisplay) + '>' + o.timezoneText + '</dt>';
                html += '<dd class="ui_tpicker_timezone" ' + (showTz ? '' : noDisplay) + '></dd>';

                // Create the elements from string
                html += '</dl></div>';
                var $tp = $(html);

                // if we only want time picker...
                if (o.timeOnly === true) {
                    $tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">' + '<div class="ui-datepicker-title">' + o.timeOnlyTitle + '</div>' + '</div>');
                    $dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();
                }

                // add sliders, adjust grids, add events
                for (i = 0, l = tp_inst.units.length; i < l; i++) {
                    litem = tp_inst.units[i];
                    uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
                    show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

                    // add the slider
                    tp_inst[litem + '_slider'] = tp_inst.control.create(tp_inst, $tp.find('.ui_tpicker_' + litem + '_slider'), litem, tp_inst[litem], o[litem + 'Min'], max[litem], o['step' + uitem]);

                    // adjust the grid and add click event
                    if (show && o[litem + 'Grid'] > 0) {
                        size = 100 * gridSize[litem] * o[litem + 'Grid'] / (max[litem] - o[litem + 'Min']);
                        $tp.find('.ui_tpicker_' + litem + ' table').css({
                            width: size + "%",
                            marginLeft: o.isRTL ? '0' : ((size / (-2 * gridSize[litem])) + "%"),
                            marginRight: o.isRTL ? ((size / (-2 * gridSize[litem])) + "%") : '0',
                            borderCollapse: 'collapse'
                        }).find("td").click(function (e) {
                                var $t = $(this),
                                    h = $t.html(),
                                    n = parseInt(h.replace(/[^0-9]/g), 10),
                                    ap = h.replace(/[^apm]/ig),
                                    f = $t.data('for'); // loses scope, so we use data-for

                                if (f == 'hour') {
                                    if (ap.indexOf('p') !== -1 && n < 12) {
                                        n += 12;
                                    }
                                    else {
                                        if (ap.indexOf('a') !== -1 && n === 12) {
                                            n = 0;
                                        }
                                    }
                                }

                                tp_inst.control.value(tp_inst, tp_inst[f + '_slider'], litem, n);

                                tp_inst._onTimeChange();
                                tp_inst._onSelectHandler();
                            }).css({
                                cursor: 'pointer',
                                width: (100 / gridSize[litem]) + '%',
                                textAlign: 'center',
                                overflow: 'hidden'
                            });
                    } // end if grid > 0
                } // end for loop

                // Add timezone options
                this.timezone_select = $tp.find('.ui_tpicker_timezone').append('<select></select>').find("select");
                $.fn.append.apply(this.timezone_select,
                    $.map(o.timezoneList, function (val, idx) {
                        return $("<option />").val(typeof val == "object" ? val.value : val).text(typeof val == "object" ? val.label : val);
                    }));
                if (typeof(this.timezone) != "undefined" && this.timezone !== null && this.timezone !== "") {
                    var local_timezone = (new Date(this.inst.selectedYear, this.inst.selectedMonth, this.inst.selectedDay, 12)).getTimezoneOffset() * -1;
                    if (local_timezone == this.timezone) {
                        selectLocalTimezone(tp_inst);
                    } else {
                        this.timezone_select.val(this.timezone);
                    }
                } else {
                    if (typeof(this.hour) != "undefined" && this.hour !== null && this.hour !== "") {
                        this.timezone_select.val(o.timezone);
                    } else {
                        selectLocalTimezone(tp_inst);
                    }
                }
                this.timezone_select.change(function () {
                    tp_inst._onTimeChange();
                    tp_inst._onSelectHandler();
                });
                // End timezone options

                // inject timepicker into datepicker
                var $buttonPanel = $dp.find('.ui-datepicker-buttonpane');
                if ($buttonPanel.length) {
                    $buttonPanel.before($tp);
                } else {
                    $dp.append($tp);
                }

                this.$timeObj = $tp.find('.ui_tpicker_time');

                if (this.inst !== null) {
                    var timeDefined = this.timeDefined;
                    this._onTimeChange();
                    this.timeDefined = timeDefined;
                }

                // slideAccess integration: http://trentrichardson.com/2011/11/11/jquery-ui-sliders-and-touch-accessibility/
                if (this._defaults.addSliderAccess) {
                    var sliderAccessArgs = this._defaults.sliderAccessArgs,
                        rtl = this._defaults.isRTL;
                    sliderAccessArgs.isRTL = rtl;

                    setTimeout(function () { // fix for inline mode
                        if ($tp.find('.ui-slider-access').length === 0) {
                            $tp.find('.ui-slider:visible').sliderAccess(sliderAccessArgs);

                            // fix any grids since sliders are shorter
                            var sliderAccessWidth = $tp.find('.ui-slider-access:eq(0)').outerWidth(true);
                            if (sliderAccessWidth) {
                                $tp.find('table:visible').each(function () {
                                    var $g = $(this),
                                        oldWidth = $g.outerWidth(),
                                        oldMarginLeft = $g.css(rtl ? 'marginRight' : 'marginLeft').toString().replace('%', ''),
                                        newWidth = oldWidth - sliderAccessWidth,
                                        newMarginLeft = ((oldMarginLeft * newWidth) / oldWidth) + '%',
                                        css = { width: newWidth, marginRight: 0, marginLeft: 0 };
                                    css[rtl ? 'marginRight' : 'marginLeft'] = newMarginLeft;
                                    $g.css(css);
                                });
                            }
                        }
                    }, 10);
                }
                // end slideAccess integration

            }
        },

        /*
         * This function tries to limit the ability to go outside the
         * min/max date range
         */
        _limitMinMaxDateTime: function (dp_inst, adjustSliders) {
            var o = this._defaults,
                dp_date = new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay);

            if (!this._defaults.showTimepicker) {
                return;
            } // No time so nothing to check here

            if ($.datepicker._get(dp_inst, 'minDateTime') !== null && $.datepicker._get(dp_inst, 'minDateTime') !== undefined && dp_date) {
                var minDateTime = $.datepicker._get(dp_inst, 'minDateTime'),
                    minDateTimeDate = new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate(), 0, 0, 0, 0);

                if (this.hourMinOriginal === null || this.minuteMinOriginal === null || this.secondMinOriginal === null || this.millisecMinOriginal === null || this.microsecMinOriginal === null) {
                    this.hourMinOriginal = o.hourMin;
                    this.minuteMinOriginal = o.minuteMin;
                    this.secondMinOriginal = o.secondMin;
                    this.millisecMinOriginal = o.millisecMin;
                    this.microsecMinOriginal = o.microsecMin;
                }

                if (dp_inst.settings.timeOnly || minDateTimeDate.getTime() == dp_date.getTime()) {
                    this._defaults.hourMin = minDateTime.getHours();
                    if (this.hour <= this._defaults.hourMin) {
                        this.hour = this._defaults.hourMin;
                        this._defaults.minuteMin = minDateTime.getMinutes();
                        if (this.minute <= this._defaults.minuteMin) {
                            this.minute = this._defaults.minuteMin;
                            this._defaults.secondMin = minDateTime.getSeconds();
                            if (this.second <= this._defaults.secondMin) {
                                this.second = this._defaults.secondMin;
                                this._defaults.millisecMin = minDateTime.getMilliseconds();
                                if (this.millisec <= this._defaults.millisecMin) {
                                    this.millisec = this._defaults.millisecMin;
                                    this._defaults.microsecMin = minDateTime.getMicroseconds();
                                } else {
                                    if (this.microsec < this._defaults.microsecMin) {
                                        this.microsec = this._defaults.microsecMin;
                                    }
                                    this._defaults.microsecMin = this.microsecMinOriginal;
                                }
                            } else {
                                this._defaults.millisecMin = this.millisecMinOriginal;
                                this._defaults.microsecMin = this.microsecMinOriginal;
                            }
                        } else {
                            this._defaults.secondMin = this.secondMinOriginal;
                            this._defaults.millisecMin = this.millisecMinOriginal;
                            this._defaults.microsecMin = this.microsecMinOriginal;
                        }
                    } else {
                        this._defaults.minuteMin = this.minuteMinOriginal;
                        this._defaults.secondMin = this.secondMinOriginal;
                        this._defaults.millisecMin = this.millisecMinOriginal;
                        this._defaults.microsecMin = this.microsecMinOriginal;
                    }
                } else {
                    this._defaults.hourMin = this.hourMinOriginal;
                    this._defaults.minuteMin = this.minuteMinOriginal;
                    this._defaults.secondMin = this.secondMinOriginal;
                    this._defaults.millisecMin = this.millisecMinOriginal;
                    this._defaults.microsecMin = this.microsecMinOriginal;
                }
            }

            if ($.datepicker._get(dp_inst, 'maxDateTime') !== null && $.datepicker._get(dp_inst, 'maxDateTime') !== undefined && dp_date) {
                var maxDateTime = $.datepicker._get(dp_inst, 'maxDateTime'),
                    maxDateTimeDate = new Date(maxDateTime.getFullYear(), maxDateTime.getMonth(), maxDateTime.getDate(), 0, 0, 0, 0);

                if (this.hourMaxOriginal === null || this.minuteMaxOriginal === null || this.secondMaxOriginal === null || this.millisecMaxOriginal === null) {
                    this.hourMaxOriginal = o.hourMax;
                    this.minuteMaxOriginal = o.minuteMax;
                    this.secondMaxOriginal = o.secondMax;
                    this.millisecMaxOriginal = o.millisecMax;
                    this.microsecMaxOriginal = o.microsecMax;
                }

                if (dp_inst.settings.timeOnly || maxDateTimeDate.getTime() == dp_date.getTime()) {
                    this._defaults.hourMax = maxDateTime.getHours();
                    if (this.hour >= this._defaults.hourMax) {
                        this.hour = this._defaults.hourMax;
                        this._defaults.minuteMax = maxDateTime.getMinutes();
                        if (this.minute >= this._defaults.minuteMax) {
                            this.minute = this._defaults.minuteMax;
                            this._defaults.secondMax = maxDateTime.getSeconds();
                            if (this.second >= this._defaults.secondMax) {
                                this.second = this._defaults.secondMax;
                                this._defaults.millisecMax = maxDateTime.getMilliseconds();
                                if (this.millisec >= this._defaults.millisecMax) {
                                    this.millisec = this._defaults.millisecMax;
                                    this._defaults.microsecMax = maxDateTime.getMicroseconds();
                                } else {
                                    if (this.microsec > this._defaults.microsecMax) {
                                        this.microsec = this._defaults.microsecMax;
                                    }
                                    this._defaults.microsecMax = this.microsecMaxOriginal;
                                }
                            } else {
                                this._defaults.millisecMax = this.millisecMaxOriginal;
                                this._defaults.microsecMax = this.microsecMaxOriginal;
                            }
                        } else {
                            this._defaults.secondMax = this.secondMaxOriginal;
                            this._defaults.millisecMax = this.millisecMaxOriginal;
                            this._defaults.microsecMax = this.microsecMaxOriginal;
                        }
                    } else {
                        this._defaults.minuteMax = this.minuteMaxOriginal;
                        this._defaults.secondMax = this.secondMaxOriginal;
                        this._defaults.millisecMax = this.millisecMaxOriginal;
                        this._defaults.microsecMax = this.microsecMaxOriginal;
                    }
                } else {
                    this._defaults.hourMax = this.hourMaxOriginal;
                    this._defaults.minuteMax = this.minuteMaxOriginal;
                    this._defaults.secondMax = this.secondMaxOriginal;
                    this._defaults.millisecMax = this.millisecMaxOriginal;
                    this._defaults.microsecMax = this.microsecMaxOriginal;
                }
            }

            if (adjustSliders !== undefined && adjustSliders === true) {
                var hourMax = parseInt((this._defaults.hourMax - ((this._defaults.hourMax - this._defaults.hourMin) % this._defaults.stepHour)), 10),
                    minMax = parseInt((this._defaults.minuteMax - ((this._defaults.minuteMax - this._defaults.minuteMin) % this._defaults.stepMinute)), 10),
                    secMax = parseInt((this._defaults.secondMax - ((this._defaults.secondMax - this._defaults.secondMin) % this._defaults.stepSecond)), 10),
                    millisecMax = parseInt((this._defaults.millisecMax - ((this._defaults.millisecMax - this._defaults.millisecMin) % this._defaults.stepMillisec)), 10);
                microsecMax = parseInt((this._defaults.microsecMax - ((this._defaults.microsecMax - this._defaults.microsecMin) % this._defaults.stepMicrosec)), 10);

                if (this.hour_slider) {
                    this.control.options(this, this.hour_slider, 'hour', { min: this._defaults.hourMin, max: hourMax });
                    this.control.value(this, this.hour_slider, 'hour', this.hour - (this.hour % this._defaults.stepHour));
                }
                if (this.minute_slider) {
                    this.control.options(this, this.minute_slider, 'minute', { min: this._defaults.minuteMin, max: minMax });
                    this.control.value(this, this.minute_slider, 'minute', this.minute - (this.minute % this._defaults.stepMinute));
                }
                if (this.second_slider) {
                    this.control.options(this, this.second_slider, 'second', { min: this._defaults.secondMin, max: secMax });
                    this.control.value(this, this.second_slider, 'second', this.second - (this.second % this._defaults.stepSecond));
                }
                if (this.millisec_slider) {
                    this.control.options(this, this.millisec_slider, 'millisec', { min: this._defaults.millisecMin, max: millisecMax });
                    this.control.value(this, this.millisec_slider, 'millisec', this.millisec - (this.millisec % this._defaults.stepMillisec));
                }
                if (this.microsec_slider) {
                    this.control.options(this, this.microsec_slider, 'microsec', { min: this._defaults.microsecMin, max: microsecMax });
                    this.control.value(this, this.microsec_slider, 'microsec', this.microsec - (this.microsec % this._defaults.stepMicrosec));
                }
            }

        },

        /*
         * when a slider moves, set the internal time...
         * on time change is also called when the time is updated in the text field
         */
        _onTimeChange: function () {
            var hour = (this.hour_slider) ? this.control.value(this, this.hour_slider, 'hour') : false,
                minute = (this.minute_slider) ? this.control.value(this, this.minute_slider, 'minute') : false,
                second = (this.second_slider) ? this.control.value(this, this.second_slider, 'second') : false,
                millisec = (this.millisec_slider) ? this.control.value(this, this.millisec_slider, 'millisec') : false,
                microsec = (this.microsec_slider) ? this.control.value(this, this.microsec_slider, 'microsec') : false,
                timezone = (this.timezone_select) ? this.timezone_select.val() : false,
                o = this._defaults,
                pickerTimeFormat = o.pickerTimeFormat || o.timeFormat,
                pickerTimeSuffix = o.pickerTimeSuffix || o.timeSuffix;

            if (typeof(hour) == 'object') {
                hour = false;
            }
            if (typeof(minute) == 'object') {
                minute = false;
            }
            if (typeof(second) == 'object') {
                second = false;
            }
            if (typeof(millisec) == 'object') {
                millisec = false;
            }
            if (typeof(microsec) == 'object') {
                microsec = false;
            }
            if (typeof(timezone) == 'object') {
                timezone = false;
            }

            if (hour !== false) {
                hour = parseInt(hour, 10);
            }
            if (minute !== false) {
                minute = parseInt(minute, 10);
            }
            if (second !== false) {
                second = parseInt(second, 10);
            }
            if (millisec !== false) {
                millisec = parseInt(millisec, 10);
            }
            if (microsec !== false) {
                microsec = parseInt(microsec, 10);
            }

            var ampm = o[hour < 12 ? 'amNames' : 'pmNames'][0];

            // If the update was done in the input field, the input field should not be updated.
            // If the update was done using the sliders, update the input field.
            var hasChanged = (hour != this.hour || minute != this.minute || second != this.second || millisec != this.millisec || microsec != this.microsec
                || (this.ampm.length > 0 && (hour < 12) != ($.inArray(this.ampm.toUpperCase(), this.amNames) !== -1))
                || (this.timezone !== null && timezone != this.timezone));

            if (hasChanged) {

                if (hour !== false) {
                    this.hour = hour;
                }
                if (minute !== false) {
                    this.minute = minute;
                }
                if (second !== false) {
                    this.second = second;
                }
                if (millisec !== false) {
                    this.millisec = millisec;
                }
                if (microsec !== false) {
                    this.microsec = microsec;
                }
                if (timezone !== false) {
                    this.timezone = timezone;
                }

                if (!this.inst) {
                    this.inst = $.datepicker._getInst(this.$input[0]);
                }

                this._limitMinMaxDateTime(this.inst, true);
            }
            if (this.support.ampm) {
                this.ampm = ampm;
            }

            // Updates the time within the timepicker
            this.formattedTime = $.datepicker.formatTime(o.timeFormat, this, o);
            if (this.$timeObj) {
                if (pickerTimeFormat === o.timeFormat) {
                    this.$timeObj.text(this.formattedTime + pickerTimeSuffix);
                }
                else {
                    this.$timeObj.text($.datepicker.formatTime(pickerTimeFormat, this, o) + pickerTimeSuffix);
                }
            }

            this.timeDefined = true;
            if (hasChanged) {
                this._updateDateTime();
            }
        },

        /*
         * call custom onSelect.
         * bind to sliders slidestop, and grid click.
         */
        _onSelectHandler: function () {
            var onSelect = this._defaults.onSelect || this.inst.settings.onSelect;
            var inputEl = this.$input ? this.$input[0] : null;
            if (onSelect && inputEl) {
                onSelect.apply(inputEl, [this.formattedDateTime, this]);
            }
        },

        /*
         * update our input with the new date time..
         */
        _updateDateTime: function (dp_inst) {
            dp_inst = this.inst || dp_inst;
            var dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
                dateFmt = $.datepicker._get(dp_inst, 'dateFormat'),
                formatCfg = $.datepicker._getFormatConfig(dp_inst),
                timeAvailable = dt !== null && this.timeDefined;
            this.formattedDate = $.datepicker.formatDate(dateFmt, (dt === null ? new Date() : dt), formatCfg);
            var formattedDateTime = this.formattedDate;

            // if a slider was changed but datepicker doesn't have a value yet, set it
            if (dp_inst.lastVal === "") {
                dp_inst.currentYear = dp_inst.selectedYear;
                dp_inst.currentMonth = dp_inst.selectedMonth;
                dp_inst.currentDay = dp_inst.selectedDay;
            }

            /*
             * remove following lines to force every changes in date picker to change the input value
             * Bug descriptions: when an input field has a default value, and click on the field to pop up the date picker.
             * If the user manually empty the value in the input field, the date picker will never change selected value.
             */
            //if (dp_inst.lastVal !== undefined && (dp_inst.lastVal.length > 0 && this.$input.val().length === 0)) {
            //	return;
            //}

            if (this._defaults.timeOnly === true) {
                formattedDateTime = this.formattedTime;
            } else if (this._defaults.timeOnly !== true && (this._defaults.alwaysSetTime || timeAvailable)) {
                formattedDateTime += this._defaults.separator + this.formattedTime + this._defaults.timeSuffix;
            }

            this.formattedDateTime = formattedDateTime;

            if (!this._defaults.showTimepicker) {
                this.$input.val(this.formattedDate);
            } else if (this.$altInput && this._defaults.timeOnly === false && this._defaults.altFieldTimeOnly === true) {
                this.$altInput.val(this.formattedTime);
                this.$input.val(this.formattedDate);
            } else if (this.$altInput) {
                this.$input.val(formattedDateTime);
                var altFormattedDateTime = '',
                    altSeparator = this._defaults.altSeparator ? this._defaults.altSeparator : this._defaults.separator,
                    altTimeSuffix = this._defaults.altTimeSuffix ? this._defaults.altTimeSuffix : this._defaults.timeSuffix;

                if (!this._defaults.timeOnly) {
                    if (this._defaults.altFormat) {
                        altFormattedDateTime = $.datepicker.formatDate(this._defaults.altFormat, (dt === null ? new Date() : dt), formatCfg);
                    }
                    else {
                        altFormattedDateTime = this.formattedDate;
                    }

                    if (altFormattedDateTime) {
                        altFormattedDateTime += altSeparator;
                    }
                }

                if (this._defaults.altTimeFormat) {
                    altFormattedDateTime += $.datepicker.formatTime(this._defaults.altTimeFormat, this, this._defaults) + altTimeSuffix;
                }
                else {
                    altFormattedDateTime += this.formattedTime + altTimeSuffix;
                }
                this.$altInput.val(altFormattedDateTime);
            } else {
                this.$input.val(formattedDateTime);
            }

            this.$input.trigger("change");
        },

        _onFocus: function () {
            if (!this.$input.val() && this._defaults.defaultValue) {
                this.$input.val(this._defaults.defaultValue);
                var inst = $.datepicker._getInst(this.$input.get(0)),
                    tp_inst = $.datepicker._get(inst, 'timepicker');
                if (tp_inst) {
                    if (tp_inst._defaults.timeOnly && (inst.input.val() != inst.lastVal)) {
                        try {
                            $.datepicker._updateDatepicker(inst);
                        } catch (err) {
                            $.timepicker.log(err);
                        }
                    }
                }
            }
        },

        /*
         * Small abstraction to control types
         * We can add more, just be sure to follow the pattern: create, options, value
         */
        _controls: {
            // slider methods
            slider: {
                create: function (tp_inst, obj, unit, val, min, max, step) {
                    var rtl = tp_inst._defaults.isRTL; // if rtl go -60->0 instead of 0->60
                    return obj.prop('slide', null).slider({
                        orientation: "horizontal",
                        value: rtl ? val * -1 : val,
                        min: rtl ? max * -1 : min,
                        max: rtl ? min * -1 : max,
                        step: step,
                        slide: function (event, ui) {
                            tp_inst.control.value(tp_inst, $(this), unit, rtl ? ui.value * -1 : ui.value);
                            tp_inst._onTimeChange();
                        },
                        stop: function (event, ui) {
                            tp_inst._onSelectHandler();
                        }
                    });
                },
                options: function (tp_inst, obj, unit, opts, val) {
                    if (tp_inst._defaults.isRTL) {
                        if (typeof(opts) == 'string') {
                            if (opts == 'min' || opts == 'max') {
                                if (val !== undefined) {
                                    return obj.slider(opts, val * -1);
                                }
                                return Math.abs(obj.slider(opts));
                            }
                            return obj.slider(opts);
                        }
                        var min = opts.min,
                            max = opts.max;
                        opts.min = opts.max = null;
                        if (min !== undefined) {
                            opts.max = min * -1;
                        }
                        if (max !== undefined) {
                            opts.min = max * -1;
                        }
                        return obj.slider(opts);
                    }
                    if (typeof(opts) == 'string' && val !== undefined) {
                        return obj.slider(opts, val);
                    }
                    return obj.slider(opts);
                },
                value: function (tp_inst, obj, unit, val) {
                    if (tp_inst._defaults.isRTL) {
                        if (val !== undefined) {
                            return obj.slider('value', val * -1);
                        }
                        return Math.abs(obj.slider('value'));
                    }
                    if (val !== undefined) {
                        return obj.slider('value', val);
                    }
                    return obj.slider('value');
                }
            },
            // select methods
            select: {
                create: function (tp_inst, obj, unit, val, min, max, step) {
                    var sel = '<select class="ui-timepicker-select" data-unit="' + unit + '" data-min="' + min + '" data-max="' + max + '" data-step="' + step + '">',
                        format = tp_inst._defaults.pickerTimeFormat || tp_inst._defaults.timeFormat;

                    for (var i = min; i <= max; i += step) {
                        sel += '<option value="' + i + '"' + (i == val ? ' selected' : '') + '>';
                        if (unit == 'hour') {
                            sel += $.datepicker.formatTime($.trim(format.replace(/[^ht ]/ig, '')), {hour: i}, tp_inst._defaults);
                        }
                        else if (unit == 'millisec' || unit == 'microsec' || i >= 10) {
                            sel += i;
                        }
                        else {
                            sel += '0' + i.toString();
                        }
                        sel += '</option>';
                    }
                    sel += '</select>';

                    obj.children('select').remove();

                    $(sel).appendTo(obj).change(function (e) {
                        tp_inst._onTimeChange();
                        tp_inst._onSelectHandler();
                    });

                    return obj;
                },
                options: function (tp_inst, obj, unit, opts, val) {
                    var o = {},
                        $t = obj.children('select');
                    if (typeof(opts) == 'string') {
                        if (val === undefined) {
                            return $t.data(opts);
                        }
                        o[opts] = val;
                    }
                    else {
                        o = opts;
                    }
                    return tp_inst.control.create(tp_inst, obj, $t.data('unit'), $t.val(), o.min || $t.data('min'), o.max || $t.data('max'), o.step || $t.data('step'));
                },
                value: function (tp_inst, obj, unit, val) {
                    var $t = obj.children('select');
                    if (val !== undefined) {
                        return $t.val(val);
                    }
                    return $t.val();
                }
            }
        } // end _controls

    });

    $.fn.extend({
        /*
         * shorthand just to use timepicker..
         */
        timepicker: function (o) {
            o = o || {};
            var tmp_args = Array.prototype.slice.call(arguments);

            if (typeof o == 'object') {
                tmp_args[0] = $.extend(o, {
                    timeOnly: true
                });
            }

            return $(this).each(function () {
                $.fn.datetimepicker.apply($(this), tmp_args);
            });
        },

        /*
         * extend timepicker to datepicker
         */
        datetimepicker: function (o) {
            o = o || {};
            var tmp_args = arguments;

            if (typeof(o) == 'string') {
                if (o == 'getDate') {
                    return $.fn.datepicker.apply($(this[0]), tmp_args);
                } else {
                    return this.each(function () {
                        var $t = $(this);
                        $t.datepicker.apply($t, tmp_args);
                    });
                }
            } else {
                return this.each(function () {
                    var $t = $(this);
                    $t.datepicker($.timepicker._newInst($t, o)._defaults);
                });
            }
        }
    });

    /*
     * Public Utility to parse date and time
     */
    $.datepicker.parseDateTime = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
        var parseRes = parseDateTimeInternal(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings);
        if (parseRes.timeObj) {
            var t = parseRes.timeObj;
            parseRes.date.setHours(t.hour, t.minute, t.second, t.millisec);
            parseRex.date.setMicroseconds(t.microsec);
        }

        return parseRes.date;
    };

    /*
     * Public utility to parse time
     */
    $.datepicker.parseTime = function (timeFormat, timeString, options) {
        var o = extendRemove(extendRemove({}, $.timepicker._defaults), options || {}),
            iso8601 = (timeFormat.replace(/\'.*?\'/g, '').indexOf('Z') !== -1);

        // Strict parse requires the timeString to match the timeFormat exactly
        var strictParse = function (f, s, o) {

            // pattern for standard and localized AM/PM markers
            var getPatternAmpm = function (amNames, pmNames) {
                var markers = [];
                if (amNames) {
                    $.merge(markers, amNames);
                }
                if (pmNames) {
                    $.merge(markers, pmNames);
                }
                markers = $.map(markers, function (val) {
                    return val.replace(/[.*+?|()\[\]{}\\]/g, '\\$&');
                });
                return '(' + markers.join('|') + ')?';
            };

            // figure out position of time elements.. cause js cant do named captures
            var getFormatPositions = function (timeFormat) {
                var finds = timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|c{1}|t{1,2}|z|'.*?')/g),
                    orders = {
                        h: -1,
                        m: -1,
                        s: -1,
                        l: -1,
                        c: -1,
                        t: -1,
                        z: -1
                    };

                if (finds) {
                    for (var i = 0; i < finds.length; i++) {
                        if (orders[finds[i].toString().charAt(0)] == -1) {
                            orders[finds[i].toString().charAt(0)] = i + 1;
                        }
                    }
                }
                return orders;
            };

            var regstr = '^' + f.toString()
                    .replace(/([hH]{1,2}|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g, function (match) {
                        var ml = match.length;
                        switch (match.charAt(0).toLowerCase()) {
                            case 'h':
                                return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
                            case 'm':
                                return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
                            case 's':
                                return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
                            case 'l':
                                return '(\\d?\\d?\\d)';
                            case 'c':
                                return '(\\d?\\d?\\d)';
                            case 'z':
                                return '(z|[-+]\\d\\d:?\\d\\d|\\S+)?';
                            case 't':
                                return getPatternAmpm(o.amNames, o.pmNames);
                            default:    // literal escaped in quotes
                                return '(' + match.replace(/\'/g, "").replace(/(\.|\$|\^|\\|\/|\(|\)|\[|\]|\?|\+|\*)/g, function (m) {
                                    return "\\" + m;
                                }) + ')?';
                        }
                    })
                    .replace(/\s/g, '\\s?') +
                    o.timeSuffix + '$',
                order = getFormatPositions(f),
                ampm = '',
                treg;

            treg = s.match(new RegExp(regstr, 'i'));

            var resTime = {
                hour: 0,
                minute: 0,
                second: 0,
                millisec: 0,
                microsec: 0
            };

            if (treg) {
                if (order.t !== -1) {
                    if (treg[order.t] === undefined || treg[order.t].length === 0) {
                        ampm = '';
                        resTime.ampm = '';
                    } else {
                        ampm = $.inArray(treg[order.t].toUpperCase(), o.amNames) !== -1 ? 'AM' : 'PM';
                        resTime.ampm = o[ampm == 'AM' ? 'amNames' : 'pmNames'][0];
                    }
                }

                if (order.h !== -1) {
                    if (ampm == 'AM' && treg[order.h] == '12') {
                        resTime.hour = 0; // 12am = 0 hour
                    } else {
                        if (ampm == 'PM' && treg[order.h] != '12') {
                            resTime.hour = parseInt(treg[order.h], 10) + 12; // 12pm = 12 hour, any other pm = hour + 12
                        } else {
                            resTime.hour = Number(treg[order.h]);
                        }
                    }
                }

                if (order.m !== -1) {
                    resTime.minute = Number(treg[order.m]);
                }
                if (order.s !== -1) {
                    resTime.second = Number(treg[order.s]);
                }
                if (order.l !== -1) {
                    resTime.millisec = Number(treg[order.l]);
                }
                if (order.c !== -1) {
                    resTime.microsec = Number(treg[order.c]);
                }
                if (order.z !== -1 && treg[order.z] !== undefined) {
                    resTime.timezone = $.timepicker.timezoneOffsetNumber(treg[order.z]);
                }


                return resTime;
            }
            return false;
        };// end strictParse

        // First try JS Date, if that fails, use strictParse
        var looseParse = function (f, s, o) {
            try {
                var d = new Date('2012-01-01 ' + s);
                if (isNaN(d.getTime())) {
                    d = new Date('2012-01-01T' + s);
                    if (isNaN(d.getTime())) {
                        d = new Date('01/01/2012 ' + s);
                        if (isNaN(d.getTime())) {
                            throw "Unable to parse time with native Date: " + s;
                        }
                    }
                }

                return {
                    hour: d.getHours(),
                    minute: d.getMinutes(),
                    second: d.getSeconds(),
                    millisec: d.getMilliseconds(),
                    microsec: d.getMicroseconds(),
                    timezone: d.getTimezoneOffset() * -1
                };
            }
            catch (err) {
                try {
                    return strictParse(f, s, o);
                }
                catch (err2) {
                    $.timepicker.log("Unable to parse \ntimeString: " + s + "\ntimeFormat: " + f);
                }
            }
            return false;
        }; // end looseParse

        if (typeof o.parse === "function") {
            return o.parse(timeFormat, timeString, o);
        }
        if (o.parse === 'loose') {
            return looseParse(timeFormat, timeString, o);
        }
        return strictParse(timeFormat, timeString, o);
    };

    /*
     * Public utility to format the time
     * format = string format of the time
     * time = a {}, not a Date() for timezones
     * options = essentially the regional[].. amNames, pmNames, ampm
     */
    $.datepicker.formatTime = function (format, time, options) {
        options = options || {};
        options = $.extend({}, $.timepicker._defaults, options);
        time = $.extend({
            hour: 0,
            minute: 0,
            second: 0,
            millisec: 0,
            timezone: 0
        }, time);

        var tmptime = format,
            ampmName = options.amNames[0],
            hour = parseInt(time.hour, 10);

        if (hour > 11) {
            ampmName = options.pmNames[0];
        }

        tmptime = tmptime.replace(/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|('.*?'|".*?"))/g, function (match) {
            switch (match) {
                case 'HH':
                    return ('0' + hour).slice(-2);
                case 'H':
                    return hour;
                case 'hh':
                    return ('0' + convert24to12(hour)).slice(-2);
                case 'h':
                    return convert24to12(hour);
                case 'mm':
                    return ('0' + time.minute).slice(-2);
                case 'm':
                    return time.minute;
                case 'ss':
                    return ('0' + time.second).slice(-2);
                case 's':
                    return time.second;
                case 'l':
                    return ('00' + time.millisec).slice(-3);
                case 'c':
                    return ('00' + time.microsec).slice(-3);
                case 'z':
                    return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, false);
                case 'Z':
                    return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, true);
                case 'T':
                    return ampmName.charAt(0).toUpperCase();
                case 'TT':
                    return ampmName.toUpperCase();
                case 't':
                    return ampmName.charAt(0).toLowerCase();
                case 'tt':
                    return ampmName.toLowerCase();
                default:
                    return match.replace(/\'/g, "") || "'";
            }
        });

        tmptime = $.trim(tmptime);
        return tmptime;
    };

    /*
     * the bad hack :/ override datepicker so it doesnt close on select
     // inspired: http://stackoverflow.com/questions/1252512/jquery-datepicker-prevent-closing-picker-when-clicking-a-date/1762378#1762378
     */
    $.datepicker._base_selectDate = $.datepicker._selectDate;
    $.datepicker._selectDate = function (id, dateStr) {
        var inst = this._getInst($(id)[0]),
            tp_inst = this._get(inst, 'timepicker');

        if (tp_inst) {
            tp_inst._limitMinMaxDateTime(inst, true);
            inst.inline = inst.stay_open = true;
            //This way the onSelect handler called from calendarpicker get the full dateTime
            this._base_selectDate(id, dateStr);
            inst.inline = inst.stay_open = false;
            this._notifyChange(inst);
            this._updateDatepicker(inst);
        } else {
            this._base_selectDate(id, dateStr);
        }
    };

    /*
     * second bad hack :/ override datepicker so it triggers an event when changing the input field
     * and does not redraw the datepicker on every selectDate event
     */
    $.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {

        // don't popup the datepicker if there is another instance already opened
        var input = inst.input[0];
        if ($.datepicker._curInst && $.datepicker._curInst != inst && $.datepicker._datepickerShowing && $.datepicker._lastInput != input) {
            return;
        }

        if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {

            this._base_updateDatepicker(inst);

            // Reload the time control when changing something in the input text field.
            var tp_inst = this._get(inst, 'timepicker');
            if (tp_inst) {
                tp_inst._addTimePicker(inst);
            }
        }
    };

    /*
     * third bad hack :/ override datepicker so it allows spaces and colon in the input field
     */
    $.datepicker._base_doKeyPress = $.datepicker._doKeyPress;
    $.datepicker._doKeyPress = function (event) {
        var inst = $.datepicker._getInst(event.target),
            tp_inst = $.datepicker._get(inst, 'timepicker');

        if (tp_inst) {
            if ($.datepicker._get(inst, 'constrainInput')) {
                var ampm = tp_inst.support.ampm,
                    tz = tp_inst._defaults.showTimezone !== null ? tp_inst._defaults.showTimezone : tp_inst.support.timezone,
                    dateChars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat')),
                    datetimeChars = tp_inst._defaults.timeFormat.toString()
                        .replace(/[hms]/g, '')
                        .replace(/TT/g, ampm ? 'APM' : '')
                        .replace(/Tt/g, ampm ? 'AaPpMm' : '')
                        .replace(/tT/g, ampm ? 'AaPpMm' : '')
                        .replace(/T/g, ampm ? 'AP' : '')
                        .replace(/tt/g, ampm ? 'apm' : '')
                        .replace(/t/g, ampm ? 'ap' : '') +
                        " " + tp_inst._defaults.separator +
                        tp_inst._defaults.timeSuffix +
                        (tz ? tp_inst._defaults.timezoneList.join('') : '') +
                        (tp_inst._defaults.amNames.join('')) + (tp_inst._defaults.pmNames.join('')) +
                        dateChars,
                    chr = String.fromCharCode(event.charCode === undefined ? event.keyCode : event.charCode);
                return event.ctrlKey || (chr < ' ' || !dateChars || datetimeChars.indexOf(chr) > -1);
            }
        }

        return $.datepicker._base_doKeyPress(event);
    };

    /*
     * Fourth bad hack :/ override _updateAlternate function used in inline mode to init altField
     */
    $.datepicker._base_updateAlternate = $.datepicker._updateAlternate;
    /* Update any alternate field to synchronise with the main field. */
    $.datepicker._updateAlternate = function (inst) {
        var tp_inst = this._get(inst, 'timepicker');
        if (tp_inst) {
            var altField = tp_inst._defaults.altField;
            if (altField) { // update alternate field too
                var altFormat = tp_inst._defaults.altFormat || tp_inst._defaults.dateFormat,
                    date = this._getDate(inst),
                    formatCfg = $.datepicker._getFormatConfig(inst),
                    altFormattedDateTime = '',
                    altSeparator = tp_inst._defaults.altSeparator ? tp_inst._defaults.altSeparator : tp_inst._defaults.separator,
                    altTimeSuffix = tp_inst._defaults.altTimeSuffix ? tp_inst._defaults.altTimeSuffix : tp_inst._defaults.timeSuffix,
                    altTimeFormat = tp_inst._defaults.altTimeFormat !== null ? tp_inst._defaults.altTimeFormat : tp_inst._defaults.timeFormat;

                altFormattedDateTime += $.datepicker.formatTime(altTimeFormat, tp_inst, tp_inst._defaults) + altTimeSuffix;
                if (!tp_inst._defaults.timeOnly && !tp_inst._defaults.altFieldTimeOnly && date !== null) {
                    if (tp_inst._defaults.altFormat) {
                        altFormattedDateTime = $.datepicker.formatDate(tp_inst._defaults.altFormat, date, formatCfg) + altSeparator + altFormattedDateTime;
                    }
                    else {
                        altFormattedDateTime = tp_inst.formattedDate + altSeparator + altFormattedDateTime;
                    }
                }
                $(altField).val(altFormattedDateTime);
            }
        }
        else {
            $.datepicker._base_updateAlternate(inst);
        }
    };

    /*
     * Override key up event to sync manual input changes.
     */
    $.datepicker._base_doKeyUp = $.datepicker._doKeyUp;
    $.datepicker._doKeyUp = function (event) {
        var inst = $.datepicker._getInst(event.target),
            tp_inst = $.datepicker._get(inst, 'timepicker');

        if (tp_inst) {
            if (tp_inst._defaults.timeOnly && (inst.input.val() != inst.lastVal)) {
                try {
                    $.datepicker._updateDatepicker(inst);
                } catch (err) {
                    $.timepicker.log(err);
                }
            }
        }

        return $.datepicker._base_doKeyUp(event);
    };

    /*
     * override "Today" button to also grab the time.
     */
    $.datepicker._base_gotoToday = $.datepicker._gotoToday;
    $.datepicker._gotoToday = function (id) {
        var inst = this._getInst($(id)[0]),
            $dp = inst.dpDiv;
        this._base_gotoToday(id);
        var tp_inst = this._get(inst, 'timepicker');
        this._setTime(inst);
        $('.ui-datepicker-today', $dp).click();
    };
    $.datepicker._gotoNow = function (id) {
        var inst = this._getInst($(id)[0]),
            $dp = inst.dpDiv;
        this._base_gotoToday(id);
        var tp_inst = this._get(inst, 'timepicker');
        selectLocalTimezone(tp_inst);
        var now = new Date();
        this._setTime(inst, now);
        $('.ui-datepicker-today', $dp).click();
    };

    /*
     * Disable & enable the Time in the datetimepicker
     */
    $.datepicker._disableTimepickerDatepicker = function (target) {
        var inst = this._getInst(target);
        if (!inst) {
            return;
        }

        var tp_inst = this._get(inst, 'timepicker');
        $(target).datepicker('getDate'); // Init selected[Year|Month|Day]
        if (tp_inst) {
            tp_inst._defaults.showTimepicker = false;
            tp_inst._updateDateTime(inst);
        }
    };

    $.datepicker._enableTimepickerDatepicker = function (target) {
        var inst = this._getInst(target);
        if (!inst) {
            return;
        }

        var tp_inst = this._get(inst, 'timepicker');
        $(target).datepicker('getDate'); // Init selected[Year|Month|Day]
        if (tp_inst) {
            tp_inst._defaults.showTimepicker = true;
            tp_inst._addTimePicker(inst); // Could be disabled on page load
            tp_inst._updateDateTime(inst);
        }
    };

    /*
     * Create our own set time function
     */
    $.datepicker._setTime = function (inst, date) {
        var tp_inst = this._get(inst, 'timepicker');
        if (tp_inst) {
            var defaults = tp_inst._defaults;

            // calling _setTime with no date sets time to defaults
            tp_inst.hour = date ? date.getHours() : defaults.hour;
            tp_inst.minute = date ? date.getMinutes() : defaults.minute;
            tp_inst.second = date ? date.getSeconds() : defaults.second;
            tp_inst.millisec = date ? date.getMilliseconds() : defaults.millisec;
            tp_inst.microsec = date ? date.getMicroseconds() : defaults.microsec;

            //check if within min/max times..
            tp_inst._limitMinMaxDateTime(inst, true);

            tp_inst._onTimeChange();
            tp_inst._updateDateTime(inst);
        }
    };

    /*
     * Create new public method to set only time, callable as $().datepicker('setTime', date)
     */
    $.datepicker._setTimeDatepicker = function (target, date, withDate) {
        var inst = this._getInst(target);
        if (!inst) {
            return;
        }

        var tp_inst = this._get(inst, 'timepicker');

        if (tp_inst) {
            this._setDateFromField(inst);
            var tp_date;
            if (date) {
                if (typeof date == "string") {
                    tp_inst._parseTime(date, withDate);
                    tp_date = new Date();
                    tp_date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
                    tp_date.setMicroseconds(tp_inst.microsec);
                } else {
                    tp_date = new Date(date.getTime());
                }
                if (tp_date.toString() == 'Invalid Date') {
                    tp_date = undefined;
                }
                this._setTime(inst, tp_date);
            }
        }

    };

    /*
     * override setDate() to allow setting time too within Date object
     */
    $.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker;
    $.datepicker._setDateDatepicker = function (target, date) {
        var inst = this._getInst(target);
        if (!inst) {
            return;
        }

        var tp_inst = this._get(inst, 'timepicker'),
            tp_date = (date instanceof Date) ? new Date(date.getTime()) : date;

        // This is important if you are using the timezone option, javascript's Date
        // object will only return the timezone offset for the current locale, so we
        // adjust it accordingly.  If not using timezone option this won't matter..
        // If a timezone is different in tp, keep the timezone as is
        if (tp_inst && tp_inst.timezone != null) {
            date = $.timepicker.timezoneAdjust(date, tp_inst.timezone);
            tp_date = $.timepicker.timezoneAdjust(tp_date, tp_inst.timezone);
        }

        this._updateDatepicker(inst);
        this._base_setDateDatepicker.apply(this, arguments);
        this._setTimeDatepicker(target, tp_date, true);
    };

    /*
     * override getDate() to allow getting time too within Date object
     */
    $.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker;
    $.datepicker._getDateDatepicker = function (target, noDefault) {
        var inst = this._getInst(target);
        if (!inst) {
            return;
        }

        var tp_inst = this._get(inst, 'timepicker');

        if (tp_inst) {
            // if it hasn't yet been defined, grab from field
            if (inst.lastVal === undefined) {
                this._setDateFromField(inst, noDefault);
            }

            var date = this._getDate(inst);
            if (date && tp_inst._parseTime($(target).val(), tp_inst.timeOnly)) {
                date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
                date.setMicroseconds(tp_inst.microsec);

                // This is important if you are using the timezone option, javascript's Date
                // object will only return the timezone offset for the current locale, so we
                // adjust it accordingly.  If not using timezone option this won't matter..
                if (tp_inst.timezone != null) {
                    date = $.timepicker.timezoneAdjust(date, tp_inst.timezone);
                }
            }
            return date;
        }
        return this._base_getDateDatepicker(target, noDefault);
    };

    /*
     * override parseDate() because UI 1.8.14 throws an error about "Extra characters"
     * An option in datapicker to ignore extra format characters would be nicer.
     */
    $.datepicker._base_parseDate = $.datepicker.parseDate;
    $.datepicker.parseDate = function (format, value, settings) {
        var date;
        try {
            date = this._base_parseDate(format, value, settings);
        } catch (err) {
            // Hack!  The error message ends with a colon, a space, and
            // the "extra" characters.  We rely on that instead of
            // attempting to perfectly reproduce the parsing algorithm.
            if (err.indexOf(":") >= 0) {
                date = this._base_parseDate(format, value.substring(0, value.length - (err.length - err.indexOf(':') - 2)), settings);
                $.timepicker.log("Error parsing the date string: " + err + "\ndate string = " + value + "\ndate format = " + format);
            } else {
                throw err;
            }
        }
        return date;
    };

    /*
     * override formatDate to set date with time to the input
     */
    $.datepicker._base_formatDate = $.datepicker._formatDate;
    $.datepicker._formatDate = function (inst, day, month, year) {
        var tp_inst = this._get(inst, 'timepicker');
        if (tp_inst) {
            tp_inst._updateDateTime(inst);
            return tp_inst.$input.val();
        }
        return this._base_formatDate(inst);
    };

    /*
     * override options setter to add time to maxDate(Time) and minDate(Time). MaxDate
     */
    $.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker;
    $.datepicker._optionDatepicker = function (target, name, value) {
        var inst = this._getInst(target),
            name_clone;
        if (!inst) {
            return null;
        }

        var tp_inst = this._get(inst, 'timepicker');
        if (tp_inst) {
            var min = null,
                max = null,
                onselect = null,
                overrides = tp_inst._defaults.evnts,
                fns = {},
                prop;
            if (typeof name == 'string') { // if min/max was set with the string
                if (name === 'minDate' || name === 'minDateTime') {
                    min = value;
                } else if (name === 'maxDate' || name === 'maxDateTime') {
                    max = value;
                } else if (name === 'onSelect') {
                    onselect = value;
                } else if (overrides.hasOwnProperty(name)) {
                    if (typeof (value) === 'undefined') {
                        return overrides[name];
                    }
                    fns[name] = value;
                    name_clone = {}; //empty results in exiting function after overrides updated
                }
            } else if (typeof name == 'object') { //if min/max was set with the JSON
                if (name.minDate) {
                    min = name.minDate;
                } else if (name.minDateTime) {
                    min = name.minDateTime;
                } else if (name.maxDate) {
                    max = name.maxDate;
                } else if (name.maxDateTime) {
                    max = name.maxDateTime;
                }
                for (prop in overrides) {
                    if (overrides.hasOwnProperty(prop) && name[prop]) {
                        fns[prop] = name[prop];
                    }
                }
            }
            for (prop in fns) {
                if (fns.hasOwnProperty(prop)) {
                    overrides[prop] = fns[prop];
                    if (!name_clone) {
                        name_clone = $.extend({}, name);
                    }
                    delete name_clone[prop];
                }
            }
            if (name_clone && isEmptyObject(name_clone)) {
                return;
            }
            if (min) { //if min was set
                if (min === 0) {
                    min = new Date();
                } else {
                    min = new Date(min);
                }
                tp_inst._defaults.minDate = min;
                tp_inst._defaults.minDateTime = min;
            } else if (max) { //if max was set
                if (max === 0) {
                    max = new Date();
                } else {
                    max = new Date(max);
                }
                tp_inst._defaults.maxDate = max;
                tp_inst._defaults.maxDateTime = max;
            } else if (onselect) {
                tp_inst._defaults.onSelect = onselect;
            }
        }
        if (value === undefined) {
            return this._base_optionDatepicker.call($.datepicker, target, name);
        }
        return this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
    };

    /*
     * jQuery isEmptyObject does not check hasOwnProperty - if someone has added to the object prototype,
     * it will return false for all objects
     */
    var isEmptyObject = function (obj) {
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(obj)) {
                return false;
            }
        }
        return true;
    };

    /*
     * jQuery extend now ignores nulls!
     */
    var extendRemove = function (target, props) {
        $.extend(target, props);
        for (var name in props) {
            if (props[name] === null || props[name] === undefined) {
                target[name] = props[name];
            }
        }
        return target;
    };

    /*
     * Determine by the time format which units are supported
     * Returns an object of booleans for each unit
     */
    var detectSupport = function (timeFormat) {
        var tf = timeFormat.replace(/\'.*?\'/g, '').toLowerCase(), // removes literals
            isIn = function (f, t) { // does the format contain the token?
                return f.indexOf(t) !== -1 ? true : false;
            };
        return {
            hour: isIn(tf, 'h'),
            minute: isIn(tf, 'm'),
            second: isIn(tf, 's'),
            millisec: isIn(tf, 'l'),
            microsec: isIn(tf, 'c'),
            timezone: isIn(tf, 'z'),
            ampm: isIn('t') && isIn(timeFormat, 'h'),
            iso8601: isIn(timeFormat, 'Z')
        };
    };

    /*
     * Converts 24 hour format into 12 hour
     * Returns 12 hour without leading 0
     */
    var convert24to12 = function (hour) {
        if (hour > 12) {
            hour = hour - 12;
        }

        if (hour === 0) {
            hour = 12;
        }

        return String(hour);
    };

    /*
     * Splits datetime string into date ans time substrings.
     * Throws exception when date can't be parsed
     * Returns [dateString, timeString]
     */
    var splitDateTime = function (dateFormat, dateTimeString, dateSettings, timeSettings) {
        try {
            // The idea is to get the number separator occurances in datetime and the time format requested (since time has
            // fewer unknowns, mostly numbers and am/pm). We will use the time pattern to split.
            var separator = timeSettings && timeSettings.separator ? timeSettings.separator : $.timepicker._defaults.separator,
                format = timeSettings && timeSettings.timeFormat ? timeSettings.timeFormat : $.timepicker._defaults.timeFormat,
                timeParts = format.split(separator), // how many occurances of separator may be in our format?
                timePartsLen = timeParts.length,
                allParts = dateTimeString.split(separator),
                allPartsLen = allParts.length;

            if (allPartsLen > 1) {
                return [
                    allParts.splice(0, allPartsLen - timePartsLen).join(separator),
                    allParts.splice(0, timePartsLen).join(separator)
                ];
            }

        } catch (err) {
            $.timepicker.log('Could not split the date from the time. Please check the following datetimepicker options' +
                "\nthrown error: " + err +
                "\ndateTimeString" + dateTimeString +
                "\ndateFormat = " + dateFormat +
                "\nseparator = " + timeSettings.separator +
                "\ntimeFormat = " + timeSettings.timeFormat);

            if (err.indexOf(":") >= 0) {
                // Hack!  The error message ends with a colon, a space, and
                // the "extra" characters.  We rely on that instead of
                // attempting to perfectly reproduce the parsing algorithm.
                var dateStringLength = dateTimeString.length - (err.length - err.indexOf(':') - 2),
                    timeString = dateTimeString.substring(dateStringLength);

                return [$.trim(dateTimeString.substring(0, dateStringLength)), $.trim(dateTimeString.substring(dateStringLength))];

            } else {
                throw err;
            }
        }
        return [dateTimeString, ''];
    };

    /*
     * Internal function to parse datetime interval
     * Returns: {date: Date, timeObj: Object}, where
     *   date - parsed date without time (type Date)
     *   timeObj = {hour: , minute: , second: , millisec: , microsec: } - parsed time. Optional
     */
    var parseDateTimeInternal = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
        var date;
        var splitRes = splitDateTime(dateFormat, dateTimeString, dateSettings, timeSettings);
        date = $.datepicker._base_parseDate(dateFormat, splitRes[0], dateSettings);
        if (splitRes[1] !== '') {
            var timeString = splitRes[1],
                parsedTime = $.datepicker.parseTime(timeFormat, timeString, timeSettings);

            if (parsedTime === null) {
                throw 'Wrong time format';
            }
            return {
                date: date,
                timeObj: parsedTime
            };
        } else {
            return {
                date: date
            };
        }
    };

    /*
     * Internal function to set timezone_select to the local timezone
     */
    var selectLocalTimezone = function (tp_inst, date) {
        if (tp_inst && tp_inst.timezone_select) {
            var now = typeof date !== 'undefined' ? date : new Date();
            tp_inst.timezone_select.val(now.getTimezoneOffset() * -1);
        }
    };

    /*
     * Create a Singleton Insance
     */
    $.timepicker = new Timepicker();

    /**
     * Get the timezone offset as string from a date object (eg '+0530' for UTC+5.5)
     * @param  number if not a number this value is returned
     * @param boolean if true formats in accordance to iso8601 "+12:45"
     * @return string
     */
    $.timepicker.timezoneOffsetString = function (tzMinutes, iso8601) {
        if (isNaN(tzMinutes) || tzMinutes > 840) {
            return tzMinutes;
        }

        var off = tzMinutes,
            minutes = off % 60,
            hours = (off - minutes) / 60,
            iso = iso8601 ? ':' : '',
            tz = (off >= 0 ? '+' : '-') + ('0' + (hours * 101).toString()).slice(-2) + iso + ('0' + (minutes * 101).toString()).slice(-2);

        if (tz == '+00:00') {
            return 'Z';
        }
        return tz;
    };

    /**
     * Get the number in minutes that represents a timezone string
     * @param  string formated like "+0500", "-1245"
     * @return number
     */
    $.timepicker.timezoneOffsetNumber = function (tzString) {
        tzString = tzString.toString().replace(':', ''); // excuse any iso8601, end up with "+1245"

        if (tzString.toUpperCase() === 'Z') { // if iso8601 with Z, its 0 minute offset
            return 0;
        }

        if (!/^(\-|\+)\d{4}$/.test(tzString)) { // possibly a user defined tz, so just give it back
            return tzString;
        }

        return ((tzString.substr(0, 1) == '-' ? -1 : 1) * // plus or minus
            ((parseInt(tzString.substr(1, 2), 10) * 60) + // hours (converted to minutes)
                parseInt(tzString.substr(3, 2), 10))); // minutes
    };

    /**
     * No way to set timezone in js Date, so we must adjust the minutes to compensate. (think setDate, getDate)
     * @param  date
     * @param  string formated like "+0500", "-1245"
     * @return date
     */
    $.timepicker.timezoneAdjust = function (date, toTimezone) {
        var toTz = $.timepicker.timezoneOffsetNumber(toTimezone);
        if (!isNaN(toTz)) {
            var currTz = date.getTimezoneOffset() * -1,
                diff = currTz - toTz; // difference in minutes

            date.setMinutes(date.getMinutes() + diff);
        }
        return date;
    };

    /**
     * Calls `timepicker()` on the `startTime` and `endTime` elements, and configures them to
     * enforce date range limits.
     * n.b. The input value must be correctly formatted (reformatting is not supported)
     * @param  Element startTime
     * @param  Element endTime
     * @param  obj options Options for the timepicker() call
     * @return jQuery
     */
    $.timepicker.timeRange = function (startTime, endTime, options) {
        return $.timepicker.handleRange('timepicker', startTime, endTime, options);
    };

    /**
     * Calls `datetimepicker` on the `startTime` and `endTime` elements, and configures them to
     * enforce date range limits.
     * @param  Element startTime
     * @param  Element endTime
     * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
     *   a boolean value that can be used to reformat the input values to the `dateFormat`.
     * @param  string method Can be used to specify the type of picker to be added
     * @return jQuery
     */
    $.timepicker.datetimeRange = function (startTime, endTime, options) {
        $.timepicker.handleRange('datetimepicker', startTime, endTime, options);
    };

    /**
     * Calls `method` on the `startTime` and `endTime` elements, and configures them to
     * enforce date range limits.
     * @param  Element startTime
     * @param  Element endTime
     * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
     *   a boolean value that can be used to reformat the input values to the `dateFormat`.
     * @return jQuery
     */
    $.timepicker.dateRange = function (startTime, endTime, options) {
        $.timepicker.handleRange('datepicker', startTime, endTime, options);
    };

    /**
     * Calls `method` on the `startTime` and `endTime` elements, and configures them to
     * enforce date range limits.
     * @param  string method Can be used to specify the type of picker to be added
     * @param  Element startTime
     * @param  Element endTime
     * @param  obj options Options for the `timepicker()` call. Also supports `reformat`,
     *   a boolean value that can be used to reformat the input values to the `dateFormat`.
     * @return jQuery
     */
    $.timepicker.handleRange = function (method, startTime, endTime, options) {
        options = $.extend({}, {
            minInterval: 0, // min allowed interval in milliseconds
            maxInterval: 0, // max allowed interval in milliseconds
            start: {},      // options for start picker
            end: {}         // options for end picker
        }, options);

        $.fn[method].call(startTime, $.extend({
            onClose: function (dateText, inst) {
                checkDates($(this), endTime);
            },
            onSelect: function (selectedDateTime) {
                selected($(this), endTime, 'minDate');
            }
        }, options, options.start));
        $.fn[method].call(endTime, $.extend({
            onClose: function (dateText, inst) {
                checkDates($(this), startTime);
            },
            onSelect: function (selectedDateTime) {
                selected($(this), startTime, 'maxDate');
            }
        }, options, options.end));

        checkDates(startTime, endTime);
        selected(startTime, endTime, 'minDate');
        selected(endTime, startTime, 'maxDate');

        function checkDates(changed, other) {
            var startdt = startTime[method]('getDate'),
                enddt = endTime[method]('getDate'),
                changeddt = changed[method]('getDate');

            if (startdt !== null) {
                var minDate = new Date(startdt.getTime()),
                    maxDate = new Date(startdt.getTime());

                minDate.setMilliseconds(minDate.getMilliseconds() + options.minInterval);
                maxDate.setMilliseconds(maxDate.getMilliseconds() + options.maxInterval);

                if (options.minInterval > 0 && minDate > enddt) { // minInterval check
                    endTime[method]('setDate', minDate);
                }
                else if (options.maxInterval > 0 && maxDate < enddt) { // max interval check
                    endTime[method]('setDate', maxDate);
                }
                else if (startdt > enddt) {
                    other[method]('setDate', changeddt);
                }
            }
        }

        function selected(changed, other, option) {
            if (!changed.val()) {
                return;
            }
            var date = changed[method].call(changed, 'getDate');
            if (date !== null && options.minInterval > 0) {
                if (option == 'minDate') {
                    date.setMilliseconds(date.getMilliseconds() + options.minInterval);
                }
                if (option == 'maxDate') {
                    date.setMilliseconds(date.getMilliseconds() - options.minInterval);
                }
            }
            if (date.getTime) {
                other[method].call(other, 'option', option, date);
            }
        }

        return $([startTime.get(0), endTime.get(0)]);
    };

    /**
     * Log error or data to the console during error or debugging
     * @param  Object err pass any type object to log to the console during error or debugging
     * @return void
     */
    $.timepicker.log = function (err) {
        if (window.console) {
            console.log(err);
        }
    };

    /*
     * Rough microsecond support
     */
    if (!Date.prototype.getMicroseconds) {
        Date.microseconds = 0;
        Date.prototype.getMicroseconds = function () {
            return this.microseconds;
        };
        Date.prototype.setMicroseconds = function (m) {
            this.microseconds = m;
            return this;
        };
    }

    /*
     * Keep up with the version
     */
    $.timepicker.version = "1.3";

})(jQuery);
/*
 * jQuery UI Slider Access
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 0.3
 * Last Modified: 10/20/2012
 *
 * Copyright 2011 Trent Richardson
 * Dual licensed under the MIT and GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 *
 */
(function ($) {

    $.fn.extend({
        sliderAccess: function (options) {
            options = options || {};
            options.touchonly = options.touchonly !== undefined ? options.touchonly : true; // by default only show it if touch device

            if (options.touchonly === true && !("ontouchend" in document))
                return $(this);

            return $(this).each(function (i, obj) {
                var $t = $(this),
                    o = $.extend({}, {
                        where: 'after',
                        step: $t.slider('option', 'step'),
                        upIcon: 'ui-icon-plus',
                        downIcon: 'ui-icon-minus',
                        text: false,
                        upText: '+',
                        downText: '-',
                        buttonset: true,
                        buttonsetTag: 'span',
                        isRTL: false
                    }, options),
                    $buttons = $('<' + o.buttonsetTag + ' class="ui-slider-access">' +
                        '<button data-icon="' + o.downIcon + '" data-step="' + (o.isRTL ? o.step : o.step * -1) + '">' + o.downText + '</button>' +
                        '<button data-icon="' + o.upIcon + '" data-step="' + (o.isRTL ? o.step * -1 : o.step) + '">' + o.upText + '</button>' +
                        '</' + o.buttonsetTag + '>');

                $buttons.children('button').each(function (j, jobj) {
                    var $jt = $(this);
                    $jt.button({
                        text: o.text,
                        icons: { primary: $jt.data('icon') }
                    })
                        .click(function (e) {
                            var step = $jt.data('step'),
                                curr = $t.slider('value'),
                                newval = curr += step * 1,
                                minval = $t.slider('option', 'min'),
                                maxval = $t.slider('option', 'max'),
                                slidee = $t.slider("option", "slide") || function () {
                                },
                                stope = $t.slider("option", "stop") || function () {
                                };

                            e.preventDefault();

                            if (newval < minval || newval > maxval)
                                return;

                            $t.slider('value', newval);

                            slidee.call($t, null, { value: newval });
                            stope.call($t, null, { value: newval });
                        });
                });

                // before or after
                $t[o.where]($buttons);

                if (o.buttonset) {
                    $buttons.removeClass('ui-corner-right').removeClass('ui-corner-left').buttonset();
                    $buttons.eq(0).addClass('ui-corner-left');
                    $buttons.eq(1).addClass('ui-corner-right');
                }

                // adjust the width so we don't break the original layout
                var bOuterWidth = $buttons.css({
                    marginLeft: ((o.where == 'after' && !o.isRTL) || (o.where == 'before' && o.isRTL) ? 10 : 0),
                    marginRight: ((o.where == 'before' && !o.isRTL) || (o.where == 'after' && o.isRTL) ? 10 : 0)
                }).outerWidth(true) + 5;
                var tOuterWidth = $t.outerWidth(true);
                $t.css('display', 'inline-block').width(tOuterWidth - bOuterWidth);
            });
        }
    });

})(jQuery);