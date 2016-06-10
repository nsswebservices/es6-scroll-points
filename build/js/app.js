'use strict';

var throttle = function throttle(fn, ms) {
    var timeout = void 0,
        last = 0;
    return function () {
        var a = arguments,
            t = this,
            now = +new Date(),
            exe = function exe() {
            last = now;
            fn.apply(t, a);
        };
        window.clearTimeout(timeout);
        if (now >= last + ms) {
            exe();
        } else {
            timeout = window.setTimeout(exe, ms);
        }
    };
};

var instances = [];
var defaults = {
    offset: 0,
    callback: null,
    throttle: 60,
    className: 'is-scrolled-in',
    unload: true
};
var StormScrollpoints = {
    init: function init() {
        var _this = this;

        this.throttled = throttle(function () {
            _this.check.call(_this);
        }, this.settings.throttle);

        document.addEventListener('scroll', this.throttled, true);
        document.addEventListener('resize', this.throttled, true);
        this.check();
    },
    check: function check() {
        if (!!this.enteredView()) {
            this.DOMElement.classList.add(this.settings.className);
            !!this.settings.callback && this.settings.callback.call(this);

            if (!!this.settings.unload) {
                document.removeEventListener('scroll', this.throttled, true);
                document.addEventListener('resize', this.throttled, true);
            }
        }
    },
    enteredView: function enteredView() {
        var box = this.DOMElement.getBoundingClientRect(),
            triggerPos = !!this.settings.offset.indexOf && this.settings.offset.indexOf('%') ? window.innerHeight - window.innerHeight / 100 * +this.settings.offset.substring(0, this.settings.offset.length - 1) : window.innerHeight - +this.settings.offset;

        triggerPos = isNaN(triggerPos) ? window.innerHeight : triggerPos;

        return box.top - triggerPos <= 0;
    }
};
var create = function create(el, i, opts) {
    instances[i] = Object.assign(Object.create(StormScrollpoints), {
        DOMElement: el,
        settings: Object.assign({}, defaults, opts)
    });
    instances[i].init();
};

var init = function init(sel, opts) {
    var els = [].slice.call(document.querySelectorAll(sel));

    if (els.length === 0) {
        throw new Error('Scroll Points cannot be initialised, no augmentable elements found');
    }

    els.forEach(function (el, i) {
        create(el, i, opts);
    });
    return instances;
};

var reload = function reload(sel, opts) {
    [].slice.call(document.querySelectorAll(sel)).forEach(function (el, i) {
        if (!instances.filter(function (instance) {
            return instance.btn === el;
        }).length) {
            create(el, instances.length, opts);
        }
    });
};

var destroy = function destroy() {
    instances = [];
};

var ScrollPoints = { init: init, reload: reload, destroy: destroy };

ScrollPoints.init('.js-scrollpoint');
//# sourceMappingURL=app.js.map
