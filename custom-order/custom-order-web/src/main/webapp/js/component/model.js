/**
 * 滚动监听
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* SCROLLSPY CLASS DEFINITION
     * ========================== */

    function ScrollSpy(element, options) {
        var process = $.proxy(this.process, this)
            , $element = $(element).is('body') ? $(window) : $(element)
            , href
        this.options = $.extend({}, $.fn.scrollspy.defaults, options)
        this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
        this.selector = (this.options.target
            || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            || '') + ' .nav li > a'
        this.$body = $('body')
        this.refresh()
        this.process()
    }

    ScrollSpy.prototype = {

        constructor: ScrollSpy, refresh: function () {
            var self = this
                , $targets

            this.offsets = $([])
            this.targets = $([])

            $targets = this.$body
                .find(this.selector)
                .map(function () {
                    var $el = $(this)
                        , href = $el.data('target') || $el.attr('href')
                        , $href = /^#\w/.test(href) && $(href)
                    return ( $href
                        && $href.length
                        && [
                        [ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]
                    ] ) || null
                })
                .sort(function (a, b) {
                    return a[0] - b[0]
                })
                .each(function () {
                    self.offsets.push(this[0])
                    self.targets.push(this[1])
                })
        }, process: function () {
            var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
                , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
                , maxScroll = scrollHeight - this.$scrollElement.height()
                , offsets = this.offsets
                , targets = this.targets
                , activeTarget = this.activeTarget
                , i

            if (scrollTop >= maxScroll) {
                return activeTarget != (i = targets.last()[0])
                    && this.activate(i)
            }

            for (i = offsets.length; i--;) {
                activeTarget != targets[i]
                    && scrollTop >= offsets[i]
                    && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
                && this.activate(targets[i])
            }
        }, activate: function (target) {
            var active
                , selector

            this.activeTarget = target

            $(this.selector)
                .parent('.active')
                .removeClass('active')

            selector = this.selector
                + '[data-target="' + target + '"],'
                + this.selector + '[href="' + target + '"]'

            active = $(selector)
                .parent('li')
                .addClass('active')

            if (active.parent('.dropdown-menu').length) {
                active = active.closest('li.dropdown').addClass('active')
            }

            active.trigger('activate')
        }

    }


    /* SCROLLSPY PLUGIN DEFINITION
     * =========================== */

    var old = $.fn.scrollspy

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('scrollspy')
                , options = typeof option == 'object' && option
            if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.scrollspy.Constructor = ScrollSpy

    $.fn.scrollspy.defaults = {
        offset: 10
    }


    /* SCROLLSPY NO CONFLICT
     * ===================== */

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    /* SCROLLSPY DATA-API
     * ================== */

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })

}(window.jQuery);

/**
 * edit page 附加菜单 affix
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* AFFIX CLASS DEFINITION
     * ====================== */

    var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.affix.defaults, options)
        this.$window = $(window)
            .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.affix.data-api', $.proxy(function () {
                setTimeout($.proxy(this.checkPosition, this), 1)
            }, this))
        this.$element = $(element)
        this.checkPosition()
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var scrollHeight = $(document).height()
            , scrollTop = this.$window.scrollTop()
            , position = this.$element.offset()
            , offset = this.options.offset
            , offsetBottom = offset.bottom
            , offsetTop = offset.top
            , reset = 'affix affix-top affix-bottom'
            , affix

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top()
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

        affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
            false : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
            'bottom' : offsetTop != null && scrollTop <= offsetTop ?
            'top' : false

        if (this.affixed === affix) return

        this.affixed = affix
        this.unpin = affix == 'bottom' ? position.top - scrollTop : null

        this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
    }


    /* AFFIX PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.affix

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('affix')
                , options = typeof option == 'object' && option
            if (!data) $this.data('affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.affix.Constructor = Affix

    $.fn.affix.defaults = {
        offset: 0
    }


    /* AFFIX NO CONFLICT
     * ================= */

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    /* AFFIX DATA-API
     * ============== */

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
                , data = $spy.data()

            data.offset = data.offset || {}

            data.offsetBottom && (data.offset.bottom = data.offsetBottom)
            data.offsetTop && (data.offset.top = data.offsetTop)

            $spy.affix(data)
        })
    })
}(window.jQuery);

