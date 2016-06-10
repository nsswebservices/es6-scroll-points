'use strict';

let throttle = (fn, ms) => {
    let timeout,
        last = 0;
    return function() {
        let a = arguments,
            t = this,
            now = +(new Date()),
            exe = function() { 
                last = now; 
                fn.apply(t,a); 
            };
        window.clearTimeout(timeout);
        if(now >= last + ms) {
            exe();
        } else {
            timeout = window.setTimeout(exe, ms);
        }
    };
}

let instances = [],
        defaults = {
            offset: 0,
            callback: null,
            throttle: 60,
            className: 'is-scrolled-in',
            unload: true
        },
        StormScrollpoints = {
            init() {
				this.throttled = throttle(() => {
					this.check.call(this);
				}, this.settings.throttle);
				
				document.addEventListener('scroll', this.throttled, true);
				document.addEventListener('resize', this.throttled, true);
        		this.check();
            },
			check(){
				if (!!this.enteredView()) {
					this.DOMElement.classList.add(this.settings.className);
					!!this.settings.callback && this.settings.callback.call(this);

					if(!!this.settings.unload) {
						document.removeEventListener('scroll', this.throttled, true);
						document.addEventListener('resize', this.throttled, true);
					}
				}
			},
			enteredView(){
                var box = this.DOMElement.getBoundingClientRect(),
                    triggerPos = !!this.settings.offset.indexOf && this.settings.offset.indexOf('%') ? window.innerHeight - (window.innerHeight / 100) * +(this.settings.offset.substring(0, this.settings.offset.length - 1)) : window.innerHeight - +(this.settings.offset);
                
                triggerPos = isNaN(triggerPos) ? window.innerHeight : triggerPos;
                
                return (box.top - triggerPos <= 0);
			}
        };

	
let create = (el, i, opts) => {
    instances[i] = Object.assign(Object.create(StormScrollpoints), {
        DOMElement: el,
        settings: Object.assign({}, defaults, opts)
    });
    instances[i].init();
}

let init = (sel, opts) => {
    var els = [].slice.call(document.querySelectorAll(sel));
    
    if(els.length === 0) {
        throw new Error('Scroll Points cannot be initialised, no augmentable elements found');
    }
    
    els.forEach((el, i) => {
        create(el, i, opts);
    });
    return instances;
    
}

let reload = (sel, opts) => {
    [].slice.call(document.querySelectorAll(sel)).forEach((el, i) => {
        if(!instances.filter(instance => { return (instance.btn === el); }).length) {
            create(el, instances.length, opts);
        }
    });
}

let destroy = () => {
    instances = [];  
}

let ScrollPoints = { init, reload, destroy }

export { ScrollPoints };