/**
 * alert
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* ALERT CLASS DEFINITION
     * ====================== */

    var dismiss = '[data-dismiss="alert"]'
        , Alert = function (el) {
            $(el).on('click', dismiss, this.close)
        }

    Alert.prototype.close = function (e) {
        var $this = $(this)
            , selector = $this.attr('data-target')
            , $parent

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        $parent = $(selector)

        e && e.preventDefault()

        $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

        $parent.trigger(e = $.Event('close'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent
                .trigger('closed')
                .remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent.on($.support.transition.end, removeElement) :
            removeElement()
    }


    /* ALERT PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.alert

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('alert')
            if (!data) $this.data('alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    /* ALERT NO CONFLICT
     * ================= */

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    /* ALERT DATA-API
     * ============== */

    $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/**
 * tooltip
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* TOOLTIP PUBLIC CLASS DEFINITION
     * =============================== */

    var Tooltip = function (element, options) {
        this.init('tooltip', element, options)
    }

    Tooltip.prototype = {

        constructor: Tooltip, init: function (type, element, options) {
            var eventIn
                , eventOut
                , triggers
                , trigger
                , i

            this.type = type
            this.$element = $(element)
            this.options = this.getOptions(options)
            this.enabled = true

            triggers = this.options.trigger.split(' ')

            for (i = triggers.length; i--;) {
                trigger = triggers[i]
                if (trigger == 'click') {
                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                } else if (trigger != 'manual') {
                    eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
                    eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
                    this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                }
            }

            this.options.selector ?
                (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
                this.fixTitle()
        }, getOptions: function (options) {
            options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

            if (options.delay && typeof options.delay == 'number') {
                options.delay = {
                    show: options.delay, hide: options.delay
                }
            }

            return options
        }, enter: function (e) {
            var defaults = $.fn[this.type].defaults
                , options = {}
                , self

            this._options && $.each(this._options, function (key, value) {
                if (defaults[key] != value) options[key] = value
            }, this)

            self = $(e.currentTarget)[this.type](options).data(this.type)

            if (!self.options.delay || !self.options.delay.show) return self.show()

            clearTimeout(this.timeout)
            self.hoverState = 'in'
            this.timeout = setTimeout(function () {
                if (self.hoverState == 'in') self.show()
            }, self.options.delay.show)
        }, leave: function (e) {
            var self = $(e.currentTarget)[this.type](this._options).data(this.type)

            if (this.timeout) clearTimeout(this.timeout)
            if (!self.options.delay || !self.options.delay.hide) return self.hide()

            self.hoverState = 'out'
            this.timeout = setTimeout(function () {
                if (self.hoverState == 'out') self.hide()
            }, self.options.delay.hide)
        }, show: function () {
            var $tip
                , pos
                , actualWidth
                , actualHeight
                , placement
                , tp
                , e = $.Event('show')

            if (this.hasContent() && this.enabled) {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $tip = this.tip()
                this.setContent()

                if (this.options.animation) {
                    $tip.addClass('fade')
                }

                placement = typeof this.options.placement == 'function' ?
                    this.options.placement.call(this, $tip[0], this.$element[0]) :
                    this.options.placement

                $tip
                    .detach()
                    .css({ top: 0, left: 0, display: 'block' })

                this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

                pos = this.getPosition()

                actualWidth = $tip[0].offsetWidth
                actualHeight = $tip[0].offsetHeight

                switch (placement) {
                    case 'bottom':
                        tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
                        break
                    case 'top':
                        tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
                        break
                    case 'left':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
                        break
                    case 'right':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
                        break
                }

                this.applyPlacement(tp, placement)
                this.$element.trigger('shown')
            }
        }, applyPlacement: function (offset, placement) {
            var $tip = this.tip()
                , width = $tip[0].offsetWidth
                , height = $tip[0].offsetHeight
                , actualWidth
                , actualHeight
                , delta
                , replace

            $tip
                .offset(offset)
                .addClass(placement)
                .addClass('in')

            actualWidth = $tip[0].offsetWidth
            actualHeight = $tip[0].offsetHeight

            if (placement == 'top' && actualHeight != height) {
                offset.top = offset.top + height - actualHeight
                replace = true
            }

            if (placement == 'bottom' || placement == 'top') {
                delta = 0

                if (offset.left < 0) {
                    delta = offset.left * -2
                    offset.left = 0
                    $tip.offset(offset)
                    actualWidth = $tip[0].offsetWidth
                    actualHeight = $tip[0].offsetHeight
                }

                this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
            } else {
                this.replaceArrow(actualHeight - height, actualHeight, 'top')
            }

            if (replace) $tip.offset(offset)
        }, replaceArrow: function (delta, dimension, position) {
            this
                .arrow()
                .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
        }, setContent: function () {
            var $tip = this.tip()
                , title = this.getTitle()

            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
            $tip.removeClass('fade in top bottom left right')
        }, hide: function () {
            var that = this
                , $tip = this.tip()
                , e = $.Event('hide')

            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return

            $tip.removeClass('in')

            function removeWithAnimation() {
                var timeout = setTimeout(function () {
                    $tip.off($.support.transition.end).detach()
                }, 500)

                $tip.one($.support.transition.end, function () {
                    clearTimeout(timeout)
                    $tip.detach()
                })
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                removeWithAnimation() :
                $tip.detach()

            this.$element.trigger('hidden')

            return this
        }, fixTitle: function () {
            var $e = this.$element
            if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
            }
        }, hasContent: function () {
            return this.getTitle()
        }, getPosition: function () {
            var el = this.$element[0]
            return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
                width: el.offsetWidth, height: el.offsetHeight
            }, this.$element.offset())
        }, getTitle: function () {
            var title
                , $e = this.$element
                , o = this.options

            title = $e.attr('data-original-title')
                || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

            return title
        }, tip: function () {
            return this.$tip = this.$tip || $(this.options.template)
        }, arrow: function () {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }, validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide()
                this.$element = null
                this.options = null
            }
        }, enable: function () {
            this.enabled = true
        }, disable: function () {
            this.enabled = false
        }, toggleEnabled: function () {
            this.enabled = !this.enabled
        }, toggle: function (e) {
            var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
            self.tip().hasClass('in') ? self.hide() : self.show()
        }, destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type)
        }

    }


    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

    var old = $.fn.tooltip

    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('tooltip')
                , options = typeof option == 'object' && option
            if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tooltip.Constructor = Tooltip

    $.fn.tooltip.defaults = {
        animation: true, placement: 'top', selector: false, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: 'hover focus', title: '', delay: 0, html: false, container: false
    }


    /* TOOLTIP NO CONFLICT
     * =================== */

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

    /* TOOLTIP API
     * =================== */
    $('a[data-toggle=tooltip]').mouseover(function () {
        $(this).tooltip('show');
    })

}(window.jQuery);

/**
 * popover
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* POPOVER PUBLIC CLASS DEFINITION
     * =============================== */

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }


    /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

        constructor: Popover, setContent: function () {
            var $tip = this.tip()
                , title = this.getTitle()
                , content = this.getContent()

            $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
            $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

            $tip.removeClass('fade top bottom left right in')
        }, hasContent: function () {
            return this.getTitle() || this.getContent()
        }, getContent: function () {
            var content
                , $e = this.$element
                , o = this.options

            content = (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)
                || $e.attr('data-content')

            return content
        }, tip: function () {
            if (!this.$tip) {
                this.$tip = $(this.options.template)
            }
            return this.$tip
        }, destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type)
        }

    })


    /* POPOVER PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.popover

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('popover')
                , options = typeof option == 'object' && option
            if (!data) $this.data('popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.popover.Constructor = Popover

    $.fn.popover.defaults = $.extend({}, $.fn.tooltip.defaults, {
        placement: 'right', trigger: 'click', content: '', template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    /* POPOVER NO CONFLICT
     * =================== */

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(window.jQuery);

/**
 * Modal
 */
!function ($) {

    "use strict"

    /* MODAL CLASS DEFINITION
     * ====================== */

    var Modal = function (content, options) {
        this.options = options
        this.$element = $(content)
            .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    }

    Modal.prototype = {

        constructor: Modal, toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        }, show: function () {
            var that = this

            if (this.isShown) return

            $('body').addClass('modal-open')

            this.isShown = true
            this.$element.trigger('show')

            escape.call(this)
            backdrop.call(this, function () {
                var transition = $.support.transition && that.$element.hasClass('fade')

                !that.$element.parent().length && that.$element.appendTo(document.body) //don't move modals dom position

                that.$element
                    .show()

                if (transition) {
                    that.$element[0].offsetWidth // force reflow
                }

                that.$element.addClass('in')

                transition ?
                    that.$element.one($.support.transition.end, function () {
                        that.$element.trigger('shown')
                    }) :
                    that.$element.trigger('shown')

            })
        }, hide: function (e) {
            e && e.preventDefault()

            if (!this.isShown) return

            var that = this
            this.isShown = false

            $('body').removeClass('modal-open')

            escape.call(this)

            this.$element
                .trigger('hide')
                .removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
                hideWithTransition.call(this) :
                hideModal.call(this)
        }

    }


    /* MODAL PRIVATE METHODS
     * ===================== */

    function hideWithTransition() {
        var that = this
            , timeout = setTimeout(function () {
                that.$element.off($.support.transition.end)
                hideModal.call(that)
            }, 500)

        this.$element.one($.support.transition.end, function () {
            clearTimeout(timeout)
            hideModal.call(that)
        })
    }

    function hideModal(that) {
        this.$element
            .hide()
            .trigger('hidden')

        backdrop.call(this)
    }

    function backdrop(callback) {
        var that = this
            , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(document.body)

            if (this.options.backdrop != 'static') {
                this.$backdrop.click($.proxy(this.hide, this))
            }

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            doAnimate ?
                this.$backdrop.one($.support.transition.end, callback) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
                removeBackdrop.call(this)

        } else if (callback) {
            callback()
        }
    }

    function removeBackdrop() {
        this.$backdrop.remove()
        this.$backdrop = null
    }

    function escape() {
        var that = this
        if (this.isShown && this.options.keyboard) {
            $(document).on('keyup.dismiss.modal', function (e) {
                e.which == 27 && that.hide()
            })
        } else if (!this.isShown) {
            $(document).off('keyup.dismiss.modal')
        }
    }


    /* MODAL PLUGIN DEFINITION
     * ======================= */

    $.fn.modal = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('modal')
                , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
    }

    $.fn.modal.defaults = {
        backdrop: true, keyboard: true, show: true
    }

    $.fn.modal.Constructor = Modal


    /* MODAL DATA-API
     * ============== */

    $(function () {
        $('body').on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
            var $this = $(this), href
                , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
                , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

            e.preventDefault()
            $target.modal(option)
        })
    })

}(window.jQuery);

/**
 * JavaScript Load Image 1.7
 */
(function ($) {
    'use strict';

    // Loads an image for a given File object.
    // Invokes the callback with an img or optional canvas
    // element (if supported by the browser) as parameter:
    var loadImage = function (file, callback, options) {
            var img = document.createElement('img'),
                url,
                oUrl;
            img.onerror = callback;
            img.onload = function () {
                if (oUrl && !(options && options.noRevoke)) {
                    loadImage.revokeObjectURL(oUrl);
                }
                if (callback) {
                    callback(loadImage.scale(img, options));
                }
            };
            if (loadImage.isInstanceOf('Blob', file) ||
                // Files are also Blob instances, but some browsers
                // (Firefox 3.6) support the File API but not Blobs:
                loadImage.isInstanceOf('File', file)) {
                url = oUrl = loadImage.createObjectURL(file);
                // Store the file type for resize processing:
                img._type = file.type;
            } else if (typeof file === 'string') {
                url = file;
                if (options && options.crossOrigin) {
                    img.crossOrigin = options.crossOrigin;
                }
            } else {
                return false;
            }
            if (url) {
                img.src = url;
                return img;
            }
            return loadImage.readFile(file, function (e) {
                var target = e.target;
                if (target && target.result) {
                    img.src = target.result;
                } else {
                    if (callback) {
                        callback(e);
                    }
                }
            });
        },
    // The check for URL.revokeObjectURL fixes an issue with Opera 12,
    // which provides URL.createObjectURL but doesn't properly implement it:
        urlAPI = (window.createObjectURL && window) ||
            (window.URL && URL.revokeObjectURL && URL) ||
            (window.webkitURL && webkitURL);

    loadImage.isInstanceOf = function (type, obj) {
        // Cross-frame instanceof check
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    };

    // Transform image orientation based on the given EXIF orientation data:
    loadImage.transformCoordinates = function (canvas, orientation) {
        var ctx = canvas.getContext('2d'),
            width = canvas.width,
            height = canvas.height;
        if (orientation > 4) {
            canvas.width = height;
            canvas.height = width;
        }
        switch (orientation) {
            case 2:
                // horizontal flip
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
                break;
            case 3:
                // 180 rotate left
                ctx.translate(width, height);
                ctx.rotate(Math.PI);
                break;
            case 4:
                // vertical flip
                ctx.translate(0, height);
                ctx.scale(1, -1);
                break;
            case 5:
                // vertical flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
            case 6:
                // 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -height);
                break;
            case 7:
                // horizontal flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(width, -height);
                ctx.scale(-1, 1);
                break;
            case 8:
                // 90 rotate left
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-width, 0);
                break;
        }
    };

    // Canvas render method, allows to override the
    // rendering e.g. to work around issues on iOS:
    loadImage.renderImageToCanvas = function (canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
        canvas.getContext('2d').drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destX,
            destY,
            destWidth,
            destHeight
        );
        return canvas;
    };

    // Scales the given image (img or canvas HTML element)
    // using the given options.
    // Returns a canvas object if the browser supports canvas
    // and the canvas or crop option is true or a canvas object
    // is passed as image, else the scaled image:
    loadImage.scale = function (img, options) {
        options = options || {};
        var canvas = document.createElement('canvas'),
            useCanvas = img.getContext ||
                ((options.canvas || options.crop || options.orientation) &&
                    canvas.getContext),
            width = img.width,
            height = img.height,
            sourceWidth = width,
            sourceHeight = height,
            sourceX = 0,
            sourceY = 0,
            destX = 0,
            destY = 0,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
            destWidth,
            destHeight,
            scale;
        if (useCanvas && options.orientation > 4) {
            maxWidth = options.maxHeight;
            maxHeight = options.maxWidth;
            minWidth = options.minHeight;
            minHeight = options.minWidth;
        } else {
            maxWidth = options.maxWidth;
            maxHeight = options.maxHeight;
            minWidth = options.minWidth;
            minHeight = options.minHeight;
        }
        if (useCanvas && maxWidth && maxHeight && options.crop) {
            destWidth = maxWidth;
            destHeight = maxHeight;
            if (width / height < maxWidth / maxHeight) {
                sourceHeight = maxHeight * width / maxWidth;
                sourceY = (height - sourceHeight) / 2;
            } else {
                sourceWidth = maxWidth * height / maxHeight;
                sourceX = (width - sourceWidth) / 2;
            }
        } else {
            destWidth = width;
            destHeight = height;
            scale = Math.max(
                (minWidth || destWidth) / destWidth,
                (minHeight || destHeight) / destHeight
            );
            if (scale > 1) {
                destWidth = Math.ceil(destWidth * scale);
                destHeight = Math.ceil(destHeight * scale);
            }
            scale = Math.min(
                (maxWidth || destWidth) / destWidth,
                (maxHeight || destHeight) / destHeight
            );
            if (scale < 1) {
                destWidth = Math.ceil(destWidth * scale);
                destHeight = Math.ceil(destHeight * scale);
            }
        }
        if (useCanvas) {
            canvas.width = destWidth;
            canvas.height = destHeight;
            loadImage.transformCoordinates(
                canvas,
                options.orientation
            );
            return loadImage.renderImageToCanvas(
                canvas,
                img,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                destX,
                destY,
                destWidth,
                destHeight
            );
        }
        img.width = destWidth;
        img.height = destHeight;
        return img;
    };

    loadImage.createObjectURL = function (file) {
        return urlAPI ? urlAPI.createObjectURL(file) : false;
    };

    loadImage.revokeObjectURL = function (url) {
        return urlAPI ? urlAPI.revokeObjectURL(url) : false;
    };

    // Loads a given File object via FileReader interface,
    // invokes the callback with the event object (load or error).
    // The result can be read via event.target.result:
    loadImage.readFile = function (file, callback, method) {
        if (window.FileReader) {
            var fileReader = new FileReader();
            fileReader.onload = fileReader.onerror = callback;
            method = method || 'readAsDataURL';
            if (fileReader[method]) {
                fileReader[method](file);
                return fileReader;
            }
        }
        return false;
    };

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return loadImage;
        });
    } else {
        $.loadImage = loadImage;
    }
}(this));

/**
 * Bootstrap Image Gallery 2.10
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
// Register as an anonymous AMD module:
        define([
            'jquery',
            'load-image',
            'bootstrap'
        ], factory);
    } else {
// Browser globals:
        factory(
            window.jQuery,
            window.loadImage
        );
    }
}(function ($, loadImage) {
    'use strict';
// Bootstrap Image Gallery is an extension to the Modal dialog of Twitter's
// Bootstrap toolkit, to ease navigation between a set of gallery images.
// It features transition effects, fullscreen mode and slideshow functionality.
    $.extend($.fn.modal.defaults, {
// Delegate to search gallery links from, can be anything that
// is accepted as parameter for $():
        delegate: document,
// Selector for gallery links:
        selector: null,
// The filter for the selected gallery links (e.g. set to ":odd" to
// filter out label and thumbnail linking twice to the same image):
        filter: '*',
// The index of the first gallery image to show:
        index: 0,
// The href of the first gallery image to show (overrides index):
        href: null,
// The range of images around the current one to preload:
        preloadRange: 2,
// Offset of image width to viewport width:
        offsetWidth: 100,
// Offset of image height to viewport height:
        offsetHeight: 200,
// Set to true to display images as canvas elements:
        canvas: false,
// Shows the next image after the given time in ms (0 = disabled):
        slideshow: 0,
// Defines the image division for previous/next clicks:
        imageClickDivision: 0.5
    });
    var originalShow = $.fn.modal.Constructor.prototype.show,
        originalHide = $.fn.modal.Constructor.prototype.hide;
    $.extend($.fn.modal.Constructor.prototype, {
        initLinks: function () {
            var $this = this,
                options = this.options,
                selector = options.selector ||
                    'a[data-target=' + options.target + ']';
            this.$links = $(options.delegate).find(selector)
                .filter(options.filter).each(function (index) {
                    if ($this.getUrl(this) === options.href) {
                        options.index = index;
                    }
                });
            if (!this.$links[options.index]) {
                options.index = 0;
            }
        },
        getUrl: function (element) {
            return element.href || $(element).data('href');
        },
        getDownloadUrl: function (element) {
            return $(element).data('download');
        },
        startSlideShow: function () {
            var $this = this;
            if (this.options.slideshow) {
                this._slideShow = window.setTimeout(
                    function () {
                        $this.next();
                    },
                    this.options.slideshow
                );
            }
        },
        stopSlideShow: function () {
            window.clearTimeout(this._slideShow);
        },
        toggleSlideShow: function () {
            var node = this.$element.find('.modal-slideshow');
            if (this.options.slideshow) {
                this.options.slideshow = 0;
                this.stopSlideShow();
            } else {
                this.options.slideshow = node.data('slideshow') || 5000;
                this.startSlideShow();
            }
            node.find('i').toggleClass('icon-play icon-pause');
        },
        preloadImages: function () {
            var options = this.options,
                range = options.index + options.preloadRange + 1,
                link,
                i;
            for (i = options.index - options.preloadRange; i < range; i += 1) {
                link = this.$links[i];
                if (link && i !== options.index) {
                    $('<img>').prop('src', this.getUrl(link));
                }
            }
        },
        loadImage: function () {
            var $this = this,
                modal = this.$element,
                index = this.options.index,
                url = this.getUrl(this.$links[index]),
                download = this.getDownloadUrl(this.$links[index]),
                oldImg;
            this.abortLoad();
            this.stopSlideShow();
            modal.trigger('beforeLoad');
// The timeout prevents displaying a loading status,
// if the image has already been loaded:
            this._loadingTimeout = window.setTimeout(function () {
                modal.addClass('modal-loading');
            }, 100);
            oldImg = modal.find('.modal-image').children().removeClass('in');
// The timeout allows transition effects to finish:
            window.setTimeout(function () {
                oldImg.remove();
            }, 3000);
            modal.find('.modal-title').text(this.$links[index].title);
            modal.find('.modal-download').prop(
                'href',
                download || url
            );
            this._loadingImage = loadImage(
                url,
                function (img) {
                    $this.img = img;
                    window.clearTimeout($this._loadingTimeout);
                    modal.removeClass('modal-loading');
                    modal.trigger('load');
                    $this.showImage(img);
                    $this.startSlideShow();
                },
                this._loadImageOptions
            );
            this.preloadImages();
        },
        showImage: function (img) {
            var modal = this.$element,
                transition = $.support.transition && modal.hasClass('fade'),
                method = transition ? modal.animate : modal.css,
                modalImage = modal.find('.modal-image'),
                clone,
                forceReflow;
            /**for firfox 的download**/
    //    var bro_firefox = $.browser.mozilla ? $.browser.mozilla : false;
    //    if(bro_firefox){
            if(navigator.userAgent.indexOf('Firefox') >= 0 ||navigator.userAgent.indexOf('MSIE 9.0') >= 0){
                var modal_download = modal.find(".modal-download");
                var url = modal_download.attr("href");
                modal_download.attr({"download":url,"href":""});
            }
            modalImage.css({
                width: img.width,
                height: img.height
            });
            modal.find('.modal-title').css({ width: Math.max(img.width, 380) });
            if (transition) {
                clone = modal.clone().hide().appendTo(document.body);
            }
            if ($(window).width() > 767) {
                method.call(modal.stop(), {
                    'margin-top': -((clone || modal).outerHeight() / 2),
                    'margin-left': -((clone || modal).outerWidth() / 2)
                });
            } else {
                modal.css({
                    top: ($(window).height() - (clone || modal).outerHeight()) / 2
                });
            }
            if (clone) {
                clone.remove();
            }
            modalImage.append(img);
            forceReflow = img.offsetWidth;
            modal.trigger('display');
            if (transition) {
                if (modal.is(':visible')) {
                    $(img).on(
                        $.support.transition.end,
                        function (e) {
// Make sure we don't respond to other transitions events
// in the container element, e.g. from button elements:
                            if (e.target === img) {
                                $(img).off($.support.transition.end);
                                modal.trigger('displayed');
                            }
                        }
                    ).addClass('in');
                } else {
                    $(img).addClass('in');
                    modal.one('shown', function () {
                        modal.trigger('displayed');
                    });
                }
            } else {
                $(img).addClass('in');
                modal.trigger('displayed');
            }
        },
        abortLoad: function () {
            if (this._loadingImage) {
                this._loadingImage.onload = this._loadingImage.onerror = null;
            }
            window.clearTimeout(this._loadingTimeout);
        },
        prev: function () {
            var options = this.options;
            options.index -= 1;
            if (options.index < 0) {
                options.index = this.$links.length - 1;
            }
            this.loadImage();
        },
        next: function () {
            var options = this.options;
            options.index += 1;
            if (options.index > this.$links.length - 1) {
                options.index = 0;
            }
            this.loadImage();
        },
        keyHandler: function (e) {
            switch (e.which) {
                case 37: // left
                case 38: // up
                    e.preventDefault();
                    this.prev();
                    break;
                case 39: // right
                case 40: // down
                    e.preventDefault();
                    this.next();
                    break;
            }
        },
        wheelHandler: function (e) {
            e.preventDefault();
            e = e.originalEvent;
            this._wheelCounter = this._wheelCounter || 0;
            this._wheelCounter += (e.wheelDelta || e.detail || 0);
            if ((e.wheelDelta && this._wheelCounter >= 120) ||
                (!e.wheelDelta && this._wheelCounter < 0)) {
                this.prev();
                this._wheelCounter = 0;
            } else if ((e.wheelDelta && this._wheelCounter <= -120) ||
                (!e.wheelDelta && this._wheelCounter > 0)) {
                this.next();
                this._wheelCounter = 0;
            }
        },
        initGalleryEvents: function () {
            var $this = this,
                modal = this.$element;
            modal.find('.modal-image').on('click.modal-gallery', function (e) {
                var modalImage = $(this);
                if ($this.$links.length === 1) {
                    $this.hide();
                } else {
                    if ((e.pageX - modalImage.offset().left) / modalImage.width() <
                        $this.options.imageClickDivision) {
                        $this.prev(e);
                    } else {
                        $this.next(e);
                    }
                }
            });
            modal.find('.modal-prev').on('click.modal-gallery', function (e) {
                $this.prev(e);
            });
            modal.find('.modal-next').on('click.modal-gallery', function (e) {
                $this.next(e);
            });
            modal.find('.modal-slideshow').on('click.modal-gallery', function (e) {
                $this.toggleSlideShow(e);
            });
            $(document)
                .on('keydown.modal-gallery', function (e) {
                    $this.keyHandler(e);
                })
                .on(
                'mousewheel.modal-gallery, DOMMouseScroll.modal-gallery',
                function (e) {
                    $this.wheelHandler(e);
                }
            );
        },
        destroyGalleryEvents: function () {
            var modal = this.$element;
            this.abortLoad();
            this.stopSlideShow();
            modal.find('.modal-image, .modal-prev, .modal-next, .modal-slideshow')
                .off('click.modal-gallery');
            $(document)
                .off('keydown.modal-gallery')
                .off('mousewheel.modal-gallery, DOMMouseScroll.modal-gallery');
        },
        show: function () {
            if (!this.isShown && this.$element.hasClass('modal-gallery')) {
                var modal = this.$element,
                    options = this.options,
                    windowWidth = $(window).width(),
                    windowHeight = $(window).height();
                if (modal.hasClass('modal-fullscreen')) {
                    this._loadImageOptions = {
                        maxWidth: windowWidth,
                        maxHeight: windowHeight,
                        canvas: options.canvas
                    };
                    if (modal.hasClass('modal-fullscreen-stretch')) {
                        this._loadImageOptions.minWidth = windowWidth;
                        this._loadImageOptions.minHeight = windowHeight;
                    }
                } else {
                    this._loadImageOptions = {
                        maxWidth: windowWidth - options.offsetWidth,
                        maxHeight: windowHeight - options.offsetHeight,
                        canvas: options.canvas
                    };
                }
                if (windowWidth > 767) {
                    modal.css({
                        'margin-top': -(modal.outerHeight() / 2),
                        'margin-left': -(modal.outerWidth() / 2)
                    });
                } else {
                    modal.css({
                        top: ($(window).height() - modal.outerHeight()) / 2
                    });
                }
                this.initGalleryEvents();
                this.initLinks();
                if (this.$links.length) {
                    modal.find('.modal-slideshow, .modal-prev, .modal-next')
                        .toggle(this.$links.length !== 1);
                    modal.toggleClass(
                        'modal-single',
                        this.$links.length === 1
                    );
                    this.loadImage();
                }
            }
            originalShow.apply(this, arguments);
        },
        hide: function () {
            if (this.isShown && this.$element.hasClass('modal-gallery')) {
                this.options.delegate = document;
                this.options.href = null;
                this.destroyGalleryEvents();
            }
            originalHide.apply(this, arguments);
        }
    });
    $(function () {
        $(document.body).on(
            'click.modal-gallery.data-api',
            '[data-toggle="modal-gallery"]',
            function (e) {
                var $this = $(this),
                    options = $this.data(),
                    modal = $(options.target),
                    data = modal.data('modal'),
                    link;
                if (!data) {
                    options = $.extend(modal.data(), options);
                }
                if (!options.selector) {
                    options.selector = 'a[data-gallery=gallery]';
                }
                link = $(e.target).closest(options.selector);
                if (link.length && modal.length) {
                    e.preventDefault();
                    options.href = link.prop('href') || link.data('href');
                    options.delegate = link[0] !== this ? this : document;
                    if (data) {
                        $.extend(data.options, options);
                    }
                    modal.modal(options);
                }
            }
        );
    });
}));

/**
 * dropdown
 */
!function ($) {

    "use strict"; // jshint ;_;


    /* DROPDOWN CLASS DEFINITION
     * ========================= */

    var toggle = '[data-toggle="dropdown"]'
        , Dropdown = function (element) {
            var $el = $(element).on('click.dropdown.data-api', this.toggle)
            $('html').on('click.dropdown.data-api', function () {
                $el.parent().removeClass('open')
            })
        }

    Dropdown.prototype = {

        constructor: Dropdown, toggle: function (e) {
            var $this = $(this)
                , $parent
                , selector
                , isActive

            if ($this.is('.disabled, :disabled')) return

            selector = $this.attr('data-target')

            if (!selector) {
                selector = $this.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
            }

            $parent = $(selector)
            $parent.length || ($parent = $this.parent())

            isActive = $parent.hasClass('open')

            clearMenus()

            if (!isActive) $parent.toggleClass('open')

            return false
        }

    }

    function clearMenus() {
        $(toggle).parent().removeClass('open')
    }


    /* DROPDOWN PLUGIN DEFINITION
     * ========================== */

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('dropdown')
            if (!data) $this.data('dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    /* APPLY TO STANDARD DROPDOWN ELEMENTS
     * =================================== */

    $(function () {
        $('html').on('click.dropdown.data-api', clearMenus)
        $('body')
            .on('click.dropdown', '.dropdown form', function (e) {
                e.stopPropagation()
            })
            .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    })

}(window.jQuery);
/**
 * 基于JQ的tab切换插件
 */
(function ($) {
    //插件主要内容
    $.fn.tab = function (options) {
        // 处理默认参数
        var opts = $.extend({}, $.fn.tab.defaults, options);
        return this.each(function () {
            var $this = $(this),
                $tabNavObj = $(opts.tabNavObj, $this),
                $tabContentObj = $(opts.tabContentObj, $this),
                $tabNavBtns = $(opts.tabNavBtn, $tabNavObj),
                $tabContentBlocks = $(opts.tabContent, $tabContentObj);
            $tabNavBtns.bind(opts.eventType,function () {
                var $that = $(this),
                    _index = $tabNavBtns.index($that);
                $that.addClass(opts.currentClass).siblings(opts.tabNavBtn).removeClass(opts.currentClass);
                $tabContentBlocks.eq(_index).show().siblings(opts.tabContent).hide();
            }).eq(0).trigger(opts.eventType);
        });
        // 保存JQ的连贯操作结束
    };
    //插件主要内容结束

    // 插件的defaults
    $.fn.tab.defaults = {
        tabNavObj: '.nav-tabs',
        tabNavBtn: 'li',
        tabContentObj: '.tab-content',
        tabContent: '.tab-pane',
        currentClass: 'active',
        eventType: 'click'
    };
// 闭包结束
})(jQuery);

/* =============================
 * bootstrap-typeahead.js v2.0.4
 * ============================= */
!function($){
    "use strict"; // jshint ;_;
    /* TYPEAHEAD PUBLIC CLASS DEFINITION
     * ================================= */
    var Typeahead = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.typeahead.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater
        this.$menu = $(this.options.menu).appendTo('.typeaheadWrap')
        this.source = this.options.source
//        this.sourceName = this.options.source.name
//        this.sourceurl = this.options.source.url
        this.shown = false
        this.listen()
    }
    Typeahead.prototype = {
        constructor: Typeahead
        , select: function () {
            var val = this.$menu.find('.active').attr('data-value')
            this.$element
                .val(this.updater(val))
                .change()
            return this.hide()
        }
        , updater: function (item) {
            return item
        }
        , show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            })
            this.$menu.css({
                top: pos.top + pos.height
                , left: pos.left
            })
            this.$menu.show()
            this.shown = true
            return this
        }
        , hide: function () {
            this.$menu.hide()
            this.shown = false
            return this
        }
        , lookup: function (event) {
            var that = this
                , items
                , q
            this.query = this.$element.val()
            if (!this.query) {
                return this.shown ? this.hide() : this
            }
            items = $.grep(this.source, function (item) {
                return that.matcher(item);
            })
            items = this.sorter(items)
            if (!items.length) {
                return this.shown ? this.hide() : this
            }
            return this.render(items.slice(0, this.options.items)).show()
        }
        , matcher: function (item) {
            var arr = item.split("@");
            return ~arr[0].toLowerCase().indexOf(this.query.toLowerCase())
        }
        , sorter: function (items) {
            var beginswith = []
                , caseSensitive = []
                , caseInsensitive = []
                , item
            while (item = items.shift()) {
                if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
                else if (~item.indexOf(this.query)) caseSensitive.push(item)
                else caseInsensitive.push(item)
            }
            return beginswith.concat(caseSensitive, caseInsensitive)
        }
        , highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        }
        , render: function (items) {
            var that = this
            items = $(items).map(function (i, item) {
                var arr = item.split("@");
                i = $(that.options.item).attr({"data-value": arr[0]})
                i.find('a').html(that.highlighter(arr[0])).attr({href:arr[1]});
                return i[0]
            })
            items.first().addClass('active')
            this.$menu.html(items)
            return this
        }
        , next: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , next = active.next()
            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }
            next.addClass('active')
        }
        , prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , prev = active.prev()
            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }
            prev.addClass('active')
        }
        , listen: function () {
            this.$element
                .on('blur', $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup', $.proxy(this.keyup, this))
//            if ($.browser.webkit || $.browser.msie) {
            this.$element.on('keydown', $.proxy(this.keypress, this))
//            }
            this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        }
        , keyup: function (e) {
            switch(e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                    break
                case 9: // tab
                case 13: // enter
                    if (!this.shown) return
//                    this.select()
                    this.$menu.find('.active a').click();
//                    console.log("click");
                    break
                case 27: // escape
                    if (!this.shown) return
                    this.hide()
                    break
                default:
                    this.lookup()
            }
            e.stopPropagation()
            e.preventDefault()
        }
        , keypress: function (e) {
            if (!this.shown) return;
            switch(e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;
                case 38: // up arrow
                    if (e.type != 'keydown') break;
                    e.preventDefault();
                    this.prev();
                    break
                case 40: // down arrow
                    if (e.type != 'keydown') break;
                    e.preventDefault();
                    this.next();
                    break;
            }
            e.stopPropagation();
        }
        , blur: function (e) {
            var that = this
            setTimeout(function () { that.hide() }, 150)
        }
        , click: function (e) {
//            e.stopPropagation()
//            e.preventDefault()
//            this.select()
        }
        , mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        }
    }
    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */
    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('typeahead')
                , options = typeof option == 'object' && option
            if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.typeahead.defaults = {
        source: []
        , items: 20
        , menu: '<div class="typeahead"></div>'
        , item: '<div><a href="#"></a></div>'
    }
    $.fn.typeahead.Constructor = Typeahead
    /* TYPEAHEAD DATA-API
     * ================== */
    $(function () {
        $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
            var $this = $(this)
            if ($this.data('typeahead')) return
            e.preventDefault()
            $this.typeahead($this.data())
        })
    })
}(window.jQuery);