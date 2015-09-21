/*jslint browser: true, devel: true, passfail: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function ($, ns) {

    ns.UXN = (function () {

        var settingsInitialized = false;
        
        function UXN(options /*Object? | String?*/) {

            if (!settingsInitialized) {

                UXN.DEFAULTS = $.extend({

                    openerOpened      : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "opened",             
                    itemOpened        : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "opened",        
                    subnavHasOpened   : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "has-opened", 
                    openerHighlighted : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "highlighted",   
                    itemHighlighted   : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "highlighted",   
                    openerHasSubnav   : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-subnav",   
                    itemHasSubnav     : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-subnav",       
                    currentSubnav     : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "current",        

                    horizontal        : UXN.PREFIX + "-horizontal",       

                    exclude           : UXN.PREFIX + "-exclude",               
                    excludeInside     : UXN.PREFIX + "-exclude" + UXN.BEM.MOD + "inside", 

                    subnavTop         : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "top",            
                    subnavBottom      : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "bottom",      
                    subnavLeft        : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "left",          
                    subnavRight       : UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "right",        
                    openerHasTop      : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-top",       
                    openerHasBottom   : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-bottom", 
                    openerHasLeft     : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-left",     
                    openerHasRight    : UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-right",   
                    itemHasTop        : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-top",           
                    itemHasBottom     : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-bottom",     
                    itemHasLeft       : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-left",         
                    itemHasRight      : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-right",       
                    positionSkip      : UXN.PREFIX + "-position" + UXN.BEM.MOD + "skip",      

                    slidingVertical   : UXN.PREFIX + "-sliding" + UXN.BEM.MOD + "vertical",     
                    slidingHorizontal : UXN.PREFIX + "-sliding" + UXN.BEM.MOD + "horizontal", 

                    noFading          : UXN.PREFIX + "-no-fading",                  
                    openerHasFadingOut: UXN.PREFIX + UXN.BEM.EL + "opener" + UXN.BEM.MOD + "has-fading-out", 
                    itemHasFadingOut  : UXN.PREFIX + UXN.BEM.EL + "item"   + UXN.BEM.MOD + "has-fading-out",     
                    subnavHasFadingOut: UXN.PREFIX + UXN.BEM.EL + "subnav" + UXN.BEM.MOD + "has-fading-out", 

                    instance          : "UXN",               
                    activeInstance    : "UXN" + UXN.BEM.MOD + "active"
                    
                }, UXN.DEFAULTS);
                
                UXN.POSITIONS = $.extend({

                    CLASSES: {
                        RESET: UXN.PREFIX + "-positioning" + UXN.BEM.EL + "reset-start"
                    },

                    IDS: {
                        STYLE: UXN.PREFIX + "-positioning" + UXN.BEM.EL + "style" 
                    }
                }, UXN.POSITIONS);
                
                DATA = $.extend({
                    RELATIVE_TO_PARENT: UXN.PREFIX + "RelativeToParent",
                    SKIP_POSITIONING:   UXN.PREFIX + "SkipPositioning",
                    LAST_RESET:         UXN.PREFIX + "LastReset",
                    RESET_SKIPPED:      UXN.PREFIX + "ResetSkipped"
                }, DATA);
                
                skipMouseEventsCounter = UXN.SKIP_MOUSE_EVENTS;
                
                settingsInitialized = true;
            }
            
            this.constructor = UXN;

            this.id = "UXN-" + (+new Date());
            
            checkOptions.call(this, options);

            this.opt = options ? $.extend({}, UXN.DEFAULTS, options) : UXN.DEFAULTS;
            
            init.call(this);
        }

        UXN.SUPPORT = {
            IS_IE8    : /MSIE 8.0/i.test(navigator.userAgent),
            IS_IELTE7 : /MSIE [0-7]{1}.[0-9]+/i.test(navigator.userAgent),
            IS_WEBKIT : /^(?!.*edge).*(webkit|opera|safari|chrome).*$/gi.test(navigator.userAgent),
            IS_EDGE   : /edge/i.test(navigator.userAgent),
            IS_FIREFOX: /firefox/i.test(navigator.userAgent),
            IS_FFLTE11: (function () {
                
                var ua = navigator.userAgent.match(/firefox\/([0-9]+)/i);
                
                return !!(ua && ua.length === 2 && +ua[1] <= 11);
                
            }()),
            
            MATCHES: !!document.body.matches,
            CLOSEST: !!document.body.closest,
            QUERYSELECTOR: !!document.body.querySelector,
            
            CLASSLIST: !!document.body.classList,
            CLIENTRECT: !!document.body.getBoundingClientRect,
            
            INSERT_TO_STYLE: (function () {
                
                try {
                    
                    document.createElement("style").innerHTML = "";
                    
                    return true;
                    
                } catch (e) {
                    
                    return false;
                }
            }()),
            
            TRANSITIONEND: (function () {
                
                var el = document.createElement('div'),

                    transitions = [
                        'transition'      , 'transitionend'      , ""        ,
                        'OTransition'     , 'otransitionend'     , "-o-"     ,
                        'MozTransition'   , 'transitionend'      , "-moz-"   ,
                        'WebkitTransition', 'webkitTransitionEnd', "-webkit-"
                    ],
                        
                    i = 0, length = transitions.length;

                for (i; i < length; i += 3) {
                    
                    if (el.style[transitions[i]] !== undefined) {
                        
                        this.TRANSITION_PREFIX = transitions[i + 2];

                        return transitions[i + 1];
                    }
                }

                return null;
                
            }()),
            
            ANIMATIONEND: (function () {

                var el = document.createElement('div'),

                    animations = [
                        "animation"      , "animationend"      , ""        ,
                        "OAnimation"     , "oAnimationEnd"     , "-o-"     ,
                        "MozAnimation"   , "animationend"      , "-moz-"   ,
                        "WebkitAnimation", "webkitAnimationEnd", "-webkit-"
                    ],
                        
                    i = 0, length = animations.length;

                for (i; i < length; i += 3) {
                    
                    if (el.style[animations[i]] !== undefined) {
                            
                        this.ANIMATION_PREFIX = animations[i + 2];
                        
                        return animations[i + 1];
                    }
                }

                return null;
                
            }())
        };
        
        UXN.U = {
            
            jQueryfy: function (elementOrSelector, $from) {
                
                if (typeof elementOrSelector === "object") {

                    if (elementOrSelector === null) {
                        
                        return $();
                    }
                    
                    var $el = elementOrSelector.jquery === $.prototype.jquery ? elementOrSelector : $(elementOrSelector);

                    if ($from) {
                        
                        if (!this.hasParent($from[0], $el[0])) {

                            return $();
                        }
                    }
                    
                    return $el;
                    
                } else {

                    return $from ? UXN.U.findFirst($from , elementOrSelector) : $(elementOrSelector);
                }
            },
            
            hasParent: function (parent, element) {

                if (!parent) {

                    return null;
                }

                while (element) {

                    element = element.parentNode;

                    if (element === parent) {

                        return true;
                    }
                }

                return false;
            },

            toArray: function (array) {

                return Array.prototype.slice.call(array);
            },

            toArrayWith$Objects: function ($elements) {

                var result = [],

                    i = 0, length = $elements.length;

                for (i; i < length; i++) {

                    result.push($($elements[i]));
                }

                return result;
            },

            getRect: (function () {

                if (UXN.SUPPORT.IS_IE8 || UXN.SUPPORT.IS_IELTE7) {

                    return function ($element) {

                        var rect = $element[0].getBoundingClientRect();
                        
                        return {
                            left: rect.left,
                            top: rect.top,
                            bottom: rect.bottom,
                            right: rect.right,
                            width: rect.right - rect.left,
                            height: rect.bottom - rect.top
                        };
                    };
                }

                if (UXN.SUPPORT.CLIENTRECT && !UXN.SUPPORT.IS_FFLTE11) {

                    return function ($element) {

                        return $element[0].getBoundingClientRect();
                    };
                }

                return function ($element) {

                    var offset = $element.offset(),

                        scrollTop = $win.scrollTop(),
                        scrollLeft = $win.scrollLeft(),

                        width = $element.outerWidth(),
                        height = $element.outerHeight();

                    return {
                        left: offset.left - scrollLeft,
                        top: offset.top - scrollTop,
                        bottom: offset.top - scrollTop + height,
                        right: offset.left - scrollLeft + width,
                        width: width,
                        height: height
                    };
                };
            }()),

            closest: (function () {

                if (UXN.SUPPORT.CLOSEST) {

                    return function ($element, selector) {

                        return $($element[0].closest(selector));
                    };
                }

                return function ($element, selector) {

                    return $element.closest(selector);
                };
            }()),

            matches: (function () {

                if (UXN.SUPPORT.MATCHES) {

                    return function ($element, selector) {

                        return $element[0].matches(selector);
                    };
                }

                return function ($element, selector) {

                    return $element.is(selector);
                };
            }()),
            
            findFirst: (function () {

                if (UXN.SUPPORT.QUERYSELECTOR) {

                    return function ($element, selector) {

                        return $($element[0].querySelector(selector));
                    };
                }

                return function ($element, selector) {

                    return $element.find(selector + ":first");
                };
            }()),
            
            findFirstByClass: function ($element, className) {

                return this.findFirst($element, "." + className);
            },
            
            findAllByClass: function ($element, className) {

                return this.findAll($element, "." + className);
            },
            
            findAll: (function () {

                if (UXN.SUPPORT.QUERYSELECTOR) {

                    return function ($element, selector) {

                        return $($element[0].querySelectorAll(selector));
                    };
                }

                return function ($element, selector) {

                    return $element.find(selector);
                };
            }()),

            addClass: (function () {

                if (UXN.SUPPORT.CLASSLIST) {

                    return function (/*$element, classNames*/) {
                        
                        var el = arguments[0][0],

                            i = 1, length = arguments.length;

                        for (i; i < length; i++) {

                            el.classList.add(arguments[i]);
                        }
                    };
                }

                return function (/*$element, classNames*/) {

                    var args = UXN.U.toArray(arguments),

                        $el = args.shift();

                    $el.addClass(args.join(" "));
                };
            }()),

            removeClass: (function () {

                if (UXN.SUPPORT.CLASSLIST) {

                    return function (/*$element, classNames*/) {

                        var el = arguments[0][0],

                            i = 1, length = arguments.length;

                        for (i; i < length; i++) {

                            el.classList.remove(arguments[i]);
                        }
                    };
                }

                return function (/*$element, classNames*/) {

                    var args = UXN.U.toArray(arguments),

                        $el = args.shift();

                    $el.removeClass(args.join(" "));
                };
            }()),

            hasClass: (function () {

                if (UXN.SUPPORT.CLASSLIST) {

                    return function ($element, className) {

                        return $element[0].classList.contains(className);
                    };
                }

                return function ($element, className) {

                    return $element.hasClass(className);
                };
            }())
        };

        UXN.MULTIPLE_INSTANCES = false;

        UXN.VENDOR_PREFIXES = false;
        
        UXN.SKIP_MOUSE_EVENTS = 0;

        UXN.BEM = {
            EL : "__",
            MOD: "--"
        };
        
        UXN.PREFIX = "UXN";

        UXN.EVENT_NS = "UXN";
        
        UXN.POSITION_BASE = {
            PAGE  : 1,
            WINDOW: 2
        };

        UXN.FADING_TYPE = {
            NONE      : 0,
            ANIMATION : 1,
            TRANSITION: 2,
            JS        : 3
        };
        
        UXN.POSITIONS = {
                                
            MAX_BATCH: 10,
            
            RELEASE_DELAY: 16
        };

        UXN.EVENT_TIMERS = {
            SCROLL       : 100,
            SCROLL_INSIDE:  50,
            SCROLL_NEXT  : 350,
            RESIZE       : 100,
            ELEMENT_SIZE : 250,
            INTERVAL     : 175,
            REPEATER     :   5
        };
        
        UXN.MAX_EVENTS = {
            OUT_OF_SURROUNDING: 15, 
            OUT_OF_TRIANGLE   : 15
        };
        
        UXN.DEFAULTS = {
            nav   : "#main-nav",
            subnav: "ul",
            item  : "li",
            opener: null,
            closer: "a", 

            autoHide: true,
            delayHide: false,
            hideFollowing: true,
            closeOnlyInLevel: false,
            doNotCloseFirstLevel: false,
            preventClickOnTouch: true,
            closeOnClick: false,
            keepOpened: true,

            autoSleep: true,

            onInit         : null,
            onSubnavChange : null,
            onClose        : null,
            onOpen         : null,

            excludeFirstLevel: true,

            setPositions: false,
            setPositionsOnScroll: true,
            setPositionsOnElement: false,
            setPositionsOnDeactivation: true,
            positionSkipOnFirstLevel: true,
            firstLevelPositionsFromCenter: false,
            positionBase          : UXN.POSITION_BASE.WINDOW,
            firstLevelPositionBase: UXN.POSITION_BASE.WINDOW,
            positionOffset: 10,

            onResetPositionsStart: null,
            onResetPositionsEnd  : null,

            allowSliding: true,
            allowSlidingOnFirstLevel: false,
            ignoreLayoutOnSliding: false,
            slidingZone: 75,

            mouseTolerance: 1,

            minZoneExt     :  25,
            maxZoneExt     : 250,
            zoneExtOffset  :   0,
            surroundingZone:  15,

            surroundingTimeout: 600,
            outsideTimeout    : 400,
            insideTimeout: (function () {

                switch (true) {
                    case UXN.SUPPORT.IS_IE8    : return 40;
                    case UXN.SUPPORT.IS_IELTE7 : return 50;
                    default                    : return 30;
                }
            }()),
            openTimeout: (function () {

                switch (true) {
                    case UXN.SUPPORT.IS_IE8    : return 40;
                    case UXN.SUPPORT.IS_IELTE7 : return 50;
                    default                    : return 30;
                }
            }()),

            fading: UXN.FADING_TYPE.NONE,
            animation: "UXN-hide",
            waitForFading: false,
            stopFadingOnHover: true,
            isFadedOut: function ($subnav /*jQuery*/, event /*TransitionEvent*/, done /*Function*/ /*<= Boolean*/) {

                return event.propertyName === "visibility";
            },

            debug: false
        };
        
        UXN.Debugger = null;
        
        var INSTANCES = [],

            INSTANCES_COUNT = 0,

            ACTIVE_INSTANCE = null,

            DIR = {
                DOWN_RIGHT: 1,
                DOWN_LEFT: 2,
                UP_RIGHT: 3,
                UP_LEFT: 4,
                LEFT: 5,
                RIGHT: 6,
                UP: 7,
                DOWN: 8
            },

            DATA = {},
            
            MSGS = {
                NO_DEBUGGER : "In minified versions of UXN the debugger is not available!"
            },
            
            OPTS_TO_TRIM = ["nav", "item", "opener", "closer", "subnav", "openerOpened", "itemOpened", "subnavHasOpened", "openerHighlighted", "itemHighlighted", "openerHasSubnav", "itemHasSubnav", "currentSubnav", "noFading", "openerHasFadingOut", "itemHasFadingOut", "subnavHasFadingOut"],
            
            $NULL = $(),

            $temp = $([null]),
            
            $win = $(window),

            $doc = $(document),

            $html = $("html"),

            possibleInstance = null,

            eventsAreRegistered = false,

            intervalEvent = null,
            
            skipMouseEventsCounter = 0,
            
            lastWinWidth = $win.width(),
            
            lastWinHeight = $win.height(),
            
            x = 0, y = 0,

            lastX = 0, lastY = 0,

            diffY = 0, diffX = 0,

            mouseDirection = 0,

            lastMouseDirection = null,

            byScroll = 0,

            lastScrollX = 0, lastScrollY = 0,

            horizontalScrollDirection = null,
            
            verticalScrollDirection = null,

            doNotCloseOnClick = false,

            byTouch = false,

            movedByTouch = false,

            resizeTimeout = null,

            init = function () {

                INSTANCES.push(this);

                INSTANCES_COUNT++;

                this.initializing = true;

                this.itemOpensSubnav = (!this.opt.opener || this.opt.opener === this.opt.item);

                if (this.itemOpensSubnav) {

                    this.opt.opener = this.opt.item;
                }
                
                this.sleeping = false;
                this.touchSleeping = false;

                this.$nav = $(this.opt.nav);
                
                UXN.U.addClass(this.$nav, this.opt.instance);
                
                this.$firstLevel = UXN.U.findFirst(this.$nav, this.opt.subnav);

                this.$waiting = $NULL;
                this.$currentSubnav = $NULL;
                this.$lastOpener = $NULL;
                this.$lastItem = $NULL;
                this.$currentTarget = $NULL;
                this.$lastOpened = $NULL;
                this.$lastOpenedSubnav = $NULL;
                this.$currentSubnavInZone = $NULL;
                this.$resetStartSubnav = $NULL;
                
                this.resetRequestQueue = [];
                this.positionBase = {};
                this.firstLevelPositionBase = {};
                this.positionBaseLastScroll = { y: 0, x: 0 };
                this.firstLevelPositionBaseLastScroll = { y: 0, x: 0 };
                
                if (this.opt.positionBase !== UXN.POSITION_BASE.WINDOW) {

                    this.$positionBase = this.opt.positionBase === UXN.POSITION_BASE.PAGE ? $html : UXN.U.jQueryfy(this.opt.positionBase);
                    
                } else {
                    
                    this.$positionBase = $NULL;
                }
                
                if (this.opt.firstLevelPositionBase !== UXN.POSITION_BASE.WINDOW) {
                    
                    this.$firstLevelPositionBase = this.opt.firstLevelPositionBase === UXN.POSITION_BASE.PAGE ? 
                            $html : UXN.U.jQueryfy(this.opt.firstLevelPositionBase);
                    
                } else {
                    
                    this.$firstLevelPositionBase = $NULL;
                }
                
                this.fadingOuts = [];
                                
                this.hasExcludeInsideClasses = !!UXN.U.findFirstByClass(this.$nav, this.opt.excludeInside).length;

                insertStylesForPositioning.call(this);
                
                if (this.opt.debug) {
                    
                    UXN.Debugger.insertStylesForDebugging(this);
                }
                
                addHasSubnavClasses.call(this);
                                
                if (this.opt.setPositions) {

                    var callback = $.proxy(initEvents, this);

                    callback.$opener = this.$nav;
                    
                    resetPositions.call(this, callback, false, true);
                        
                } else {

                    initEvents.call(this);
                }
            },

            checkOptions = function (options) {

                if (!options) {
                    
                    return;
                }

                if (typeof options === "string") {

                    options = {
                        nav: options
                    };
                }

                if (options.firstLevelPositionBase !== undefined && options.firstLevelPositionsFromCenter === undefined) {

                    options.firstLevelPositionsFromCenter = true;
                }

                if (options.firstLevelPositionBase !== undefined && options.positionSkipOnFirstLevel === undefined) {

                    options.positionSkipOnFirstLevel = false;
                }
                
                if (options.firstLevelPositionBase === undefined && options.positionBase !== undefined) {

                    options.firstLevelPositionBase = options.positionBase;
                }

                if ((options.fading === UXN.FADING_TYPE.TRANSITION && !UXN.SUPPORT.TRANSITIONEND) || 
                    (options.fading === UXN.FADING_TYPE.ANIMATION  && !UXN.SUPPORT.ANIMATIONEND)) {
                 
                    options.fading = UXN.FADING_TYPE.NONE;
                }

                if (options.fading !== UXN.FADING_TYPE.NONE && !UXN.VENDOR_PREFIXES) {
                    
                    if ((options.fading === UXN.FADING_TYPE.TRANSITION && UXN.SUPPORT.TRANSITION_PREFIX) || 
                        (options.fading === UXN.FADING_TYPE.ANIMATION  && UXN.SUPPORT.ANIMATION_PREFIX)) {

                        options.fading = UXN.FADING_TYPE.NONE;
                    }
                }
                
                var i = 0, length = OPTS_TO_TRIM.length;
                
                for (i; i < length; i++) {
                    
                    if (typeof options[OPTS_TO_TRIM[i]] === "string") {
                        
                        options[OPTS_TO_TRIM[i]] = $.trim(options[OPTS_TO_TRIM[i]]);
                        
                    } else if (options[OPTS_TO_TRIM[i]] !== undefined && OPTS_TO_TRIM[i] !== "nav") {

                        delete options[OPTS_TO_TRIM[i]];
                    }
                }
                
                if (options.closeOnlyInLevel || 
                    (options.hideFollowing && !options.closeOnlyInLevel && this.opt && this.opt.closeOnlyInLevel)) {
                    
                    options.hideFollowing = false;
                }
                
                if (options.debug) {

                    if (typeof UXN.Debugger !== "object" || UXN.Debugger === null) {

                        options.debug = false;
                        
                        if (console && console.warn) {
                            
                            console.warn(UXN.Debugger ? UXN.Debugger: MSGS.NO_DEBUGGER);
                        }
                        
                        return;
                    }

                    options.insideTimeout = 
                        (options.insideTimeout ? options.insideTimeout : UXN.DEFAULTS.insideTimeout) * UXN.DEBUG.TIMEOUT_MULTIPLIER;

                    options.openTimeout = 
                        (options.openTimeout ? options.openTimeout : UXN.DEFAULTS.openTimeout) * UXN.DEBUG.TIMEOUT_MULTIPLIER;
                }
            },
                        
            addHasSubnavClasses = function () {

                var $openers = this.getAllOpeners(null, false, true),

                    i = 0, length = $openers.length;

                for (i; i < length; i++) {

                    $temp[0] = $openers[i];

                    if (this.getSubnav($temp).length) {
                  
                        if (this.itemOpensSubnav) {
                            
                            UXN.U.addClass($temp, this.opt.itemHasSubnav);
                            
                        } else {
                            
                            UXN.U.addClass($temp, this.opt.openerHasSubnav);

                            var $item = this.getClosestItem($temp);

                            UXN.U.addClass($item, this.opt.itemHasSubnav);
                        }
                    }
                }
            },

            removeInstance = function () {

                var i = INSTANCES_COUNT - 1;

                for (i; i >= 0; i--) {

                    if (INSTANCES[i] === this) {

                        INSTANCES.splice(i, 1);

                        break;
                    }
                }

                INSTANCES_COUNT--;
            },

            removeAllClasses = function () {

                UXN.U.removeClass(this.$nav, this.opt.activeInstance, this.opt.instance);
                
                var items = this.getAllItems(null, true, true),
                    
                    i = 0, iLength = items.length;
                
                for (i; i < iLength; i++)  {
                    
                    UXN.U.removeClass(items[i],
                        this.opt.itemOpened,
                        this.opt.itemHighlighted,
                        this.opt.itemHasSubnav,
                        this.opt.itemHasFadingOut,
                        this.opt.itemHasTop,
                        this.opt.itemHasLeft,
                        this.opt.itemHasBottom,
                        this.opt.itemHasRight
                    );
                }

                if (!this.itemOpensSubnav) {

                    var openers = this.getAllOpeners(null, true, true),
                    
                    o = 0, oLength = openers.length;
                    
                    for (o; o < oLength; o++)  {

                        UXN.U.removeClass(openers[o],
                            this.opt.openerOpened,
                            this.opt.openerHighlighted,
                            this.opt.openerHasSubnav,
                            this.opt.openerHasFadingOut,
                            this.opt.openerHasTop,
                            this.opt.openerHasLeft,
                            this.opt.openerHasBottom,
                            this.opt.openerHasRight
                         );
                    }
                }

                var subnavs = this.getAllSubnavs(null, true),
                    
                    s = 0, sLength = subnavs.length;

                for (s; s < sLength; s++)  {

                    UXN.U.removeClass(subnavs[s],
                        this.opt.currentSubnav,
                        this.opt.subnavTop,
                        this.opt.subnavLeft,
                        this.opt.subnavBottom,
                        this.opt.subnavRight
                    );
                }
            },

            removeStylesForPositioning = (function () {

                if (UXN.SUPPORT.INSERT_TO_STYLE) {

                    return function () {

                        if (INSTANCES_COUNT === 1) {

                            $("#" + UXN.POSITIONS.IDS.STYLE).remove();

                        } else {
                            
                            insertStylesForPositioning.call(this, true);
                        }
                    };
                } 

                return function () {

                    $("#" + UXN.POSITIONS.IDS.STYLE + "-" + this.id).remove();
                };
            }()),

            getResetSelectorForItem = function (isLast) {

                return "\t" + this.opt.nav + " ." + UXN.POSITIONS.CLASSES.RESET + (isLast ? " {\n" : ",\n");
            },

            getResetSelectorForSubnav = function (isLast) {

                return "\t" + this.opt.nav + " ." + UXN.POSITIONS.CLASSES.RESET + " " + this.opt.subnav + (isLast ? " {\n" : ",\n");
            },
            
            insertStylesForPositioning = (function () {

                if (UXN.SUPPORT.INSERT_TO_STYLE) {

                    return function (remove) {

                        var $inserted = $("#" + UXN.POSITIONS.IDS.STYLE),
                            
                            i = 0,

                            isLast = false,
                            
                            itemSelector = "",

                            subnavSelector = "";

                        for (i; i < INSTANCES_COUNT; i++) {

                            if (remove && INSTANCES[i] === this) {
                                
                                continue;
                            }
                            
                            isLast = i === INSTANCES_COUNT - 1 || (remove && INSTANCES[i + 1] === this);
                            
                            itemSelector += getResetSelectorForItem.call(INSTANCES[i], isLast);

                            subnavSelector += getResetSelectorForSubnav.call(INSTANCES[i], isLast);
                        }

                        var $style = $inserted.length ? $inserted: $("<style />"),
                            
                            styleText = [

                            "\n" + itemSelector,
                                "\t\toverflow: hidden !important;\n",
                            "\t}\n",

                            "\n" + subnavSelector
                        ];
                        
                        if (UXN.VENDOR_PREFIXES && UXN.SUPPORT.TRANSITION_PREFIX) {

                            styleText.push("\t\t" + UXN.SUPPORT.TRANSITION_PREFIX + "transition: none !important;\n");
                        }

                        styleText.push("\t\ttransition: none !important;\n");

                        if (UXN.VENDOR_PREFIXES && UXN.SUPPORT.ANIMATION_PREFIX) {

                            styleText.push("\t\t" + UXN.SUPPORT.ANIMATION_PREFIX + "animation-duration: 0s !important;\n");
                        } 

                        styleText.push("\t\tanimation-duration: 0s !important;\n");

                        styleText.push("\t\tvisibility: hidden !important;\n");
                        styleText.push("\t}\n");
                        
                        $style.text(styleText.join(""));
                        
                        if (!$inserted.length) {
                            
                            $style[0].id = UXN.POSITIONS.IDS.STYLE;

                            $style.appendTo("head");
                        }
                    };
                }

                return function () {

                    var style = "<style id='" + UXN.POSITIONS.IDS.STYLE + "-" + this.id + "'>";

                    style += [

                        "\n" + getResetSelectorForItem.call(this, true),
                            "\t\toverflow: hidden !important;\n",
                        "\t}\n",

                        "\n" + getResetSelectorForSubnav.call(this, true),
                            "\t\tvisibility: hidden !important;\n",
                        "\t}\n"
                        
                    ].join("");

                    style += "</style>";

                    var $head = $("head");

                    $head.html($head.html() + style);
                };
            }()),

            turnOn = function () {

                if (UXN.MULTIPLE_INSTANCES) {

                    UXN.U.addClass(this.$nav, this.opt.activeInstance);

                    this.on = true;

                    this.positionChangedWhileOn = false;
                    
                    ACTIVE_INSTANCE = this;
                    
                    return true;
                }

                if (ACTIVE_INSTANCE === this) {

                    return true;
                }

                if (ACTIVE_INSTANCE) {

                    return false;
                }

                ACTIVE_INSTANCE = this;

                UXN.U.addClass(this.$nav, this.opt.activeInstance);

                this.on = true;

                this.positionChangedWhileOn = false;

                return true;
            },

            turnOff = function () {

                if (UXN.MULTIPLE_INSTANCES) {

                    if ((!this.opt.doNotCloseFirstLevel && !this.hasFirstLevelOpenedSubnav()) || 
                        ( this.opt.doNotCloseFirstLevel && this.getOpenedItemsInSubnav(this.$firstLevel).length === 1)) {
                        
                        if (!this.opt.waitForFading) {

                            UXN.U.removeClass(this.$nav, this.opt.activeInstance);
                        }

                        setCurrentSubnav.call(this, $NULL);

                        this.inTriangleZoneCounter = null;
                        this.inSurroundingZoneCounter = null;
                        
                        this.on = false;
                    }

                    if (this.on) {
                        
                        return;
                    }
                    
                    if (this.isAnySubnavFading()) {

                        return;
                    }

                    if (this.opt.waitForFading) {

                        UXN.U.removeClass(this.$nav, this.opt.activeInstance);
                    }
                                       
                    if (this.opt.setPositions && this.opt.setPositionsOnDeactivation) {

                        if (this.positionChangedWhileOn) {

                            this.ignoreChangeOnReset = true;
                            
                            resetPositionsOnEvent.call(this);
                        }
                    }

                    return;
                }

                if (ACTIVE_INSTANCE && ACTIVE_INSTANCE !== this) {
                    
                    return;
                }
                
                if (!this.opt.doNotCloseFirstLevel && this.hasFirstLevelOpenedSubnav()) {

                    return;
                }
                
                if (this.opt.doNotCloseFirstLevel && this.getOpenedItemsInSubnav(this.$firstLevel).length > 1) {

                    return;
                }
                
                if (this.opt.waitForFading && this.isAnySubnavFading()) {

                    return;
                }

                ACTIVE_INSTANCE = null;
                
                this.inTriangleZoneCounter = null;
                this.inSurroundingZoneCounter = null;
                
                this.on = false;

                setCurrentSubnav.call(this, $NULL);
                
                UXN.U.removeClass(this.$nav, this.opt.activeInstance);
                
                if (this.opt.setPositions && this.opt.setPositionsOnDeactivation) {

                    if (this.positionChangedWhileOn) {
                        
                        this.ignoreChangeOnReset = true;
                        
                        resetPositionsOnEvent.call(this);
                    }
                }
            },
  
            initEvents = function () {

                if (!eventsAreRegistered) {

                    lastMouseDirection = DIR.DOWN_RIGHT;

                    lastScrollX = $win.scrollLeft();

                    $doc.on("touchend." + UXN.EVENT_NS, globalTouchendHandler)

                        .on("click." + UXN.EVENT_NS, globalClickHandler)

                        .on("touchstart." + UXN.EVENT_NS, globalTouchstartHandler)

                        .on("touchmove." + UXN.EVENT_NS, globalTouchmoveHandler)

                        .on("mousemove." + UXN.EVENT_NS, globalMousemoveHandler);

                    $win.on("scroll." + UXN.EVENT_NS, globalScrollHandler)

                        .on("resize." + UXN.EVENT_NS, globalResizeHandler);
                    
                    intervalEvent = setInterval(globalIntervalHandler, UXN.EVENT_TIMERS.INTERVAL);

                    eventsAreRegistered = true;
                }
                
                if (this.opt.setPositionsOnScroll) {

                    if (this.opt.positionBase !== UXN.POSITION_BASE.WINDOW) {
                        
                        this.$positionBase.on("scroll." + UXN.EVENT_NS, $.proxy(scrollHandler, this, true));
                    }
                    

                    if (this.opt.firstlevelPositionBase !== UXN.POSITION_BASE.WINDOW) {

                        this.$firstLevelPositionBase.on("scroll." + UXN.EVENT_NS, $.proxy(scrollHandler, this, true));
                    }
                }
                
                if (typeof this.opt.onInit === "function") {
                    
                    this.opt.onInit.call(this);
                }
                
                this.initializing = false;
                
                this.settingPositionsOnFirstLevelInProgress = false;
            },

            removeEvents = function () {

                if (INSTANCES_COUNT === 1) {

                    $doc.off("." + UXN.EVENT_NS);

                    $win.off("." + UXN.EVENT_NS);

                    clearInterval(intervalEvent);

                    eventsAreRegistered = false;
                }
                
                this.$positionBase.off("scroll." + UXN.EVENT_NS);

                this.$firstLevelPositionBase.off("scroll." + UXN.EVENT_NS);
            },

            checkSleeping = function () {
                
                if (this.opt.autoSleep) {
                    
                    if (this.isNavInsideViewport()) {
                        
                        this.wake();
                        
                    } else if (!this.on && !this.isAnySubnavFading()) {
                        
                        this.sleep(true);
                    }
                }
            },
      
            getEventData = function ($target) {

                var $opener = this.getClosestOpener($target),

                    $item = !this.itemOpensSubnav ? this.getClosestItem($target) : $opener,

                    $subnav = this.getClosestSubnav($target),

                    debugSVG = false;
                
                if (this.opt.debug && UXN.U.closest($target, "." + UXN.DEBUG.CLASSES.SVG).length) {

                    $opener = $NULL;

                    $item = $NULL;

                    $subnav = $NULL;

                    debugSVG = true;
                }
                
                this.$realCurrentTarget = $target;
                
                this.$currentTarget = $opener.length ? $opener : $target;

                this.$currentOpener = $opener.length ? $opener : $NULL;
                
                this.$currentItem = $item;

                this.inside = UXN.U.hasParent(this.$nav[0], this.$currentTarget[0]) && !debugSVG;

                if (!this.inside && this.$nav[0] === this.$currentTarget[0]) {

                    this.inside = true;
                }
                
                setCurrentSubnav.call(this, $subnav.length ? $subnav : this.$currentSubnav || $NULL);

                if (this.$currentSubnav.length && this.hasSubnavOpenedSubnav(this.$currentSubnav)) {
                    
                    this.$lastOpened = this.getOpenedOpenersInSubnav(this.$currentSubnav).first();
                    
                    this.$lastOpenedSubnav = this.getSubnav(this.$lastOpened);
                }
                
                return {
                    $opener: $opener,
                    $item: $item,
                    $subnav: $subnav
                };
            },

            setCurrentSubnav = function ($subnav) {

                if ((this.inside || !$subnav.length) && this.$currentSubnav[0] !== $subnav[0]) {

                    if (this.$currentSubnav.length) {

                        UXN.U.removeClass(this.$currentSubnav, this.opt.currentSubnav);
                    }

                    if (typeof this.opt.onSubnavChange === "function") {
                        
                        this.opt.onSubnavChange.call(this, $subnav, this.$currentSubnav);
                    }
                    
                    this.$currentSubnav = $subnav;

                    if ($subnav.length) {

                        UXN.U.addClass(this.$currentSubnav, this.opt.currentSubnav);
                        
                        if (this.positionChangedWhileOn) {
                            
                            resetPositionsOnCurrentSubnavChange.call(this);
                        }
                    }
                }
            },
            
            touchendHandler = function ($target) {

                var eData = getEventData.call(this, $target),
                    
                    hasOpenerSubnav = eData.$opener.length && this.hasOpenerSubnav(eData.$opener);

                if (this.inside && isSettingPositionsInProgress.call(this, $target)) {

                    if (eData.$opener.length && hasOpenerSubnav) {

                        this.preventClickDefault = this.opt.preventClickOnTouch;
                    }

                    this.touchendRepeater = setTimeout($.proxy(function() {
                        
                        touchendHandler.call(this, $target);
                        
                    }, this), UXN.EVENT_TIMERS.REPEATER);
                    
                    return true;
                }
                
                var possiblyCloseAll = false;

                // tap on item with subnav => preventDefault
                if (this.inside && this.itemOpensSubnav && eData.$opener.length) {

                    if (hasOpenerSubnav) {

                        this.preventClickDefault = this.opt.preventClickOnTouch;

                    } else {

                        possiblyCloseAll = true;
                    }
                }

                // top on subnav inside opener
                if (this.inside && !UXN.U.hasParent(eData.$subnav[0], eData.$opener[0])) {

                    possiblyCloseAll = true;
                }

                // tap outside nav
                if (!eData.$opener.length || !this.inside) {

                    if (this.$lastOpener.length) {

                        mouseLeave.call(this, $target, eData.$subnav);
                    }
                    
                    this.$lastOpener = $NULL;

                    this.$lastItem = $NULL;

                    this.$lastOpened = $NULL;

                    turnOff.call(this);

                    return false;
                }

                if (this.inside && !this.on) {
            
                    if (!turnOn.call(this)) {

                        possibleInstance = this;

                        return false;
                    }
                }

                if (this.hasOpenerOpenedSubnav(eData.$opener) && (!this.isAnySubnavFading() || !this.isInFadingSubnav($target))) {

                    if (this.$lastOpener.length) { 
                        
                        mouseLeave.call(this, eData.$subnav, eData.$subnav);
                    }

                    if (possiblyCloseAll) {

                        this.closeOnClickByTouch = true;

                        this.preventClickDefault = false;
                    }

                    this.$lastOpener = eData.$opener;

                    this.$lastItem = eData.$item;

                    if (!this.hasFirstLevelOpenedSubnav()) {

                        turnOff.call(this);

                        this.$lastOpened = $NULL;
                        
                        this.$lastOpener = $NULL;
                    }

                    return this.on;
                }

                if (this.$lastOpener.length && this.$lastOpener[0] !== eData.$opener[0]) {

                    mouseLeave.call(this, eData.$opener, eData.$subnav);
                }

                mouseEnter.call(this, eData.$opener, eData.$item, null, true);

                if (possiblyCloseAll && !this.preventClickDefault) {

                    this.closeOnClickByTouch = true;
                }

                if (!hasOpenerSubnav) {

                    turnOff.call(this);

                    this.$lastOpened = $NULL;
                    
                    this.$lastOpener = $NULL;
                }

                this.$lastOpener = eData.$opener;

                this.$lastItem = eData.$item;

                return this.on;
            },

            globalClickHandler = function (e) {
                
                var $target = $(e.target),
                    
                    i = 0;

                for (i; i < INSTANCES_COUNT; i++) {

                    if (INSTANCES[i].initializing || (INSTANCES[i].sleeping && !byTouch) || INSTANCES[i].touchSleeping) {
                        
                        continue;
                    }

                    if (clickHandler.call(INSTANCES[i], $target)) {

                        e.preventDefault();
                    }
                }

                doNotCloseOnClick = false;

                byTouch = false;
            },

            clickHandler = function ($target) {

                if (byTouch && $target[0].tagName.toLowerCase() === "a" && 
                    (((this.on && this.inside) || UXN.U.hasParent(this.$nav[0], $target[0])) && 
                    (!this.$currentSubnav.length || this.getClosestSubnav($target)[0] !== this.$currentSubnav[0] || 
                    ($target[0] !== this.$realCurrentTarget[0] && 
                     !UXN.U.hasParent(this.$realCurrentTarget[0], $target[0]) && 
                     !UXN.U.hasParent($target[0], this.$realCurrentTarget[0]))))) {
                
                    return true;
                }
                
                if (this.on && this.inside && this.opt.preventClickOnTouch && !this.preventClickDefault) {

                    var $closestOpener = this.getClosestOpener($target);

                    if ($closestOpener.length && this.hasOpenerSubnav($target) && UXN.U.hasParent(this.$currentSubnav[0], this.$currentOpener[0])) {

                        this.preventClickDefault = true;
                    }
                }
                
                if ((this.opt.closeOnClick && !doNotCloseOnClick) || !this.inside) {

                    this.isClosingByClick = this.inside;
                    
                    hideMenu.call(this, null);
                }

                if (this.opt.closeOnClick && this.closeOnClickByTouch) {

                    this.closeOnClickByTouch = false;

                    hideMenu.call(this, null);
                }
                
                if (this.preventClickDefault && byTouch) {

                    this.preventClickDefault = false;

                    return true;
                }
                
                if (!this.opt.closeOnClick && this.shouldCloseNav($target)) {

                    this.isClosingByClick = true;

                    hideMenu.call(this, null);
                }

                return false;
            },

            globalIntervalHandler = function () {

                var i = 0;

                for (i; i < INSTANCES_COUNT; i++) {

                    if (!INSTANCES[i].sleeping && !INSTANCES[i].initializing) {
                        
                        this.lastIntervalInstance = INSTANCES[i];
                        
                        checkSleeping.call(INSTANCES[i]);
                        
                        intervalHandler.call(INSTANCES[i]);

                        elementSizeHandler.call(INSTANCES[i]);
                    }
                }
            },

            intervalHandler = function () {

                if (this.opt.debug && !this.hasFirstLevelOpenedSubnav()) {

                    UXN.Debugger.clearDebug(this);
                }
            },
            
            elementSizeHandler = function () {

                if (!this.opt.setPositions || !this.opt.setPositionsOnElement) {
                    
                    return;
                }

                var elementSizeChanged = false,
                
                    positionBaseRect = getPositionBaseData.call(this, true);
                
                if (this.$positionBase.length && this.opt.positionBase !== UXN.POSITION_BASE.WINDOW) {

                    positionBaseRect = UXN.U.getRect(this.$positionBase);

                    elementSizeChanged = wasElementSizeChanged.call(this, positionBaseRect, this.positionBase);
                }
                
                if (!elementSizeChanged && this.$firstLevelPositionBase.length && 
                    this.opt.firstLevelPositionBase !== this.opt.positionBase &&
                    this.opt.firstLevelPositionBase !== UXN.POSITION_BASE.WINDOW) {

                    if (!this.$positionBase.length || this.$positionBase[0] !== this.$firstLevelPositionBase[0]) {

                        var positionBaseRect2 = getFirstLevelPositionBaseData.call(this, true);

                        elementSizeChanged = wasElementSizeChanged.call(this, positionBaseRect2, this.firstLevelPositionBase);

                        this.firstLevelPositionBase = positionBaseRect2;
                    }
                }
                
                if (elementSizeChanged) {

                    clearTimeout(this.elementSizeTimeout);

                    this.elementSizeTimeout = setTimeout($.proxy(function () {

                        if (this.lastIntervalInstance === this) {

                            clearTimeout(resizeTimeout);
                        }

                        clearTimeout(this.scrollTimeout);

                        resetCurrentFirstAndLastOpenedLevel.call(this);

                    }, this), UXN.EVENT_TIMERS.ELEMENT_SIZE);
                }
                
                this.positionBase = positionBaseRect;
            },
            
            wasElementSizeChanged = function (elementRect, lastRect) {

                return lastRect && (elementRect.height !== lastRect.height || elementRect.width !== lastRect.width);
            },

            globalResizeHandler = function () {

                clearTimeout(resizeTimeout);

                resizeTimeout = setTimeout(function () {

                    var i = 0;

                    for (i; i < INSTANCES_COUNT; i++) {

                        checkSleeping.call(INSTANCES[i]);
                        
                        if (!INSTANCES[i].sleeping && !INSTANCES[i].initializing) {
                            
                            resizeHandler.call(INSTANCES[i]);
                        }
                    }

                    resizeTimeout = null;

                }, UXN.EVENT_TIMERS.RESIZE);
                
                lastWinWidth = $win.width();
            
                lastWinHeight = $win.height();
            },

            resizeHandler = function () {

                if (!this.opt.setPositions) {

                    return;
                }

                clearTimeout(this.scrollTimeout);

                resetPositionsOnEvent.call(this);
            },

            globalScrollHandler = function () {

                byScroll = 1;

                horizontalScrollDirection = getGlobalHorizontalScrollDirection();
                
                verticalScrollDirection = getGlobalVerticalScrollDirection();

                var i = 0;

                for (i; i < INSTANCES_COUNT; i++) {

                    checkSleeping.call(INSTANCES[i]);

                    if (!INSTANCES[i].sleeping && !INSTANCES[i].initializing) {

                        this.lastScrollInstance = INSTANCES[i];

                        scrollHandler.call(INSTANCES[i]);
                    }
                }

                lastScrollX = $win.scrollLeft();
                
                lastScrollY = $win.scrollTop();
            },

            scrollHandler = function (byBaseElement, event) {

                var $target, $source;
                
                if (byBaseElement) {

                    $target = $(event.target);

                    $source = event.target === this.$positionBase[0] ? this.positionBaseLastScroll: this.firstLevelPositionBaseLastScroll;
                    
                    this.horizontalScrollDirection = getHorizontalScrollDirection.call(this, $target, $source);

                    this.verticalScrollDirection = getVerticalScrollDirection.call(this, $target, $source);

                    checkSleeping.call(this);
                    
                    byScroll = 1;
                }
                
                if (horizontalScrollDirection || verticalScrollDirection || this.horizontalScrollDirection || this.verticalScrollDirection) {
                    
                    this.positionChangedWhileOn = true;
                }
                
                if (!this.opt.setPositions || !this.opt.setPositionsOnScroll) {

                    return;
                }

                clearTimeout(this.scrollTimeout);

                this.scrollTimeout = setTimeout($.proxy(
                    resetOnScroll, this, x, y), this.inside ? UXN.EVENT_TIMERS.SCROLL_INSIDE : UXN.EVENT_TIMERS.SCROLL
                );
                
                if (byBaseElement) {

                    $source.x = $target.scrollLeft();

                    $source.y = $target.scrollTop();
                }
            },
                        
            resetOnScroll = function (startX, startY) {

                this.resetOnScrollRequestActivated = false;

                clearTimeout(this.scrollTimeout);
                
                // mouse did not change position => user will probably continue scrolling
                if (startX === x && startY === y && !this.inside) {

                    this.resetOnScrollRequest = $.proxy(resetOnScroll, this, -1, -1);
                    
                    this.scrollTimeout = setTimeout(this.resetOnScrollRequest, UXN.EVENT_TIMERS.SCROLL_NEXT);
                    
                    return;
                }

                this.resetOnScrollRequest = null;
                
                clearTimeout(resizeTimeout);
                
                if (this.$currentSubnav.length || this.isNavInsideViewport()) {

                    resetCurrentFirstAndLastOpenedLevel.call(this);
                }

                this.scrollTimeout = null;

                this.horizontalScrollDirection = null;
                this.verticalScrollDirection = null;
                
                if (this.lastScrollInstance === this) {

                    horizontalScrollDirection = null;
                    verticalScrollDirection = null;
                }
            },
            
            getGlobalHorizontalScrollDirection = function () {

                var scrollX = $win.scrollLeft();

                switch (true) {

                    case lastScrollX > scrollX: return DIR.LEFT;

                    case lastScrollX < scrollX: return DIR.RIGHT;

                    default: return null;
                }
            },

            getGlobalVerticalScrollDirection = function () {

                var scrollY = $win.scrollTop();

                switch (true) {

                    case lastScrollY > scrollY: return DIR.UP;

                    case lastScrollY < scrollY: return DIR.DOWN;

                    default: return null;
                }
            },
            
            getHorizontalScrollDirection = function ($target, $source) {

                var scrollX = $target.scrollLeft();

                switch (true) {

                    case $source.x > scrollX: return DIR.LEFT;

                    case $source.x < scrollX: return DIR.RIGHT;

                    default: return null;
                }
            },

            getVerticalScrollDirection = function ($target, $source) {

                var scrollY = $target.scrollTop();

                switch (true) {

                    case $source.y > scrollY: return DIR.UP;

                    case $source.y < scrollY: return DIR.DOWN;

                    default: return null;
                }
            },
            
            globalTouchstartHandler = function () {

                clearTimeout(this.touchendRepeater);
                
                doNotCloseOnClick = true;

                byTouch = true;
            },

            globalTouchmoveHandler = function () {

                movedByTouch = true;
            },

            globalTouchendHandler = function (e) {

                if (movedByTouch) {
                    
                    movedByTouch = false;

                    return false;
                }

                var i = 0, 
                    
                    $target = $(e.target);

                for (i; i < INSTANCES_COUNT; i++) {

                    if (INSTANCES[i].initializing || INSTANCES[i].touchSleeping) {
                        
                        continue;
                    }
                    
                    if (touchendHandler.call(INSTANCES[i], $target) && !UXN.MULTIPLE_INSTANCES) {

                        break;
                    }
                }

                if (possibleInstance) {

                    touchendHandler.call(possibleInstance, $target);

                    possibleInstance = null;
                }
            },
      
            globalMousemoveHandler = function (e) {

                if (UXN.SKIP_MOUSE_EVENTS) {
                    
                    if (skipMouseEventsCounter < UXN.SKIP_MOUSE_EVENTS) {
                        
                        skipMouseEventsCounter++;

                        return;
                    }
                    
                    skipMouseEventsCounter = 0;
                }
                
                if (byTouch) {

                    return;
                }

                y = e.clientY;

                x = e.clientX;

                calcMouseMoveDiff();

                mouseDirection = getMouseDirection();

                var i = 0;
                
                if (typeof UXN.Debugger === "object" && UXN.Debugger !== null) {
                    
                    for (i; i < INSTANCES_COUNT; i++) {

                        if (INSTANCES[i].opt.debug) {

                            UXN.Debugger.clearDebug(INSTANCES[i]);
                        }
                    }
                }

                if (mousemoveAfterScrollHandler()) {

                    saveMouseData();

                    return;
                }

                var $target = $(e.target);

                if (!UXN.MULTIPLE_INSTANCES && ACTIVE_INSTANCE && !ACTIVE_INSTANCE.sleeping && !ACTIVE_INSTANCE.initializing) {

                    mousemoveHandler.call(ACTIVE_INSTANCE, $target);

                } else {
                    
                    for (i = 0; i < INSTANCES_COUNT; i++) {

                        if (INSTANCES[i].sleeping || INSTANCES[i].initializing) {

                            continue;
                        }
                        
                        if (mousemoveHandler.call(INSTANCES[i], $target) && !UXN.MULTIPLE_INSTANCES) {
                            
                            break;
                        }
                    }
                }

                saveMouseData();
            },

            saveMouseData = function () {

                lastMouseDirection = mouseDirection;

                lastX = x;

                lastY = y;
            },

            mousemoveHandler = function ($target) {

                clearTimeout(this.mousemoveRepeater);
                
                if (!this.on && (UXN.U.hasParent(this.$nav[0], $target[0]) || this.$nav[0] === $target[0])) {

                    turnOn.call(this);
                }

                // user will probably not continue scrolling => reset positions
                if (!this.resetOnScrollRequestActivated && this.resetOnScrollRequest) {

                    this.resetOnScrollRequestActivated = true;
                    
                    setTimeout(this.resetOnScrollRequest, 0);
                    
                    return;
                }
                
                if (!this.on) {

                    clearTimeout(this.inZoneTimeout);

                    return false;
                }
                
                if (isSettingPositionsInProgress.call(this, $target)) {

                    clearTimeout(this.inZoneTimeout);

                    this.mousemoveRepeater = setTimeout($.proxy(function() {
                        
                        mousemoveHandler.call(this, $target);
                        
                    }, this), UXN.EVENT_TIMERS.REPEATER);
                    
                    return false;
                }

                var eData = getEventData.call(this, $target);

                calcMouseEnterTimeout.call(this);

                mouseMove.call(this, this.$currentTarget, eData.$subnav, this);

                if (!this.inside || (!eData.$opener.length && !eData.$subnav.length && !eData.$item.length)) {

                    if (this.$lastOpener.length) {

                        mouseLeave.call(this);
                    }

                    this.$lastOpener = $NULL;

                    this.$lastItem = $NULL;

                    if (!this.hasFirstLevelOpenedSubnav()) {

                        this.$lastOpened = $NULL;
                        
                        this.$waiting = $NULL;
                    }
                    
                    if (this.opt.doNotCloseFirstLevel && !this.inZoneTimeout && this.getOpenedItemsInSubnav(this.$firstLevel).length === 1) {
                        
                        this.$waiting = $NULL;
                    }
                    
                    if (!this.$waiting.length && !this.inside) {

                        turnOff.call(this);

                        setCurrentSubnav.call(this, $NULL);
                    }

                    return this.on;
                }

                if (this.$lastOpener[0] === eData.$opener[0] && this.$lastItem[0] === eData.$item[0]) {

                    if (this.mouseEnterThrottle) {

                        throttleMouseEnter.call(this);
                    }

                    return true;
                }

                if ((this.$lastOpener[0] !== eData.$opener[0] || this.$lastItem[0] !== eData.$item[0]) && !this.opt.delayHide) {

                    mouseLeave.call(this, eData.$opener, eData.$subnav);
                }

                throttleMouseEnter.call(this);

                this.$lastOpener = eData.$opener.length ? eData.$opener : this.itemOpensSubnav ? eData.$item : $NULL;
                
                this.$lastItem = eData.$item;

                return true;
            },

            isSettingPositionsInProgress = function ($target) {

                return (this.$resetStartSubnav.length && this.getClosestSubnav($target)[0] === this.$resetStartSubnav[0]) ||
                    (this.settingPositionsOnFirstLevelInProgress && this.getClosestSubnav($target)[0] === this.$firstLevel[0]) ||
                    (this.settingPositionsOnCurrentLevelInProgress && this.getClosestSubnav($target)[0] === this.$resetStartSubnav[0] ||    
                    (this.settingPositionsOnLastOpenedLevelInProgress && this.getClosestSubnav($target)[0] === this.$lastOpenedSubnav[0]));
            },

            mousemoveAfterScrollHandler = function () {

                if (byScroll) {

                    if ((byScroll++) === 3) {

                        byScroll = null;

                    } else {

                        return true;
                    }
                }

                return false;
            },

            getMouseDirection = function () {

                switch (true) {

                    case x - lastX > 0 && y - lastY > 0: // ↘↘↘

                        return DIR.DOWN_RIGHT;

                    case x - lastX < 0 && y - lastY > 0: // ↙↙↙

                        return DIR.DOWN_LEFT;

                    case x - lastX > 0 && y - lastY < 0: // ↗↗↗

                        return DIR.UP_RIGHT;

                    case x - lastX < 0 && y - lastY < 0: // ↖↖↖

                        return DIR.UP_LEFT;

                    case !diffX && y - lastY < 0: // ↖↖↖↗↗↗

                        if (lastMouseDirection === DIR.UP_LEFT || lastMouseDirection === DIR.UP_RIGHT) {

                            return lastMouseDirection;
                        }

                        return DIR.UP_RIGHT;

                    case !diffX && y - lastY > 0: // ↙↙↙↘↘↘

                        if (lastMouseDirection === DIR.DOWN_LEFT || lastMouseDirection === DIR.DOWN_RIGHT) {

                            return lastMouseDirection;
                        }

                        return DIR.DOWN_RIGHT;

                    case !diffY && x - lastX > 0: // ↗↗↗↘↘↘

                        if (lastMouseDirection === DIR.UP_RIGHT || lastMouseDirection === DIR.DOWN_RIGHT) {

                            return lastMouseDirection;
                        }

                        return DIR.DOWN_RIGHT;

                    case !diffY && x - lastX < 0: // ↙↙↙↖↖↖

                        if (lastMouseDirection === DIR.UP_LEFT || lastMouseDirection === DIR.DOWN_LEFT) {

                            return lastMouseDirection;
                        }

                        return DIR.DOWN_LEFT;

                    default:

                        return lastMouseDirection;
                }
            },

            calcMouseMoveDiff = function () {

                diffY = Math.abs(y - lastY);

                diffX = Math.abs(x - lastX);
            },

            mouseMove = function ($target, $subnav, _this) {

                if (!this.$lastOpened.length) {

                    return;
                }

                if (this.inside) {

                    this.inTriangleZoneCounter = null;

                } else {

                    this.$currentSubnavInZone = $NULL;
                }

                if (isMouseInZone.call(this)) {

                    clearTimeout(this.inZoneTimeout);

                    this.$currentSubnavInZone = this.inside ? this.$lastOpenedSubnav : $NULL;

                    this.inTriangleZoneCounter = 0;

                    this.$waiting = this.$lastOpenedSubnav;

                    this.blockHiding = true;

                    if (!this.opt.autoHide && !this.inside) {

                        this.inZoneTimeout = null;

                        return;
                    }

                    this.inZoneTimeout = setTimeout(function () {

                        switchNavIfMouseIsOutOfZone.call(_this, $target, $subnav);

                    }, getInTriangleZoneTimeout.call(this));

                    return;

                } else {

                    if (!this.inside && !this.inTriangleZoneCounter) {

                        this.inTriangleZoneCounter = 0;
                    }

                    if (this.inSurroundingZoneCounter !== null && !this.inside) {

                        this.inSurroundingZoneCounter++;
                    }

                    if (this.inTriangleZoneCounter !== null && !this.inSurroundingZoneCounter) {

                        this.inTriangleZoneCounter++;
                    }

                    if (!this.inside && this.inTriangleZoneCounter > UXN.MAX_EVENTS.OUT_OF_TRIANGLE) {

                        clearTimeout(this.inZoneTimeout);

                        mouseLeave.call(this);
                    }

                    if (((this.inside && this.$currentSubnav[0] !== this.$currentSubnavInZone[0]) || 
                         this.inSurroundingZoneCounter > UXN.MAX_EVENTS.OUT_OF_SURROUNDING)) {

                        clearTimeout(this.inZoneTimeout);

                        switchNavIfMouseIsOutOfZone.call(this, $target, $subnav);
                    }
                }

                this.blockHiding = false;
            },

            getInTriangleZoneTimeout = function () {

                var timeout = !this.inside ? this.opt.outsideTimeout : this.opt.insideTimeout;

                return this.inSurroundingZoneCounter !== null ? this.opt.surroundingTimeout : timeout;
            },

            switchNavIfMouseIsOutOfZone = function ($target, $subnav) {

                this.blockHiding = false;

                if (!this.opt.delayHide) {

                    hideMenu.call(this, $target, $subnav);
                }

                this.$waiting = $NULL;

                throttleMouseEnter.call(this);

                this.inZoneTimeout = null;

                this.inSurroundingZoneCounter = null;
            },

            mouseLeave = function ($currentElement, $subnav) {

                if (this.blockHiding) {

                    return false;
                }

                clearTimeout(this.inZoneTimeout);

                this.inZoneTimeout = null;

                this.$waiting = $NULL;

                hideMenu.call(this, $currentElement, $subnav);
            },

            hideMenu = function ($currentElement, $subnav, publicCall) {

                if (!this.inside || !$currentElement || !$currentElement.length) {

                    hideAllSubnavs.call(this, publicCall);

                    setLastOpenedAfterHide.call(this, true);
                    
                    return;
                }

                if (!$subnav.length) {

                    return;
                }

                if (hideFollowingSubnavs.call(this, $subnav, $currentElement, false, publicCall)) {

                    setLastOpenedAfterHide.call(this);
                }
            },

            setLastOpenedAfterHide = function (byHideAllSubnavs) {
                            
                if (!this.hasFirstLevelOpenedSubnav()) {

                    this.$waiting = $NULL;

                    this.$lastOpened = $NULL;

                    this.$lastOpenedSubnav = $NULL;

                    turnOff.call(this);

                    return;
                }
                
                if (byHideAllSubnavs) {

                    turnOff.call(this);

                    return;
                }

                if (this.$currentOpener.length && this.hasOpenerOpenedSubnav(this.$currentOpener)) {

                    this.$lastOpened = this.$currentOpener;

                    this.$lastOpenedSubnav = this.getSubnav(this.$currentOpener);

                    return;
                }

                this.$lastOpened = this.$currentSubnav.length ? this.getClosestOpener(this.$currentSubnav) : $NULL;

                this.$lastOpenedSubnav = this.$currentSubnav;
            },
            
            hideAllSubnavs = function (publicCall) {

                var $opened = this.opt.closeOnlyInLevel ? 
                        this.getOpenedOpenersInSubnav(this.$firstLevel) : this.getOpenedOpeners(),

                    o = 0, oLength = $opened.length,
                    
                    $opener;

                for (o; o < oLength; o++) {

                    $opener = $($opened[o]);
                    
                    if (this.opt.keepOpened && isMouseOutOfOpenerInCurrentSubnav.call(this) && 
                        this.getClosestSubnav($opener)[0] === this.$currentSubnav[0]) {

                        if (!byTouch && 
                            (this.itemOpensSubnav || !this.$currentItem.length || !UXN.U.hasParent(this.$currentSubnav[0], this.$currentItem[0]))) {

                            continue;
                        }
                    }

                    if (this.opt.setPositions && isResetRequest.call(this, $opener)) {

                        setResetRequest.call(this, null, true);
                    }

                    if (!publicCall && this.opt.doNotCloseFirstLevel) {
                        
                        if (this.isInFirstLevel($opener)) {
                            
                            continue;
                        }
                    }
                    
                    closeSubnav.call(this, $opener);
                }
            },

            hideFollowingSubnavs = function ($fromSubnav, $currentElement, byOpen, publicCall) {
                
                var result = false,
                    
                    $opened = this.opt.closeOnlyInLevel ? 
                        this.getOpenedOpenersInSubnav($fromSubnav) : this.getOpenedOpeners($fromSubnav),

                    o = 0, oLength = $opened.length,
                    
                    $opener;
                
                for (o; o < oLength; o++) {
                    
                    if (this.$waiting[0] && $opened[o] === $currentElement[0]) {

                        continue;
                    }


                    $opener = $($opened[o]);

                    if (this.opt.closeOnlyInLevel && !this.hasOpenerOpenedSubnav($opener)) {

                        continue;
                    }

                    if (this.opt.keepOpened && isMouseOutOfOpenerInCurrentSubnav.call(this) && 
                        this.getClosestSubnav($opener)[0] === $fromSubnav[0]) {

                        if (this.itemOpensSubnav || !this.$currentItem.length || !UXN.U.hasParent($fromSubnav[0], this.$currentItem[0])) {

                            continue;
                        }
                    }

                    if (this.opt.doNotCloseFirstLevel && !publicCall && !byOpen) {
                        
                        if (this.isInFirstLevel($opener) && this.getOpenedItemsInSubnav(this.$firstLevel).length === 1) {
                            
                            continue;
                        }
                    }
                    
                    if ($opened[o] !== $currentElement[0]) {
                        
                        if (this.opt.setPositions && isResetRequest.call(this, $opener)) {

                            setResetRequest.call(this, null, true);
                        }
                        
                        if (closeSubnav.call(this, $opener)) {
                            
                            result = true;
                        }
                    }
                }
                
                return result;
            },

            isMouseOutOfOpenerInCurrentSubnav = function () {
                
                return (this.inside && this.$currentSubnav.length && 
                        (!this.$currentOpener.length || !UXN.U.hasParent(this.$currentSubnav[0], this.$currentOpener[0])));
            },
            
            mouseEnter = function ($target, $item, callback, byTouch) {

                if (this.inside && $target.length) {
                    
                    if (byTouch && this.isAnySubnavFading() && this.isInFadingSubnav($target)) {

                        stopFadingOut.call(this);

                        this.preventClickDefault = true;
                    }
                    
                    showMenu.call(this, $target, $item, false, null, callback);
                }
            },

            throttleMouseEnter = function () {

                clearTimeout(this.mouseEnterThrottle);

                if (this.isAnySubnavFading() && this.isInFadingSubnav(this.$currentTarget)) {

                    stopFadingOut.call(this);

                    this.preventClickDefault = true;
                    
                    this.mouseEnterTimeout = 0;
                }
                
                if (!this.mouseEnterTimeout) {
                    
                    mouseEnterThrottle.call(this);
                    
                    this.mouseEnterThrottle = null;
                    
                    return;
                }
                
                this.mouseEnterThrottle = setTimeout($.proxy(mouseEnterThrottle, this), this.mouseEnterTimeout);
            },

            mouseEnterThrottle = function () {
                
                if (this.opt.delayHide) {

                    var callback = $.proxy(mouseLeave, this, this.$currentTarget, this.$currentSubnav);
                    
                    mouseEnter.call(this, this.$currentTarget, this.$currentItem, callback);
                    
                    if (!this.inside) {
                        
                        callback();
                    }
                    
                    this.mouseEnterThrottle = null;

                    return;
                }

                mouseEnter.call(this, this.$currentTarget, this.$currentItem);

                this.mouseEnterThrottle = null;
            },
            
            calcMouseEnterTimeout = function () {

                if (!this.inside || !this.$currentSubnav.length) {

                    return;
                }

                var hasVerticalClass = UXN.U.hasClass(this.$currentSubnav, this.opt.slidingVertical),
                    
                    verticalSliding = hasVerticalClass || this.isSubnavHorizontal(this.$currentSubnav),
                    
                    horizontalSliding = UXN.U.hasClass(this.$currentSubnav, this.opt.slidingHorizontal),
                    
                    ignore = (verticalSliding && horizontalSliding && hasVerticalClass) || this.opt.ignoreLayoutOnSliding;

                if (horizontalSliding) {
                    
                    verticalSliding = hasVerticalClass; 
                }
                
                if (this.opt.allowSliding) {

                    if (ignore) {

                        if (!this.opt.allowSlidingOnFirstLevel && isCurrentSubnavFirstLevel.call(this)) {

                            this.mouseEnterTimeout = this.opt.openTimeout;
                            
                        } else {

                            this.mouseEnterTimeout = 0;
                        }
                        
                        return;
                    }

                    if (!this.opt.allowSlidingOnFirstLevel) {

                        if (isCurrentSubnavFirstLevel.call(this)) {

                            this.mouseEnterTimeout = this.opt.openTimeout;

                            return;
                        }

                        if (verticalSliding) {

                            this.mouseEnterTimeout =
                                (diffX > -1 && diffY < 2) || (diffX > 2 && diffY < 20) ? this.opt.openTimeout : 0;

                        } else {

                            this.mouseEnterTimeout =
                                (diffY > -1 && diffX < 2) || (diffY > 2 && diffX < 20) ? this.opt.openTimeout : 0;
                        }

                        if (isInSlidingZone.call(this, verticalSliding)) {

                            this.mouseEnterTimeout = this.opt.openTimeout;
                        }

                        return;
                    }

                    if (isCurrentSubnavFirstLevel.call(this)) {

                        if (verticalSliding) {

                            this.mouseEnterTimeout =
                                (diffX > -1 && diffY < 2) ||
                                (diffX > 0 && diffY < 7) ||
                                (diffX > 2 && diffY < 20) ? this.opt.openTimeout : 0;

                        } else {

                            this.mouseEnterTimeout =
                                (diffY > -1 && diffX < 2) ||
                                (diffY > 0 && diffX < 7) ||
                                (diffY > 2 && diffX < 20) ? this.opt.openTimeout : 0;
                        }

                        if (isInSlidingZone.call(this, verticalSliding)) {

                            this.mouseEnterTimeout = this.opt.openTimeout;
                        }

                        return;
                    }

                    if (verticalSliding) {

                        this.mouseEnterTimeout =
                            (diffX > -1 && diffY < 2) || (diffX > 2 && diffY < 20) ? this.opt.openTimeout : 0;

                    } else {

                        this.mouseEnterTimeout =
                            (diffY > -1 && diffX < 2) || (diffY > 2 && diffX < 20) ? this.opt.openTimeout : 0;
                    }

                    if (isInSlidingZone.call(this, verticalSliding)) {

                        this.mouseEnterTimeout = this.opt.openTimeout;
                    } 

                    return;
                }

                this.mouseEnterTimeout = this.opt.openTimeout;
            },

            showMenu = function ($opener, $item, isResetCallback, subnav$, callback, publicCall) {

                if (isResetCallback || couldBeOpened.call(this, $opener, $item)) {

                    if ((this.inside && (!this.$waiting.length || UXN.U.hasParent(this.$waiting[0], $opener[0]))) || publicCall) {

                        if (this.opt.setPositions && !isResetCallback) {

                            resetPositionsOnOpen.call(this, $opener, $item, callback);
                            
                            return;
                        }

                        if (callback) {
                            
                            callback();
                        }
                        
                        if (isResetCallback && $opener[0] !== this.$currentOpener[0]) {
                            
                            return;
                        }

                        //hide already opened subnavs in the same level
                        if ((this.opt.closeOnlyInLevel && 
                             (subnav$ || this.$currentSubnav).length && 
                             this.hasSubnavOpenedSubnav(subnav$ || this.$currentSubnav)) || 
                            
                            (this.opt.doNotCloseFirstLevel && 
                             isCurrentSubnavFirstLevel.call(this) && 
                             this.getOpenedItemsInSubnav(this.$firstLevel).length === 1)) {

                            hideFollowingSubnavs.call(this, subnav$ || this.$currentSubnav, $opener, true);
                        }

                        if (openSubnav.call(this, $opener, $item, subnav$ || this.$currentSubnav) !== false) {

                            setLastOpenedAfterShow.call(this, $opener);
                        }
                    }
                }
            },
            
            setLastOpenedAfterShow = function ($opener) {
                            
                this.$lastOpened = $opener;

                this.$lastOpenedSubnav = this.getSubnav($opener);
                
                if (this.opt.closeOnlyInLevel && this.hasSubnavOpenedSubnav(this.$lastOpenedSubnav)) {

                    this.$lastOpened = this.getOpenedOpenersInSubnav(this.$lastOpenedSubnav).first();

                    this.$lastOpenedSubnav = this.getSubnav(this.$lastOpened);
                }
            },
            
            couldBeOpened = function ($opener, $item) {

                if (!this.itemOpensSubnav && !UXN.U.hasParent($item[0], $opener[0])) {

                    return false;
                }
                
                return this.$lastOpened[0] !== $opener[0] && this.hasOpenerSubnav($opener);
            },

            openSubnav = function ($opener, $item, $parentSubnav) {
                
                if (isMarkedAsReset.call(this, $opener)) {
                    
                    return false;
                }
                
                $parentSubnav = $parentSubnav && $parentSubnav.length ? $parentSubnav : this.getClosestSubnav($opener);
                
                if (this.hasOpenerSubnav($opener) && !this.hasOpenerOpenedSubnav($opener)) {

                    var $subnav = this.getSubnav($opener);
                    
                    $item = $item && $item.length ? $item : this.getClosestItem($opener);

                    if (typeof this.opt.onOpen === "function" && this.opt.onOpen.call(this, $subnav, $opener, $item) === false) {
                        
                        return false;
                    }

                    if (this.itemOpensSubnav) {

                        UXN.U.addClass($opener, this.opt.itemOpened, this.opt.itemHighlighted);
                        
                        if (UXN.U.findFirstByClass($parentSubnav, this.opt.itemOpened).length) {

                            UXN.U.addClass($parentSubnav, this.opt.subnavHasOpened);
                        }
                        
                    } else {
                        
                        UXN.U.addClass($opener, this.opt.openerOpened, this.opt.openerHighlighted);
                        UXN.U.addClass($item, this.opt.itemOpened, this.opt.itemHighlighted);

                        if (UXN.U.findFirstByClass($parentSubnav, this.opt.openerOpened).length) {

                            UXN.U.addClass($parentSubnav, this.opt.subnavHasOpened);
                        }
                    }

                    if (this.opt.fading !== UXN.FADING_TYPE.NONE && !UXN.U.hasClass($subnav, this.opt.noFading)) {

                        clearFadingOut.call(this, $opener, $item, $subnav, $parentSubnav);
                    }
                    
                    return true;
                }
                
                return false;
            },
            
            closeSubnav = function ($opener, $item, $parentSubnav, skipParentSubnav) {

                if (isMarkedAsReset.call(this, $opener)) {

                    return false;
                }
                
                $parentSubnav = $parentSubnav && $parentSubnav.length ? $parentSubnav : this.getClosestSubnav($opener);

                if (this.hasOpenerSubnav($opener) && this.hasOpenerOpenedSubnav($opener)) {

                    var $subnav = this.getSubnav($opener);

                    $item = $item && $item.length ? $item : this.getClosestItem($opener);
                    
                    var callback = $.proxy(checkFadingOut, this, $opener, $item, $subnav, $parentSubnav, null);
                    
                    if (typeof this.opt.onClose === "function" && this.opt.onClose.call(this, $subnav, $opener, $item, callback) === false) {

                        return false;
                    }

                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemOpened, this.opt.itemHighlighted);

                    } else {

                        UXN.U.removeClass($opener, this.opt.openerOpened, this.opt.openerHighlighted);
                        UXN.U.removeClass($item, this.opt.itemOpened, this.opt.itemHighlighted);
                    }

                    if (!skipParentSubnav && !this.isSiblingOpenerOpened($opener, $parentSubnav)) {

                        UXN.U.removeClass($parentSubnav, this.opt.subnavHasOpened);
                    }

                    if (this.opt.fading !== UXN.FADING_TYPE.NONE && !UXN.U.hasClass($subnav, this.opt.noFading)) {

                        this.fadingOuts.push($subnav);

                        if (this.opt.fading !== UXN.FADING_TYPE.JS) {
                                       
                            $subnav.on(getFadingEvent.call(this), $.proxy(
                                checkFadingOut, this, $opener, $item, $subnav, $parentSubnav, callback)
                            );
                        }

                        if (this.itemOpensSubnav) {

                            UXN.U.addClass($opener, this.opt.itemHasFadingOut);

                        } else {

                            UXN.U.addClass($opener, this.opt.openerHasFadingOut);
                            UXN.U.addClass($item, this.opt.itemHasFadingOut);
                        }

                        if (!skipParentSubnav) {

                            UXN.U.addClass($parentSubnav, this.opt.subnavHasFadingOut);
                        }
                        
                    } else {
                        
                        if ($subnav.data(DATA.RESET_SKIPPED)) {

                            resetPositionsOnClose.call(this, $opener, $subnav, $parentSubnav);
                        }
                    }
                    
                    return true;
                }
                
                return false;
            },
            
            clearFadingOut = function ($opener, $item, $subnav, $parentSubnav) {
                
                if (this.itemOpensSubnav) {

                    UXN.U.removeClass($opener, this.opt.itemHasFadingOut);

                } else {

                    UXN.U.removeClass($opener, this.opt.openerHasFadingOut);
                    UXN.U.removeClass($item, this.opt.itemHasFadingOut);
                }

                if (!this.isSiblingOpenerFadingOut($opener, $parentSubnav)) {

                    UXN.U.removeClass($parentSubnav, this.opt.subnavHasFadingOut);
                }

                if (this.opt.fading !== UXN.FADING_TYPE.JS) {

                    $subnav.off(getFadingEvent.call(this));
                }

                removeFromFadingOuts.call(this, $subnav);
                
                if ($subnav.data(DATA.RESET_SKIPPED)) {

                    resetPositionsOnClose.call(this, $opener, $subnav, $parentSubnav);
                }
            },
            
            checkFadingOut = function ($opener, $item, $subnav, $parentSubnav, callback, event) {
                
                if (event && event.originalEvent.target !== $subnav[0]) {

                    return;
                }

                if (isFadedOut.call(this, $opener, $subnav, event ? event.originalEvent: null, callback)) {
                    
                    clearFadingOut.call(this, $opener, $item, $subnav, $parentSubnav);
                }
                
                if (!this.fadingOuts.length && (!this.inside || !this.isClosingByClick)) {

                    turnOff.call(this);
                }

                if (!this.fadingOuts.length) {

                    this.isClosingByClick = false;
                }
            },
            
            isFadedOut = function ($opener, $subnav, event, callback) {
                
                var isFadedOut = this.hasOpenerFadingSubnav($opener);

                if (isFadedOut && this.opt.fading === UXN.FADING_TYPE.TRANSITION && event) {

                    return this.opt.isFadedOut.call(this, $subnav, event, callback);

                } else if (isFadedOut && this.opt.fading === UXN.FADING_TYPE.ANIMATION) {

                    return this.opt.animation === event.animationName || 
                        $.inArray(event.animationName, $.isArray(this.opt.animation) ? this.opt.animation : []) !== -1;
                }
                
                return isFadedOut;
            },
            
            getFadingEvent = function () {
                
                switch (this.opt.fading) {
                        
                    case UXN.FADING_TYPE.ANIMATION:
                        
                        return UXN.SUPPORT.ANIMATIONEND + "." + UXN.EVENT_NS;
                        
                    case UXN.FADING_TYPE.TRANSITION: 
                        
                        return UXN.SUPPORT.TRANSITIONEND + "." + UXN.EVENT_NS;
                        
                    default: 
                        
                        return "UnknownEventType";
                }
            },
            
            removeFromFadingOuts = function ($subnav) {

                var i = this.fadingOuts.length - 1;

                for (i; i >= 0; i--) {

                    if (this.fadingOuts[i][0] === $subnav[0]) {

                        this.fadingOuts.splice(i, 1);
                        
                        break;
                    }
                }
            },

            stopFadingOut = function () {

                if (this.isClosingByClick || !this.opt.stopFadingOnHover || !this.$currentSubnav.length) {

                    return;
                }
                
                var $currentSubnav = this.opt.closeOnlyInLevel ? UXN.U.closest(this.$currentTarget, 
                        this.opt.item + "." + this.opt.itemHasSubnav + ":not(." + this.opt.itemOpened + ")"
                    ) : this.$currentSubnav;

                if (this.opt.closeOnlyInLevel) {
                    
                    $currentSubnav = $currentSubnav.length ? this.getSubnav($currentSubnav) : this.$currentSubnav;
                }
                
                if (!$currentSubnav.length) {
                    
                    return;
                }
                
                this.$lastOpenedSubnav = this.$currentSubnav;

                this.$lastOpened = this.getClosestOpener(this.$lastOpenedSubnav);

                while ($currentSubnav.length) {

                    var $opener = this.getClosestOpener($currentSubnav);
                    
                    if ($opener.length && (!this.hasOpenerOpenedSubnav($opener) || this.opt.closeOnlyInLevel)) {

                        var $subnav = this.getClosestSubnav($opener),

                            $siblings = this.getItemsInSubnav($subnav),
                            
                            $siblingsLength = $siblings.length, i = 0;

                        for (i; i < $siblingsLength; i++) {

                            var $sibling = $($siblings[i]),
                                
                                $siblingOpener = this.itemOpensSubnav ? $sibling : this.getOpener($sibling);

                            if ($siblingOpener.length && $siblingOpener[0] !== $opener[0]) {

                                closeSubnav.call(this, $siblingOpener, $sibling, $subnav);
                                
                                if (this.opt.closeOnlyInLevel) {
                                    
                                    continue;
                                }
                                
                                var $opened = this.getOpenedOpeners($siblingOpener),

                                    o = 0, $openedLength = $opened.length;

                                for (o; o < $openedLength; o++) {

                                    closeSubnav.call(this, $($opened[o]));
                                }
                            }
                        }

                        openSubnav.call(this, $opener);
                        
                        $currentSubnav = this.getClosestSubnav($opener);

                        continue;
                    }

                    $currentSubnav = $NULL;
                }
            },
                
            isInSurroundingZone = function (rect) {

                if (!this.inside) {

                    var left = rect.left     - this.opt.surroundingZone,
                        right = rect.right   + this.opt.surroundingZone,
                        top = rect.top       - this.opt.surroundingZone,
                        bottom = rect.bottom + this.opt.surroundingZone;

                    if (isPointInRectangle.call(this, x, y, top, left, bottom, right)) {

                        if (this.opt.debug) {

                            UXN.Debugger.debugRectangle(this, top, left, bottom, right);
                        }

                        return true;
                    }
                }

                return false;
            },

            addSubnavToMouseInZoneCheck = function (subnavs, $subnav) {
                
                subnavs.push({
                    subnav: $subnav[0],
                    rect: UXN.U.getRect($subnav),
                    skip: shouldIgnoreTracking.call(this, $subnav)
                });
            },
            
            getSubnavsForMouseInZoneCheck = function () {
                
                var $_subnavs = this.getOpenedSubnavs(null, this.opt.closeOnlyInLevel),

                    subnavs = [],

                    lastOpenedInSubnav = false,

                    i = $_subnavs.length - 1;

                for (i; i >= 0; i--) {

                    if ($_subnavs[i] === this.$lastOpenedSubnav[0]) {

                        lastOpenedInSubnav = true;
                    }

                    $temp[0] = $_subnavs[i];
                    
                    addSubnavToMouseInZoneCheck.call(this, subnavs, $temp);
                }

                if (!lastOpenedInSubnav) {

                    addSubnavToMouseInZoneCheck.call(this, subnavs, this.$lastOpenedSubnav);
                }

                return subnavs;
            },
            
            isMouseInZone = function () {

                var subnavs = getSubnavsForMouseInZoneCheck.call(this),
                    
                    result = _isMouseInZone.call(this, subnavs);

                // not in triangle and ambiguous mouse direction => test alternative direction
                if (!diffX && !result) {

                    switch (mouseDirection) {

                        case DIR.UP_LEFT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.UP_RIGHT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }

                            break;
                        }
                            
                        case DIR.DOWN_LEFT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.UP_RIGHT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                            
                            break;
                        }
                            
                        case DIR.UP_RIGHT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.UP_LEFT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }

                            break;
                        }
                            
                        default: {

                            if (_isMouseInZone.call(this, subnavs, DIR.DOWN_LEFT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                        }
                    }
                }

                if (!diffY && !result) {

                    switch (mouseDirection) {

                        case DIR.UP_LEFT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.DOWN_LEFT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                            
                            break;
                        }
                            
                        case DIR.DOWN_LEFT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.UP_LEFT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                            
                            break;
                        }
                            
                        case DIR.UP_RIGHT: {

                            if (_isMouseInZone.call(this, subnavs, DIR.DOWN_RIGHT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                            
                            break;
                        }
                            
                        default: {

                            if (_isMouseInZone.call(this, subnavs, DIR.UP_RIGHT, UXN.DEBUG && UXN.DEBUG.COLORS.ALT_TRIANGLE)) {

                                if (!this.opt.debug) {

                                    return true;
                                }

                                result = true;
                            }
                        }
                    }
                }

                return result;
            },

            shouldIgnoreTracking = function ($subnav) {

                return hasForbiddenTracking.call(this, $subnav) ||
                    (this.opt.hideFollowing && this.inside && !UXN.U.hasParent(this.$currentSubnav[0], $subnav[0]));
            },

            hasForbiddenTracking = function ($subnav) {

                return (this.opt.excludeFirstLevel && $subnav[0] === this.$firstLevel[0]) || 
                    UXN.U.hasClass($subnav, this.opt.exclude) ||
                    (this.hasExcludeInsideClasses && UXN.U.hasClass($subnav, this.opt.excludeInside) &&
                     (this.$currentSubnav[0] === $subnav[0] || UXN.U.hasParent($subnav[0], this.$currentSubnav[0])));
            },

            _isMouseInZone = function (subnavs, direction, debugColor) {

                var result = false,

                    triangle, inTriangle, t,
                    
                    i = 0, length = subnavs.length;

                for (i; i < length; i++) {

                    if (!direction && subnavs[i].subnav !== this.$firstLevel[0] && isInSurroundingZone.call(this, subnavs[i].rect)) {

                        this.inSurroundingZoneCounter = 0;

                        if (!this.opt.debug) {

                            return true;
                        }

                        result = true;
                    }

                    if (subnavs[i].skip) {
                        
                        continue;
                    }
                    
                    triangle = getTriangleZone.call(this, subnavs[i].subnav, subnavs[i].rect, direction);

                    t = triangle;

                    if (this.opt.debug && triangle) {

                        UXN.Debugger.debugTriangle(this, t[0], t[1], t[2], t[3], t[4], t[5], debugColor);
                    }

                    inTriangle = triangle && isPointInTriangle(x, y, t[0], t[1], t[2], t[3], t[4], t[5]);

                    // if mouse is not in triangle, try use mouseTolerance setting
                    if (triangle && !inTriangle && this.opt.mouseTolerance > 0) {

                        switch (mouseDirection) {

                            case DIR.UP_LEFT: {

                                inTriangle =
                                    isPointInTriangle(x - this.opt.mouseTolerance, y - this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x, y - this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x - this.opt.mouseTolerance, y, t[0], t[1], t[2], t[3], t[4], t[5]);

                                break;
                            }
                                
                            case DIR.DOWN_LEFT: {

                                inTriangle =
                                    isPointInTriangle(x - this.opt.mouseTolerance, y + this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x, y + this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x - this.opt.mouseTolerance, y, t[0], t[1], t[2], t[3], t[4], t[5]);

                                break;
                            }
                                
                            case DIR.UP_RIGHT: {

                                inTriangle =
                                    isPointInTriangle(x + this.opt.mouseTolerance, y - this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x, y - this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x + this.opt.mouseTolerance, y, t[0], t[1], t[2], t[3], t[4], t[5]);

                                break;
                            }
                                
                            default: {

                                inTriangle =
                                    isPointInTriangle(x + this.opt.mouseTolerance, y + this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x, y + this.opt.mouseTolerance, t[0], t[1], t[2], t[3], t[4], t[5]) ||
                                    isPointInTriangle(x + this.opt.mouseTolerance, y, t[0], t[1], t[2], t[3], t[4], t[5]);
                            }
                        }
                    }

                    if (inTriangle) {

                        this.inSurroundingZoneCounter = null;

                        if (!this.opt.debug) {

                            return true;
                        }

                        result = true;
                    }
                }

                return result;
            },

            getTriangleZone = function (subnav, subnavRect, direction) {

                if (!this.$lastOpened.length) {

                    return null;
                }

                var triangle = getTriangle.call(this, subnavRect, direction);

                switch (direction || mouseDirection) {

                    case DIR.DOWN_RIGHT: { // ↘↘↘

                        if (triangle[4] > x && triangle[3] > y && (!this.opt.hideFollowing || (this.$currentSubnav[0] !== subnav || !this.inside))) {

                            return triangle;
                        }

                        break;
                    }
                        
                    case DIR.DOWN_LEFT: { // ↙↙↙

                        if (triangle[4] < x && triangle[3] > y && (!this.opt.hideFollowing || (this.$currentSubnav[0] !== subnav || !this.inside))) {

                            return triangle;
                        }

                        break;
                    }
                        
                    case DIR.UP_RIGHT: { // ↗↗↗

                        if (triangle[4] > x && triangle[3] < y && (!this.opt.hideFollowing || (this.$currentSubnav[0] !== subnav || !this.inside))) {

                            return triangle;
                        }

                        break;
                    }
                        
                    default: { // ↖↖↖

                        if (triangle[2] < x && triangle[5] < y && (!this.opt.hideFollowing || (this.$currentSubnav[0] !== subnav || !this.inside))) {

                            return triangle;
                        }
                    }
                }
            },

            getTriangle = function (rect, direction) {

                var dist = getZoneExt.call(this, rect),

                    data, coords;

                switch (direction || mouseDirection) {

                    case DIR.DOWN_RIGHT: { // ↘↘↘

                        data = getTriangleData(rect.left, rect.bottom, rect.right, rect.bottom, rect.right, rect.top);

                        coords = calcZoneExtCoords(data.b + dist, data.A);

                        return [
                            lastX,
                            lastY,
                            rect.right - coords.x,
                            rect.top + coords.y,
                            rect.left + coords.x,
                            rect.bottom - coords.y
                        ];
                    }
                        
                    case DIR.DOWN_LEFT: { // ↙↙↙

                        data = getTriangleData(rect.right, rect.bottom, rect.left, rect.bottom, rect.left, rect.top);

                        coords = calcZoneExtCoords(data.b + dist, data.A);

                        return [
                            lastX,
                            lastY,
                            rect.left + coords.x,
                            rect.top + coords.y,
                            rect.right - coords.x,
                            rect.bottom - coords.y
                        ];
                    }
                        
                    case DIR.UP_RIGHT: { // ↗↗↗

                        data = getTriangleData(rect.left, rect.top, rect.left, rect.bottom, rect.right, rect.bottom);

                        coords = calcZoneExtCoords(data.b + dist, data.C);

                        return [
                            lastX,
                            lastY,
                            rect.right - coords.x,
                            rect.bottom - coords.y,
                            rect.left + coords.x,
                            rect.top + coords.y
                        ];
                    }
                        
                    default: { // ↖↖↖

                        data = getTriangleData(rect.left, rect.bottom, rect.right, rect.bottom, rect.right, rect.top);

                        coords = calcZoneExtCoords(data.b + dist, data.A);

                        return [
                            lastX,
                            lastY,
                            rect.right - coords.x,
                            rect.top + coords.y,
                            rect.left + coords.x,
                            rect.bottom - coords.y
                        ];
                    }
                }
            },

            getZoneExt = function (rect) {

                var subnavX = rect.left + (rect.width / 2),
                    subnavY = rect.top + (rect.height / 2),

                    extX = subnavX - x,
                    extY = subnavY - y,

                    dist = 0;

                extX = extX * extX;
                extY = extY * extY;

                dist = Math.sqrt(extX + extY);

                return Math.max(this.opt.minZoneExt, Math.min(this.opt.maxZoneExt, Math.pow(dist, 2) / 2000)) + this.opt.zoneExtOffset;
            },

            calcZoneExtCoords = function (length, angle) {
            
                var y = (length * Math.sin(angle / 180 * Math.PI)) / Math.sin(90 / 180 * Math.PI),

                    x = (y * Math.sin((90 - angle) / 180 * Math.PI)) / Math.sin(angle / 180 * Math.PI);

                return { x: x, y: y };
            },

            isPointInTriangle = function (px, py, ax, ay, bx, by, cx, cy) {

                var v00 = cx - ax,
                    v10 = bx - ax,
                    v20 = px - ax,
                    v01 = cy - ay,
                    v11 = by - ay,
                    v21 = py - ay,

                    dot00 = (v00 * v00) + (v01 * v01),
                    dot01 = (v00 * v10) + (v01 * v11),
                    dot02 = (v00 * v20) + (v01 * v21),
                    dot11 = (v10 * v10) + (v11 * v11),
                    dot12 = (v10 * v20) + (v11 * v21),

                    invDenom = 1 / (dot00 * dot11 - dot01 * dot01),

                    u = (dot11 * dot02 - dot01 * dot12) * invDenom,
                    v = (dot00 * dot12 - dot01 * dot02) * invDenom;

                return ((u >= 0) && (v >= 0) && (u + v < 1));
            },

            getTriangleData = function (x1, y1, x2, y2, x3, y3) {

                var a = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3)),
                    b = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)),
                    c = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)),

                    A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI,
                    B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180 / Math.PI,
                    C = Math.acos((a * a + b * b - c * c) / (2 * b * a)) * 180 / Math.PI;

                return { A: A, B: B, C: C, a: a, b: b, c: c };
            },

            isInSlidingZone = function (isHorizontal) {

                if (!this.inside || !this.$lastOpenedSubnav.length || (!isHorizontal && diffX < 1) || (isHorizontal && diffY < 1)) {

                    return false;
                }

                var rect = UXN.U.getRect(this.$lastOpenedSubnav),

                    ignoreSlidingZone = ((isHorizontal ? rect.height : rect.width) / 100) * (100 - this.opt.slidingZone),

                    slidingRect = getSlidingRect.call(this, rect, ignoreSlidingZone, isHorizontal),

                    s = slidingRect,
                    
                    isInZone = isPointInRectangle(x, y, s[0], s[1], s[2], s[3]);

                if (this.opt.debug && isInZone) {
                    
                    UXN.Debugger.debugRectangle(this, s[0], s[1], s[2], s[3], UXN.DEBUG.COLORS.SLIDING_ZONE);
                }
                
                return isInZone;
            },

            getSlidingRect = function (rect, ignoreSlidingZone, isHorizontal) {

                switch (true) {

                    case x < lastX && !isHorizontal: { // ←←←

                        return [
                            rect.top,
                            rect.right - ignoreSlidingZone,
                            rect.bottom,
                            rect.right
                        ];
                    }
                        
                    case x >= lastX && !isHorizontal: { // →→→

                        return [
                            rect.top,
                            rect.left,
                            rect.bottom,
                            rect.left + ignoreSlidingZone,
                        ];
                    }
                        
                    case y < lastY && isHorizontal: { // ↑↑↑

                        return [
                            rect.bottom - ignoreSlidingZone,
                            rect.left,
                            rect.bottom,
                            rect.right,
                        ];
                    }
                        
                    default: { // ↓↓↓

                        return [
                            rect.top,
                            rect.left,
                            rect.top + ignoreSlidingZone,
                            rect.right,
                        ];
                    }
                }
            },

            isPointInRectangle = function (x, y, top, left, bottom, right) {

                return x >= left && x <= right && y >= top && y <= bottom;
            },
            
            addToResetRequestQueue = function (request) {
              
                for (var i = this.resetRequestQueue.length - 1; i >= 0; i--) {

                    if (this.resetRequestQueue[i].byOpen || request.$opener[0] === this.resetRequestQueue[i][0].$opener[0]) {

                        this.resetRequestQueue.splice(i, 1);
                    }
                }

                this.resetRequestQueue.push(arguments);
            },
            
            resetPositions = function (request, loop, onlyFirstLevel) {

                var $subnavs, level;

                if (!loop) {
                    
                    if (this.resetRequest && !this.resetRequest.byOpen) {
                        
                        addToResetRequestQueue.call(this, request);
                        
                        return;
                    }

                    if (typeof this.opt.onResetPositionsStart === "function") {
                        
                        this.opt.onResetPositionsStart.call(this);
                    }

                    getFirstLevelPositionBaseData.call(this);
                    getPositionBaseData.call(this);

                    level = onlyFirstLevel || this.isInFirstLevel(request.$opener) ? 1 : 0;
                    
                    setResetRequest.call(this, request, true);

                    $subnavs = onlyFirstLevel ? $() : this.getSubnav(request.$opener);
                    
                    var $parentSubnav = this.getClosestSubnav(request.$opener);
                    
                    this.$resetStartSubnav = onlyFirstLevel ? this.$firstLevel : $parentSubnav;
                    
                    request.$resetStartSubnav = onlyFirstLevel ? this.$firstLevel : $parentSubnav;
                    
                    request.nextLevel = UXN.U.toArrayWith$Objects(
                        this.getOpenersWithSubnavInSubnav(onlyFirstLevel ? this.$firstLevel : $subnavs)
                    );

                    request.positionData = [];
                    
                    request.clear = $.proxy(function (stop) {

                        clearTimeout(request.nextBatchTimeout);
                        clearTimeout(request.resetNextTimeout);
                        
                        clearReset.call(this, request.positionData, stop ? null : request, request.$resetStartSubnav);
                        
                    }, this);
                } 

                if (loop || onlyFirstLevel) {
                    
                    $subnavs = $();
                    
                    var i = 0, length = request.nextLevel.length;

                    for (i; i < length; i++) {
                        
                        var $subnav = this.getSubnav(request.nextLevel[i]);
                        
                        if (!this.ignoreChangeOnReset && !request.skipped && !hasPositionChangedSinceLastReset.call(this, $subnav)) {
                            
                            continue;
                        }
                        
                        if (!onlyFirstLevel) {

                            addLastResetDataToSubnav.call(this, $subnav);
                        }

                        $subnavs.push($subnav[0]);
                    }

                    this.ignoreChangeOnReset = false;
                    
                    request.nextLevel = [];
                    
                    if (!$subnavs || !$subnavs.length) {

                        setResetRequest.call(this, null);

                        return;
                    }
                    
                    level = onlyFirstLevel || this.isInFirstLevel($subnavs.first()) ? 1 : 0;
                }

                var openers = [], subnavs = [], items = [];

                prepareSubnavsForPositionReset.call(
                    this, $subnavs, this.$resetStartSubnav, level, openers, subnavs, items
                );

                setPositions.call(this, {
                    openers: openers,
                    subnavs: subnavs,
                    items: items
                }, level, request);
            },

            addLastResetDataToSubnav = function ($subnav) {

                $subnav.data(DATA.LAST_RESET, {
                    scrollX:      lastScrollX,
                    scrollY:      lastScrollY,
                    baseScrollX:  this.positionBaseLastScroll.x,
                    baseScrollY:  this.positionBaseLastScroll.y,
                    base2ScrollX: this.firstLevelPositionBaseLastScroll.x,
                    base2ScrollY: this.firstLevelPositionBaseLastScroll.y,
                    baseWidth:    this.positionBase.right,
                    baseHeight:   this.positionBase.bottom,
                    base2Width:   this.firstLevelPositionBase.right,
                    base2Height:  this.firstLevelPositionBase.bottom,
                    winWidth:     lastWinWidth,
                    winHeight:    lastWinHeight
                });
            },

            hasPositionChangedSinceLastReset = function ($subnav) {

                var data = $subnav.data(DATA.LAST_RESET);

                return !(data && !$subnav.data(DATA.RESET_SKIPPED) &&
                         data.scrollX      === lastScrollX && 
                         data.scrollY      === lastScrollY &&
                         data.winWidth     === lastWinWidth && 
                         data.winHeight    === lastWinHeight &&
                         data.baseScrollX  === this.positionBaseLastScroll.x && 
                         data.baseScrollY  === this.positionBaseLastScroll.y &&
                         data.base2ScrollX === this.firstLevelPositionBaseLastScroll.x && 
                         data.base2ScrollY === this.firstLevelPositionBaseLastScroll.y &&
                         data.baseWidth    === this.positionBase.right && 
                         data.baseHeight   === this.positionBase.bottom &&
                         data.base2Width   === this.firstLevelPositionBase.right &&  
                         data.base2Height  === this.firstLevelPositionBase.bottom);
            },

            resetPositionsOnEvent = function () {

                var request = {};

                request.always = $.proxy(function () {

                    this.settingPositionsOnFirstLevelInProgress = false;

                }, this);

                request.$opener = this.$nav;

                this.settingPositionsOnFirstLevelInProgress = true;

                resetPositions.call(this, request, false, true);
            },

            resetPositionsOnOpen = function ($opener, $item, callback) {

                var request = $.proxy(showMenu, this, $opener, $item, true, this.$currentSubnav, callback);

                request.$opener = $opener;

                request.byOpen = true;

                resetPositions.call(this, request);
            },

            resetPositionsOnClose = function ($opener, $subnav, $parentSubnav) {

                var $parentOpener = this.getClosestOpener($parentSubnav);

                // if parent is closed, position can not be set
                if (!$parentOpener.length || !this.hasOpenerOpenedSubnav($parentOpener)) {

                    $subnav.data(DATA.RESET_SKIPPED, true);

                    return;
                }

                var callback = {};

                callback.$opener = $opener;

                callback.skipped = true;

                if (!isResetRequest.call(this, callback)) {

                    resetPositions.call(this, callback);
                }
            },

            resetPositionsOnCurrentSubnavChange = function (nextRequest) {

                if (!this.$currentSubnav.length || (nextRequest && isCurrentSubnavFirstLevel.call(this))) {

                    if (nextRequest) {

                        nextRequest.call(this);
                    }

                    return;
                }

                var request = $.proxy(function () {
                    
                        if (nextRequest) {

                            nextRequest.call(this);
                        }
                    
                    }, this),   

                    $opener = this.getClosestOpener(this.$currentSubnav);

                request.always = $.proxy(function () {

                    this.settingPositionsOnCurrentLevelInProgress = false;

                }, this);

                request.$opener = $opener.length ? $opener : this.$nav;

                if (isResetRequest.call(this, request)) {

                    if (nextRequest) {
                        
                        nextRequest.call(this);
                    }

                    return;
                }

                this.settingPositionsOnCurrentLevelInProgress = true;
                
                resetPositions.call(this, request);
            },

            resetCurrentFirstAndLastOpenedLevel = function () {

                var request = $.proxy(function () {
                    
                    if (this.$lastOpened.length && this.$lastOpenedSubnav[0] !== this.$currentSubnav[0]) {

                        var nextRequest = $.proxy(resetPositionsOnEvent, this);
                        
                        nextRequest.always = $.proxy(function () {

                            this.settingPositionsOnLastOpenedLevelInProgress = false;

                        }, this);

                        nextRequest.$opener = this.$lastOpened;
                        
                        this.settingPositionsOnLastOpenedLevelInProgress = true;
                        
                        if (resetPositions.call(this, nextRequest, false) === false) {
                    
                            nextRequest.call(this);
                        }
                    } else {

                        resetPositionsOnEvent.call(this);
                    }
                    
                }, this);
                
                resetPositionsOnCurrentSubnavChange.call(this, request);
            },
            
            setResetRequest = function (request, stopCallback) {
                
                if (this.resetRequest) {

                    if (stopCallback && this.resetRequest.always) {

                        this.resetRequest.always.call(this);
                    }

                    if (this.resetRequest.clear) {

                        this.resetRequest.clear(stopCallback);
                    }
                }

                this.resetRequest = request;
            },
            
            isResetRequest = function (requestOr$opener) {
                
                if (requestOr$opener.$opener) {
                    
                    return this.resetRequest && this.resetRequest.$opener[0] === requestOr$opener.$opener[0];
                }
                
                return this.resetRequest && this.resetRequest.$opener[0] === requestOr$opener[0];
            },
            
            prepareSubnavsForPositionReset = function ($subnavs, $from, level, openers, subnavs, items) {
                
                var doNotAddClasses = level === 1 && this.opt.firstLevelPositionsFromCenter,
                    
                    i = 0, length = $subnavs.length;

                for (i; i < length; i++) {

                    var $subnav = $($subnavs[i]);

                    if (this.initializing) {

                        openers.push(this.getClosestOpener($subnav));

                        subnavs.push($subnav);

                        removeAppropriatePositionsFromSubnav.call(this, $subnav, null, doNotAddClasses);

                        continue;
                    }

                    var $opener = this.getClosestOpener($subnav);

                    if (!$opener.length || this.hasOpenerOpenedSubnav($opener) || this.hasOpenerFadingSubnav($opener)) {

                        $subnav.data(DATA.RESET_SKIPPED, true);
                        
                        continue;
                    }

                    var subnavIsRelativeToParent = $subnav.data(DATA.RELATIVE_TO_PARENT);
                                    
                    subnavIsRelativeToParent =  subnavIsRelativeToParent !== undefined ? 
                        subnavIsRelativeToParent : isSubnavPositionRelativeToParentSubnav.call(this, $subnav, $opener);
                
                    var $closestSubnav = this.getClosestSubnav($opener);

                    if (subnavIsRelativeToParent && 
                        (this.hasSubnavOpenedSubnav($closestSubnav) || this.hasSubnavFadingSubnav($closestSubnav))) {
                        
                        $subnav.data(DATA.RESET_SKIPPED, true);
                        
                        continue;
                    }

                    $subnav.data(DATA.RESET_SKIPPED, false);

                    openers.push($opener);

                    subnavs.push($subnav);

                    removeAppropriatePositionsFromSubnav.call(this, $subnav, $closestSubnav, doNotAddClasses);
                }

                i = 0; length = openers.length;

                var $_opener, $item;

                for (i; i < length; i++) {

                    $_opener = openers[i];

                    $item = this.itemOpensSubnav ? $NULL : this.getClosestItem($_opener);

                    items.push($item);

                    removeAppropriatePositionsFromOpener.call(this, $_opener, $item, doNotAddClasses);
                }

                if (level === 1) {

                    setPositionsFromCenter.call(this, subnavs, items, openers);
                }
            },
            
            removeAppropriatePositionsFromSubnav = function ($subnav, $parentSubnav, doNotAddClasses) {

                UXN.U.removeClass($subnav, this.opt.subnavTop, this.opt.subnavBottom, this.opt.subnavRight, this.opt.subnavLeft);
                
                if (doNotAddClasses) {
                    
                    return;
                }
                
                var $parent = $parentSubnav || this.getClosestSubnav($subnav.parent()),
                    
                    addClassCall = [];
                
                if (UXN.U.hasClass($parent, this.opt.subnavTop)) {

                    addClassCall.push(this.opt.subnavTop);

                } else if (UXN.U.hasClass($parent, this.opt.subnavBottom)) {

                    addClassCall.push(this.opt.subnavBottom);
                }

                if (UXN.U.hasClass($parent, this.opt.subnavLeft)) {

                    addClassCall.push(this.opt.subnavLeft);

                } else if (UXN.U.hasClass($parent, this.opt.subnavRight)) {

                    addClassCall.push(this.opt.subnavRight);
                }
                
                if (addClassCall.length) {

                    addClassCall.unshift($subnav);

                    UXN.U.addClass.apply(null, addClassCall);
                }
            },

            removeAppropriatePositionsFromOpener = function ($opener, $item, doNotAddClasses) {

                if (this.itemOpensSubnav) {

                    UXN.U.removeClass($opener, this.opt.itemHasTop, this.opt.itemHasBottom, this.opt.itemHasRight, this.opt.itemHasLeft);

                } else {

                    UXN.U.removeClass($opener, this.opt.openerHasTop, this.opt.openerHasBottom, this.opt.openerHasRight, this.opt.openerHasLeft);
                    UXN.U.removeClass($item, this.opt.itemHasTop, this.opt.itemHasBottom, this.opt.itemHasRight, this.opt.itemHasLeft);
                }

                if (doNotAddClasses) {
                    
                    return;
                }
                
                var $parent = this.getClosestSubnav($opener.parent()),
                    
                    addClassCallOpener = [$opener],
                    
                    addClassCallItem = [$item];
                
                if (UXN.U.hasClass($parent, this.opt.subnavTop)) {

                    addClassCallOpener.push(this.opt.openerHasTop);
                    addClassCallItem.push(this.opt.itemHasTop);

                } else if (UXN.U.hasClass($parent, this.opt.subnavBottom)) {

                    addClassCallOpener.push(this.opt.openerHasBottom);
                    addClassCallItem.push(this.opt.itemHasBottom);
                }

                if (UXN.U.hasClass($parent, this.opt.subnavLeft)) {

                    addClassCallOpener.push(this.opt.openerHasLeft);
                    addClassCallItem.push(this.opt.itemHasLeft);

                } else if (UXN.U.hasClass($parent, this.opt.subnavRight)) {

                    addClassCallOpener.push(this.opt.openerHasRight);
                    addClassCallItem.push(this.opt.itemHasRight);
                }
                
                if (addClassCallOpener.length > 1) {
                    
                    if (this.itemOpensSubnav) {

                        addClassCallItem[0] = $opener;
                        
                        UXN.U.addClass.apply(null, addClassCallItem);
                        
                    } else {

                        UXN.U.addClass.apply(null, addClassCallOpener);
                        UXN.U.addClass.apply(null, addClassCallItem);
                    }
                }
            },
          
            setPositionsFromCenter = function (subnavs, items, openers) {

                if (this.opt.positionSkipOnFirstLevel) {

                    return;
                }

                if (this.opt.firstLevelPositionsFromCenter) {

                    var verBaseCenter = this.firstLevelPositionBase.top + (
                            (this.firstLevelPositionBase.bottom - this.firstLevelPositionBase.top) / 2
                        ),

                        horBaseCenter = this.firstLevelPositionBase.left + (
                            (this.firstLevelPositionBase.right - this.firstLevelPositionBase.left) / 2
                        ),
                        
                        i = 0, length = subnavs.length;

                    for (i; i < length; i++) {

                        var rect = UXN.U.getRect(openers[i]),
                            
                            verOpenerCenter = rect.top + (rect.height / 2),
                            
                            horOpenerCenter = rect.left + (rect.width / 2);

                        if (verBaseCenter > verOpenerCenter) {
                            
                            UXN.U.addClass(subnavs[i], this.opt.subnavBottom);

                            if (this.itemOpensSubnav) {

                                UXN.U.addClass(openers[i], this.opt.itemHasBottom);
                                
                            } else {
                                
                                UXN.U.addClass(openers[i], this.opt.openerHasBottom);
                                UXN.U.addClass(items[i], this.opt.itemHasBottom);
                            }
                            
                        } else {

                            UXN.U.addClass(subnavs[i], this.opt.subnavTop);
                            
                            if (this.itemOpensSubnav) {

                                UXN.U.addClass(openers[i], this.opt.itemHasTop);

                            } else {

                                UXN.U.addClass(openers[i], this.opt.openerHasTop);
                                UXN.U.addClass(items[i], this.opt.itemHasTop);
                            }
                        }
                        
                        if (horBaseCenter > horOpenerCenter) {
                            
                            UXN.U.addClass(subnavs[i], this.opt.subnavRight);
                            
                            if (this.itemOpensSubnav) {

                                UXN.U.addClass(openers[i], this.opt.itemHasRight);

                            } else {

                                UXN.U.addClass(openers[i], this.opt.openerHasRight);
                                UXN.U.addClass(items[i], this.opt.itemHasRight);
                            }
                        } else {

                            UXN.U.addClass(subnavs[i], this.opt.subnavLeft);
                            
                            if (this.itemOpensSubnav) {

                                UXN.U.addClass(openers[i], this.opt.itemHasLeft);

                            } else {

                                UXN.U.addClass(openers[i], this.opt.openerHasLeft);
                                UXN.U.addClass(items[i], this.opt.itemHasLeft);
                            }
                        }
                    }
                }
            },
  
            setPositions = function (data, level, request, start) {
                
                data.skip = data.skip || [];
                
                data.results = data.results || [];
                
                data.parentSubnavs = data.parentSubnavs || [];
                
                if (start === undefined) {

                    request.positionData.push(data);
                }
                
                start = start || 0;
                
                var i = start, length = data.openers.length;
                                
                for (i; i < length; i++) {

                    if (i > (UXN.POSITIONS.MAX_BATCH - 1 + start) && length > (UXN.POSITIONS.MAX_BATCH + start)) {

                        request.nextBatchTimeout = setTimeout($.proxy(setPositions, this, data, level, request, i), 0);

                        return;
                    }
                    
                    var $parentSubnav = $NULL;

                    if (!data.items[i].length) {

                        data.items[i] = data.openers[i];
                    }
                    
                    if (data.subnavs[i].data(DATA.RELATIVE_TO_PARENT)) {

                        $parentSubnav = this.getClosestSubnav(data.items[i]);

                        if ($parentSubnav.length && !isMarkedAsReset.call(this, $parentSubnav)) {

                            markAsReset.call(this, $parentSubnav);
                        }
                    }

                    data.parentSubnavs.push($parentSubnav);
                    
                    if (this.itemOpensSubnav) {
                        
                        UXN.U.addClass(data.openers[i], this.opt.itemOpened);

                    } else {
                        
                        UXN.U.addClass(data.openers[i], this.opt.openerOpened);
                        UXN.U.addClass(data.items[i], this.opt.itemOpened);
                    }

                    markAsReset.call(this, data.items[i]);

                    if (data.items[i][0] !== data.openers[i][0]) {

                        markAsReset.call(this, data.openers[i]);
                    }

                    if (data.subnavs[i].data(DATA.SKIP_POSITIONING) === undefined) {

                        shouldSkipPositioning.call(this, data.subnavs[i], data.items[i]);
                    }
                    
                    if (data.subnavs[i].data(DATA.SKIP_POSITIONING)) {

                        data.skip.push(i);

                        data.results.push({});
                        
                        continue;
                    }

                    var result = setPosition.call(this, data.openers[i], data.items[i], data.subnavs[i], level);
                    
                    if (result.skip) {

                        data.skip.push(i);
                    }
                    
                    data.results.push(result);
                }

                if (data.skip.length === data.openers.length) {
                    
                    resetNext.call(this, request);
                    
                    return;
                }

                setPosition2.call(this, data, level, request);
            },
            
            setPosition = function ($opener, $item, $subnav, level) {

                var rect = UXN.U.getRect($subnav),
                
                    base = level === 1 ? this.firstLevelPositionBase : this.positionBase,
                    
                    verChangedDir = null,
                
                    horChangedDir = null;

                if (isWholeSubnavInsidePositionBase.call(this, rect, base) || 
                    skipAlreadyPositioned.call(this, $opener, $item, $subnav, rect, level)) {

                    return {
                        skip: true
                    };
                }

                if (rect.bottom > base.bottom) {

                    UXN.U.removeClass($subnav, this.opt.subnavBottom);
                    UXN.U.addClass($subnav, this.opt.subnavTop);

                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemHasBottom);
                        UXN.U.addClass($opener, this.opt.itemHasTop);
                        
                    } else {

                        UXN.U.removeClass($opener, this.opt.openerHasBottom);
                        UXN.U.addClass($opener, this.opt.openerHasTop);
                        
                        UXN.U.removeClass($item, this.opt.itemHasBottom);
                        UXN.U.addClass($item, this.opt.itemHasTop);
                    }

                    verChangedDir = this.opt.subnavTop;
                }
                
                if (rect.right > base.right) {

                    UXN.U.removeClass($subnav, this.opt.subnavRight);
                    UXN.U.addClass($subnav, this.opt.subnavLeft);
                    
                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemHasRight);
                        UXN.U.addClass($opener, this.opt.itemHasLeft);

                    } else {

                        UXN.U.removeClass($opener, this.opt.openerHasRight);
                        UXN.U.addClass($opener, this.opt.openerHasLeft);

                        UXN.U.removeClass($item, this.opt.itemHasRight);
                        UXN.U.addClass($item, this.opt.itemHasLeft);
                    }

                    horChangedDir = this.opt.subnavLeft;
                }
                
                return {
                    verChangedDir: verChangedDir,
                    horChangedDir: horChangedDir
                };
            },

            skipAlreadyPositioned = function ($opener, $item, $subnav, rect, level) {
                
                var isTop = UXN.U.hasClass($subnav, this.opt.subnavTop),
                    
                    isLeft = UXN.U.hasClass($subnav, this.opt.subnavLeft),
                
                    base = level === 1 ? this.firstLevelPositionBase : this.positionBase;

                if (isLeft && rect.left <= base.left && isTop && rect.top <= base.top) {

                    UXN.U.removeClass($subnav,  this.opt.subnavTop, this.opt.subnavLeft);
                    UXN.U.addClass($subnav, this.opt.subnavBottom, this.opt.subnavRight);

                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemHasTop, this.opt.itemHasLeft);
                        UXN.U.addClass($opener, this.opt.itemHasBottom, this.opt.itemHasRight);

                    } else {

                        UXN.U.removeClass($opener, this.opt.openerHasTop, this.opt.openerHasLeft);
                        UXN.U.addClass($opener, this.opt.openerHasBottom, this.opt.openerHasRight);

                        UXN.U.removeClass($item, this.opt.itemHasTop, this.opt.itemHasLeft);
                        UXN.U.addClass($item, this.opt.itemHasBottom, this.opt.itemHasRight);
                    }
                    
                    return true;
                }
                
                if (isLeft && rect.left <= base.left && !isTop && rect.bottom < base.bottom) {

                    UXN.U.removeClass($subnav, this.opt.subnavLeft);
                    UXN.U.addClass($subnav, this.opt.subnavRight);

                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemHasLeft);
                        UXN.U.addClass($opener, this.opt.itemHasRight);

                    } else {

                        UXN.U.removeClass($opener, this.opt.openerHasLeft);
                        UXN.U.addClass($opener, this.opt.openerHasRight);

                        UXN.U.removeClass($item, this.opt.itemHasLeft);
                        UXN.U.addClass($item, this.opt.itemHasRight);
                    }
                   
                    return true;
                }
                
                if (isTop && rect.top <= base.top && !isLeft && rect.right < base.right) {
                    
                    UXN.U.removeClass($subnav, this.opt.subnavTop);
                    UXN.U.addClass($subnav, this.opt.subnavBottom);
                    
                    if (this.itemOpensSubnav) {

                        UXN.U.removeClass($opener, this.opt.itemHasTop);
                        UXN.U.addClass($opener, this.opt.itemHasBottom);

                    } else {

                        UXN.U.removeClass($opener, this.opt.openerHasTop);
                        UXN.U.addClass($opener, this.opt.openerHasBottom);

                        UXN.U.removeClass($item, this.opt.itemHasTop);
                        UXN.U.addClass($item, this.opt.itemHasBottom);
                    }

                    return true;
                }
                
                return false;
            },
            
            setPosition2 = function (data, level, request, start) {
                
                start = start || 0;
                
                var base = level === 1 ? this.firstLevelPositionBase : this.positionBase,
                    
                    i = start, length = data.openers.length;

                for (i; i < length; i++) {
                                        
                    if ($.inArray(i, data.skip) !== -1) {
                        
                        continue;
                    }

                    var rect = UXN.U.getRect(data.subnavs[i]);

                    if (rect.top <= base.top) {

                        data.results[i].verChangedDir = this.opt.subnavBottom;
                    }

                    if (rect.left <= base.left) {

                        data.results[i].horChangedDir = this.opt.subnavRight;
                    }

                    if (data.results[i].horChangedDir || data.results[i].verChangedDir) {

                        var isLeft = data.results[i].horChangedDir === this.opt.subnavLeft,

                            isTop = data.results[i].verChangedDir === this.opt.subnavTop;

                        if (data.results[i].horChangedDir) {

                            UXN.U.removeClass(data.subnavs[i], isLeft ? this.opt.subnavRight : this.opt.subnavLeft);
                            UXN.U.addClass(data.subnavs[i], data.results[i].horChangedDir);

                            if (this.itemOpensSubnav) {

                                UXN.U.removeClass(data.openers[i], isLeft ? this.opt.itemHasRight : this.opt.itemHasLeft);
                                UXN.U.addClass(data.openers[i], isLeft ? this.opt.itemHasLeft : this.opt.itemHasRight);

                            } else {

                                UXN.U.removeClass(data.openers[i], isLeft ? this.opt.openerHasRight : this.opt.openerHasLeft);
                                UXN.U.addClass(data.openers[i], isLeft ? this.opt.openerHasLeft : this.opt.openerHasRight);

                                UXN.U.removeClass(data.items[i], isLeft ? this.opt.itemHasRight : this.opt.itemHasLeft);
                                UXN.U.addClass(data.items[i], isLeft ? this.opt.itemHasLeft : this.opt.itemHasRight);
                            }
                        }

                        if (data.results[i].verChangedDir) {

                            UXN.U.removeClass(data.subnavs[i], isTop ? this.opt.subnavBottom : this.opt.subnavTop);
                            UXN.U.addClass(data.subnavs[i], data.results[i].verChangedDir);
                            
                            if (this.itemOpensSubnav) {

                                UXN.U.removeClass(data.openers[i], isLeft ? this.opt.itemHasBottom : this.opt.itemHasTop);
                                UXN.U.addClass(data.openers[i], isTop ? this.opt.itemHasTop : this.opt.itemHasBottom);

                            } else {

                                UXN.U.removeClass(data.openers[i], isTop ? this.opt.openerHasBottom : this.opt.openerHasTop);
                                UXN.U.addClass(data.openers[i], isTop ? this.opt.openerHasTop : this.opt.openerHasBottom);

                                UXN.U.removeClass(data.items[i], isTop ? this.opt.itemHasBottom : this.opt.itemHasTop);
                                UXN.U.addClass(data.items[i], isTop ? this.opt.itemHasTop : this.opt.itemHasBottom);
                            }
                        }
                    }
                }

                resetNext.call(this, request);
            },
            
            resetNext = function (request) {
                    
                resetPositions.call(this, request, true);

                return;
            },

            clearReset = function (data, callback, $originalRestStart) {

                var i = 0, count = data.length;

                for (i; i < count; i++) {

                    var j = 0, length = data[i].results.length;
                    
                    for (j; j < length; j++) {
                        
                        if (!callback) {

                            data[i].subnavs[j].data(DATA.RESET_SKIPPED, true);
                        }
                        
                        if (this.itemOpensSubnav) {
                            
                            UXN.U.removeClass(data[i].openers[j], this.opt.itemOpened);
                            
                        } else {
                            
                            UXN.U.removeClass(data[i].openers[j], this.opt.openerOpened);
                            UXN.U.removeClass(data[i].items[j], this.opt.itemOpened);
                        }
                    }
                }

                (callback || this).clearResetTimeout = setTimeout($.proxy(function () {

                    clearResetMarks.call(this, data);
                    
                    if ($originalRestStart[0] === this.$resetStartSubnav[0]) {
                        
                        this.$resetStartSubnav = $NULL;
                    }
                    
                    if (callback && callback.always) {
                        
                        callback.always.call(this);
                    }
                    
                    if (typeof callback === "function") {
                        
                        callback.call(this);
                    }

                    if (typeof this.opt.onResetPositionsEnd === "function") {

                        this.opt.onResetPositionsEnd.call(this);
                    }
                    
                    if (this.resetRequestQueue.length) {

                        var args = this.resetRequestQueue.shift();

                        resetPositions.apply(this, args);
                    }

                }, this), callback && this.opt.fading !== UXN.FADING_TYPE.NONE ? UXN.POSITIONS.RELEASE_DELAY : 0);
            },

            markAsReset = function ($element) {

                UXN.U.addClass($element, UXN.POSITIONS.CLASSES.RESET);
            },

            unmarkAsReset = function ($element) {

                UXN.U.removeClass($element, UXN.POSITIONS.CLASSES.RESET);
            },

            isMarkedAsReset = function ($element) {

                return UXN.U.hasClass($element, UXN.POSITIONS.CLASSES.RESET);
            },
            
            clearResetMarks = function (data) {
                
                var i = 0, count = data.length;

                for (i; i < count; i++) {

                    var j = 0, length = data[i].results.length;

                    for (j; j < length; j++) {
                        
                        if (this.itemOpensSubnav && UXN.U.hasClass(data[i].openers[j], this.opt.itemOpened)) {

                            continue;

                        } else if (!this.itemOpensSubnav && UXN.U.hasClass(data[i].openers[j], this.opt.openerOpened)) {

                            continue;
                        }
                        
                        unmarkAsReset.call(this, data[i].items[j]);

                        if (data[i].openers[j][0] !== data[i].items[j][0]) {

                            unmarkAsReset.call(this, data[i].openers[j]);
                        }

                        if (data[i].parentSubnavs[j].length) {

                            unmarkAsReset.call(this, data[i].parentSubnavs[j]);
                        }
                    }
                }
            },

            shouldSkipPositioning = function ($subnav, $item) {

                var result = UXN.U.hasClass($subnav, this.opt.positionSkip) || 
                    (this.opt.positionSkipOnFirstLevel && !this.getClosestItem($item.parent()).length);
                
                $subnav.data(DATA.SKIP_POSITIONING, +result);
                
                return result;
            },

            getPositionBaseData = function (getObject) {

                var base = getBaseData.call(
                        this,
                        this.opt.positionBase !== UXN.POSITION_BASE.WINDOW && 
                        this.opt.positionBase !== UXN.POSITION_BASE.PAGE ? this.$positionBase : this.opt.positionBase
                    ),

                    obj = {};

                obj.right  = base.right  - this.opt.positionOffset;
                obj.left   = base.left   + this.opt.positionOffset;
                obj.bottom = base.bottom - this.opt.positionOffset;
                obj.top    = base.top    + this.opt.positionOffset;

                if (getObject) {

                    return obj;
                }

                this.positionBase = obj;
            },

            getFirstLevelPositionBaseData = function (getObject) {

                var base = getBaseData.call(
                        this,
                        this.opt.firstLevelPositionBase !== UXN.POSITION_BASE.WINDOW && 
                        this.opt.firstLevelPositionBase !== UXN.POSITION_BASE.PAGE ? this.$firstLevelPositionBase : this.opt.firstLevelPositionBase
                    ),
                    
                    obj = {};
                
                obj.right  = base.right  - this.opt.positionOffset;
                obj.left   = base.left   + this.opt.positionOffset;
                obj.bottom = base.bottom - this.opt.positionOffset;
                obj.top    = base.top    + this.opt.positionOffset;
                
                if (getObject) {
                 
                    return obj;
                }
                
                this.firstLevelPositionBase = obj;
            },

            getBaseData = function (base) {

                var right = 0,
                    bottom = 0,
                    top = 0,
                    left = 0,

                    wWidth = $win.width(),
                    wHeight = $win.height();

                if (base === UXN.POSITION_BASE.PAGE) {

                    var htmlRect = UXN.U.getRect($html);

                    // use window if html is smaller
                    right = htmlRect.right > wWidth ? htmlRect.right : wWidth;

                    bottom = htmlRect.bottom > wHeight ? htmlRect.bottom : wHeight;

                    top = htmlRect.top > 0 ? 0 : htmlRect.top;

                    left = htmlRect.left > 0 ? 0 : htmlRect.left;

                } else if (typeof base === "object" || typeof base === "string") {

                    var $base = UXN.U.jQueryfy(base),
                        
                        rect = UXN.U.getRect($base);
                    
                    right = rect.right;
                    bottom = rect.bottom;
                    top = rect.top;
                    left = rect.left;
                    
                } else {

                    right = wWidth;

                    bottom = wHeight;
                }

                return {
                    right: right,
                    bottom: bottom,
                    top: top,
                    left: left
                };
            },

            isWholeSubnavInsidePositionBase = function (rect, base) {

                return (rect.bottom < base.bottom && rect.top >= base.top && rect.left >= base.left && rect.right < base.right);
            },

            isSubnavPositionRelativeToParentSubnav = function ($subnav, $opener) {

                UXN.U.addClass($opener, this.itemOpensSubnav ? this.opt.itemOpened : this.opt.openerOpened);

                var $offsetParent = $subnav.offsetParent(),
                    
                    result = $offsetParent.length && !(this.isOpener($offsetParent) || this.isItem($offsetParent));
                
                UXN.U.removeClass($opener, this.itemOpensSubnav ? this.opt.itemOpened : this.opt.openerOpened);

                $subnav.data(DATA.RELATIVE_TO_PARENT, result);
                
                return result;
            },

            isCurrentSubnavFirstLevel = function () {
                
                return this.$currentSubnav[0] === this.$firstLevel[0];
            };

        UXN.prototype = (function () {

            var refresh = function (options /*Object?*/ /*<= UXN*/) {

                    this.destroy();

                    if (options) {

                        checkOptions.call(this, options);
                        
                        $.extend(this.opt, options);
                    }

                    init.call(this);
                
                    return this;
                },

                destroy = function () {

                    if (this.opt.debug) {

                        UXN.Debugger.clearDebug(this);
                    }
                    
                    turnOff.call(this);

                    removeEvents.call(this);

                    removeAllClasses.call(this);

                    removeStylesForPositioning.call(this);

                    if (typeof UXN.Debugger === "object" && UXN.Debugger !== null) {
                        
                        UXN.Debugger.removeStylesForDebugging(this);
                    }

                    this.positionBase = {};

                    this.resetRequestQueue = [];

                    this.$nav = null;

                    this.$firstLevel = null;

                    removeInstance.call(this);
                },

                open = function (subnav /*String *CSS selector* | HTMLElement | jQuery*/, notParents /*Boolean?*/ /*<= Boolean*/) {
                    
                    if (!this.on) {
                        
                        turnOn.call(this);
                    }

                    var $subnav = UXN.U.jQueryfy(subnav, this.$nav);
                                            
                    if ($subnav.length && this.isSubnav($subnav) && $subnav[0] !== this.$firstLevel[0]) {

                        this.inside = true;
                        
                        var $opener = this.getClosestOpener($subnav),

                            $parentSubnav = this.getClosestSubnav($opener);

                        this.$currentOpener = $opener;
                        
                        hideMenu.call(this, $opener, !notParents ? this.$firstLevel : $parentSubnav);

                        showMenu.call(this, $opener, this.getClosestItem($opener), false, $parentSubnav, null, true);
                        
                        for (;;) {
                            
                            $subnav = !notParents ? $parentSubnav : $NULL;

                            if (!$subnav.length || $parentSubnav[0] === this.$firstLevel[0]) {
                                
                                break;
                            }
                            
                            $opener = this.getClosestOpener($subnav);

                            $parentSubnav = this.getClosestSubnav($opener);
                            
                            if (this.opt.doNotCloseFirstLevel && $parentSubnav[0] === this.$firstLevel[0]) {

                                var $openedItem = this.getOpenedItemsInSubnav(this.$firstLevel).first();
                                
                                if ($openedItem.length) {

                                    closeSubnav.call(this, $openedItem, $NULL, this.$firstLevel);
                                }
                            }
                            
                            openSubnav.call(this, $opener, $NULL, $parentSubnav);
                        }
                        
                        return true;
                    }

                    return false;
                },
                
                close = function (subnav /*String? *CSS selector* | HTMLElement? | jQuery?*/, preserveFirstLevel /*Boolean?*/ /*<= Boolean*/) {
                    
                    if (typeof subnav !== "string" && (typeof subnav !== "object" || subnav === null)) {
                        
                        hideMenu.call(this, $NULL, $NULL, !preserveFirstLevel);
                        
                        turnOff.call(this);
                        
                        return true;
                    }
                    
                    var $subnav = UXN.U.jQueryfy(subnav, this.$nav);

                    if (!$subnav.length) {
                        
                        return false;
                    }
                    
                    var $opener = this.getClosestOpener($subnav),
                        
                        $parentSubnav = this.getClosestSubnav($opener);
                    
                    hideMenu.call(this, $opener.parent(), $parentSubnav, !preserveFirstLevel);
                    
                    if (!this.hasFirstLevelOpenedSubnav()) {
                        
                        turnOff.call(this);
                    }
                    
                    return true;
                },
                
                sleep = function (touchEvents /*Boolean?*/) {
                    
                    this.sleeping = true;
                    
                    this.touchSleeping = !!touchEvents;
                },
                
                wake = function () {
                    
                    this.sleeping = false;
                    
                    this.touchSleeping = false;
                },

                isNavInsideViewport = function (/*<= Boolean*/) {

                    var navRect = UXN.U.getRect(this.$nav);

                    return !(navRect.bottom <= 0 || navRect.top >= $win.height() || navRect.right <= 0 || navRect.left >= $win.width());
                },

                isSubnavHorizontal = function ($subnav /*jQuery*/ /*<= Boolean*/) {

                    return $subnav.length && UXN.U.hasClass($subnav, this.opt.horizontal);
                },

                hasOpenerFadingSubnav = function ($opener /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($opener, !this.itemOpensSubnav ? this.opt.openerHasFadingOut : this.opt.itemHasFadingOut);
                },

                hasItemFadingSubnav = function ($item /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($item, this.opt.itemHasFadingOut);
                },

                hasSubnavFadingSubnav = function ($subnav /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($subnav, this.opt.subnavHasFadingOut);
                },

                isAnySubnavOpened = function (/*<= Boolean*/) {

                    var $firstOpened = UXN.U.findFirstByClass(this.$nav, this.opt.itemOpened);

                    return $firstOpened && $firstOpened.length;
                },

                isSiblingOpenerOpened = function ($opener /*jQuery*/, $parentSubnav /*jQuery?*/ /*<= Boolean*/) {

                    $parentSubnav = $parentSubnav || this.getClosestSubnav($opener);

                    var $siblings = this.getOpenedOpenersInSubnav($parentSubnav);  

                    if ($siblings.length === 1 && $siblings[0] === $opener[0]) {
                      
                        return false;
                    }
                    
                    return !!$siblings.length;
                },

                isSiblingOpenerFadingOut = function ($opener /*jQuery*/, $parentSubnav /*jQuery?*/ /*<= Boolean*/) {

                    $parentSubnav = $parentSubnav || this.getClosestSubnav($opener);

                    var $siblings = this.getOpenersWithFadingSubnavInSubnav($parentSubnav);
                 
                    if ($siblings.length === 1 && $siblings[0] === $opener[0]) {

                        return false;
                    }

                    return !!$siblings.length;
                },

                isSiblingItemOpened = function ($item /*jQuery*/, $parentSubnav /*jQuery?*/ /*<= Boolean*/) {

                    $parentSubnav = $parentSubnav || this.getClosestSubnav($item);

                    var $siblings = this.getOpenedItemsInSubnav($parentSubnav);  

                    if ($siblings.length === 1 && $siblings[0] === $item[0]) {
                      
                        return false;
                    }
                    
                    return !!$siblings.length;
                },

                isSiblingItemFadingOut = function ($item /*jQuery*/, $parentSubnav /*jQuery?*/ /*<= Boolean*/) {

                    $parentSubnav = $parentSubnav || this.getClosestSubnav($item);

                    var $siblings = this.getItemsWithFadingSubnavInSubnav($parentSubnav);
                 
                    if ($siblings.length === 1 && $siblings[0] === $item[0]) {

                        return false;
                    }

                    return !!$siblings.length;
                },

                getItemsInSubnav = function ($subnav /*jQuery*/, filterSelector /*String?*/ /*<= jQuery*/) {

                    return this.getItem($subnav).parent().children(
                        filterSelector ? this.opt.item + $.trim(filterSelector) : this.opt.item
                    );
                },

                getOpenersInSubnav = function ($subnav /*jQuery*/, filterSelector /*String?*/ /*<= jQuery*/) {

                    var $items = this.getItemsInSubnav($subnav, this.itemOpensSubnav ? filterSelector : null);

                    if (this.itemOpensSubnav) {

                        return $items;
                    }

                    var openers = [], $opener,

                        i = 0, length = $items.length;

                    for (i; i < length; i++) {

                        $temp[0] = $items[i];
                        
                        $opener = this.getOpener($temp);

                        if ($opener.length && (!filterSelector || UXN.U.matches(
                            $opener, this.opt.opener + $.trim(filterSelector)))) {
                            
                            openers.push($opener[0]);
                        }
                    }

                    return $(openers);
                },

                getItemsWithSubnavInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {
                  
                    return this.getItemsInSubnav($subnav, "." + this.opt.itemHasSubnav);
                },
                
                getOpenersWithSubnavInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {
                  
                    return this.getOpenersInSubnav(
                        $subnav, !this.itemOpensSubnav ? "." + this.opt.openerHasSubnav : "." + this.opt.itemHasSubnav
                    );
                },

                getItemsWithFadingSubnavInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {
                  
                    return this.getItemsInSubnav($subnav, "." + this.opt.itemHasFadingOut);
                },
                
                getOpenersWithFadingSubnavInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {
                  
                    return this.getOpenersInSubnav(
                        $subnav, !this.itemOpensSubnav ? "." + this.opt.openerHasFadingOut : "." + this.opt.itemHasFadingOut
                    );
                },
                
                getOpenedItemsInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {

                    return this.getItemsInSubnav($subnav, "." + this.opt.itemOpened);
                },

                getOpenedOpenersInSubnav = function ($subnav /*jQuery*/ /*<= jQuery*/) {

                    var $items = this.getOpenedItemsInSubnav($subnav);

                    if (this.itemOpensSubnav) {

                        return $items;
                    }

                    var openers = [],

                        i = 0, length = $items.length;

                    for (i; i < length; i++) {

                        $temp[0] = $items[i];
                        
                        openers.push(this.getOpener($temp)[0]);
                    }

                    return $(openers);
                },

                isAnySubnavFading = function (/*<= Boolean*/) {

                    return !!this.fadingOuts.length;
                },
                
                isInFadingSubnav = function ($element /*jQuery*/ /*<= Boolean*/) {
                  
                    return !!UXN.U.closest(
                        $element, "." + (this.itemOpensSubnav ? this.opt.itemHasFadingOut : this.opt.openerHasFadingOut)
                    ).length;
                },
                
                isInFirstLevel = function ($target /*jQuery*/ /*<= Boolean*/) {
                  
                    var $subnav = this.getClosestSubnav(this.isSubnav($target) ? $target.parent() : $target);
                    
                    return $subnav[0] === this.$firstLevel[0];
                },
                
                shouldCloseNav = function ($element /*jQuery*/ /*<= Boolean*/) {

                    return !!UXN.U.closest($element, this.opt.nav + " " + this.opt.closer).length;
                },

                hasFirstLevelOpenedSubnav = function (/*<= Boolean*/) {

                    return UXN.U.hasClass(this.$firstLevel, this.opt.subnavHasOpened);
                },

                getClosestItem = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.closest($element, this.opt.nav + " " + this.opt.item);
                },

                getClosestOpener = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.closest($element, this.opt.nav + " " + (!this.itemOpensSubnav ? this.opt.opener : this.opt.item));
                },

                getClosestSubnav = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.closest($element, this.opt.nav + " " + this.opt.subnav);
                },

                getOpenedOpeners = function ($from /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.findAllByClass($from || this.$nav, !this.itemOpensSubnav ? this.opt.openerOpened : this.opt.itemOpened);
                },

                getOpenedItems = function ($from /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.findAllByClass($from || this.$nav, this.opt.itemOpened);
                },

                getOpenedSubnavs = function ($from /*jQuery*/, upToFirstClosed /*Boolean?*/ /*<= jQuery*/) {

                    // If is set "closeOnlyInLevel", there may be closed subnavs between opened ones. 
                    // Subnavs after the first closed should be ignored, because otherwise they would be used for mouse-in-zone check.
                    if (upToFirstClosed) {

                        var subnavs = [],

                            $openers = this.getOpenedOpeners($from),

                            closedSelector =  this.itemOpensSubnav ? this.opt.item + ":not(." + this.opt.itemOpened + ")":
                                this.opt.opener + ":not(." + this.opt.openerOpened + ")",
                            
                            i = 0, length = $openers.length;

                        for (i; i < length; i++) {

                            $temp[0] = $openers[i];

                            if (UXN.U.hasParent(this.$nav[0], $temp.closest(closedSelector)[0])) {

                                continue;
                            }

                            subnavs.push(this.getSubnav($temp)[0]);
                        }

                        return $(subnavs);
                    }

                    return UXN.U.findAll($from || this.$nav, "." + this.opt.subnavHasOpened + ", ." + this.opt.currentSubnav);
                },

                hasSubnavOpenedSubnav = function ($subnav /*jQuery*/ /*<= Boolean*/) { 

                    return UXN.U.hasClass($subnav, this.opt.subnavHasOpened);
                },

                hasOpenerSubnav = function ($opener /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($opener, !this.itemOpensSubnav ? this.opt.openerHasSubnav : this.opt.itemHasSubnav);
                },

                hasItemSubnav = function ($item /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($item, this.opt.itemHasSubnav);
                },

                hasOpenerOpenedSubnav = function ($opener /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($opener,  !this.itemOpensSubnav ? this.opt.openerOpened : this.opt.itemOpened);
                },

                hasItemOpenedSubnav = function ($item /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.hasClass($item, this.opt.itemOpened);
                },

                isItem = function ($element /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.matches($element, this.opt.nav + " " + this.opt.item);
                },

                isOpener = function ($element /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.matches($element, this.opt.nav + " " + this.opt.opener);
                },

                isSubnav = function ($element /*jQuery*/ /*<= Boolean*/) {

                    return UXN.U.matches($element, this.opt.nav + " " + this.opt.subnav);
                },

                getAllOpeners = function ($from /*jQuery*/, asArrayWith$Objects /*Boolean?*/, includeWithoutSubnav /*Boolean?*/ /*<= jQuery*/) {

                    var $result = UXN.U.findAll($from || this.$nav, includeWithoutSubnav ? this.opt.opener : 
                            !this.itemOpensSubnav ? "." + this.opt.openerHasSubnav : "." + this.opt.itemHasSubnav
                        );

                    if (asArrayWith$Objects) {

                        return UXN.U.toArrayWith$Objects($result);
                    }

                    return $result;
                },

                getAllItems = function ($from /*jQuery*/, asArrayWith$Objects /*Boolean?*/ /*<= jQuery*/, includeWithoutSubnav /*Boolean?*/ /*<= jQuery*/) {

                    var $result = UXN.U.findAll($from || this.$nav, includeWithoutSubnav ? this.opt.item : "." + this.opt.itemHasSubnav);

                    if (asArrayWith$Objects) {

                        return UXN.U.toArrayWith$Objects($result);
                    }

                    return $result;
                },

                getAllSubnavs = function ($from /*jQuery*/, asArrayWith$Objects /*Boolean?*/ /*<= jQuery*/) {

                    var $result;

                    $result = UXN.U.findAll($from || this.$nav, this.opt.subnav);

                    if (asArrayWith$Objects) {

                        return UXN.U.toArrayWith$Objects($result);
                    }

                    return $result;
                },

                getSubnav = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.findFirst($element, this.opt.subnav);
                },

                getOpener = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.findFirst($element, this.opt.opener);
                },

                getItem = function ($element /*jQuery*/ /*<= jQuery*/) {

                    return UXN.U.findFirst($element, this.opt.item);
                },
                
                toggleDebug = function () {
                    
                    if (typeof UXN.Debugger !== "object" || UXN.Debugger === null) {
                        
                        if (console && console.warn) {
                            
                            console.warn(UXN.Debugger ? UXN.Debugger: MSGS.NO_DEBUGGER);
                        }
                        
                        return;
                    }
                    
                    this.opt.debug = !this.opt.debug;
                    
                    if (this.opt.debug) {
                        
                        UXN.Debugger.insertStylesForDebugging(this);
                        
                        this.opt.insideTimeout *= UXN.DEBUG.TIMEOUT_MULTIPLIER;

                        this.opt.openTimeout *= UXN.DEBUG.TIMEOUT_MULTIPLIER;
                        
                    } else {
                        
                        UXN.Debugger.removeStylesForDebugging(this);
                        
                        this.opt.insideTimeout /= UXN.DEBUG.TIMEOUT_MULTIPLIER;

                        this.opt.openTimeout /= UXN.DEBUG.TIMEOUT_MULTIPLIER;
                    }
                };

            return {
                refresh: refresh,
                destroy: destroy,

                open: open,
                close: close,
                
                sleep: sleep,
                wake: wake,
                
                isNavInsideViewport: isNavInsideViewport,
                isSubnavHorizontal: isSubnavHorizontal,
                isAnySubnavOpened: isAnySubnavOpened,
                isAnySubnavFading: isAnySubnavFading,
                isSiblingOpenerOpened: isSiblingOpenerOpened,
                isSiblingOpenerFadingOut: isSiblingOpenerFadingOut,
                isSiblingItemOpened: isSiblingItemOpened,
                isSiblingItemFadingOut: isSiblingItemFadingOut,
                isInFadingSubnav: isInFadingSubnav,
                isInFirstLevel: isInFirstLevel,
                isSubnav: isSubnav,
                isOpener: isOpener,
                isItem: isItem,

                shouldCloseNav: shouldCloseNav,
                
                hasFirstLevelOpenedSubnav: hasFirstLevelOpenedSubnav,
                hasOpenerFadingSubnav: hasOpenerFadingSubnav,
                hasItemFadingSubnav: hasItemFadingSubnav,
                hasSubnavFadingSubnav: hasSubnavFadingSubnav,
                hasOpenerSubnav: hasOpenerSubnav,
                hasItemSubnav: hasItemSubnav,
                hasSubnavOpenedSubnav: hasSubnavOpenedSubnav,
                hasOpenerOpenedSubnav: hasOpenerOpenedSubnav,
                hasItemOpenedSubnav: hasItemOpenedSubnav,
                
                getOpenersInSubnav: getOpenersInSubnav,
                getItemsInSubnav: getItemsInSubnav,
                getItemsWithSubnavInSubnav: getItemsWithSubnavInSubnav,
                getOpenersWithSubnavInSubnav: getOpenersWithSubnavInSubnav,
                getItemsWithFadingSubnavInSubnav: getItemsWithFadingSubnavInSubnav,
                getOpenersWithFadingSubnavInSubnav: getOpenersWithFadingSubnavInSubnav,
                getOpenedOpenersInSubnav: getOpenedOpenersInSubnav,
                getOpenedItemsInSubnav: getOpenedItemsInSubnav,
                getClosestSubnav: getClosestSubnav,
                getClosestOpener: getClosestOpener,
                getClosestItem: getClosestItem,
                getOpenedSubnavs: getOpenedSubnavs,
                getOpenedOpeners: getOpenedOpeners,
                getOpenedItems: getOpenedItems,
                getAllSubnavs: getAllSubnavs,
                getAllOpeners: getAllOpeners,
                getAllItems: getAllItems,
                getSubnav: getSubnav,
                getOpener: getOpener,
                getItem: getItem,
                
                toggleDebug: toggleDebug
            };
        }());

        return UXN;
        
    }());
}(jQuery, window));

(function ($, ns) {

    ns.UXN.SUPPORT.SVG = !!window.SVGElement;
    
    ns.UXN.Debugger = !ns.UXN.SUPPORT.SVG ? "UXN Debugger: Browser does not support SVG.": (function () {
    
        ns.UXN.DEBUG = {

            TIMEOUT_MULTIPLIER : 1.75,
            
            COLORS: {
                TRIANGLE             : "rgba(2, 140, 183, 0.25)",
                ALT_TRIANGLE         : "rgba(97, 180, 0, 0.25)",
                SURROUNDING_ZONE     : "rgba(191, 0, 59, 0.25)",
                SLIDING_ZONE         : "rgba(255, 139, 0, 0.35)",

                ACTIVE_INSTANCE      : "#0f0",
                CURRENT_SUBNAV       : "#ff0",
                SUBNAV_HAS_OPENED    : "#fff",
                SUBNAV_HAS_FADING_OUT: "#f90",
                ITEM_OPENED          : "#0ff",
                OPENER_OPENED        : "#00f",
                ITEM_HAS_FADING_OUT  : "#f0f",
                OPENER_HAS_FADING_OUT: "#90f",
                SUBNAV_IS_FADING_OUT : "#999",
                RESET_POSITION       : "#f00"
            },

            OPACITY: 0.8,

            Z_INDEX              : 2,
            RESET_Z_INDEX        : 2,
            ITEM_OPENED_Z_INDEX  : 3,
            OPENER_OPENED_Z_INDEX: 3,
            ITEM_FADING_Z_INDEX  : 2,
            OPENER_FADING_Z_INDEX: 2
        };
        
        var settingsInitialized = false,
            
            SVGNS = "http://www.w3.org/2000/svg",
            
            removeStylesForDebugging = function (uxn) {

                $("#" + ns.UXN.DEBUG.IDS.STYLE + uxn.id).remove();
            },

            insertStylesForDebugging = function (uxn) {

                if (!settingsInitialized) {
                    
                    ns.UXN.DEBUG = $.extend({
                        
                        IDS: {
                            STYLE: ns.UXN.PREFIX + "-debugger" + ns.UXN.BEM.EL + "style" + ns.UXN.BEM.MOD
                        },

                        CLASSES: {
                            SVG: ns.UXN.PREFIX + "-debugger" + ns.UXN.BEM.EL + "svg"
                        }

                    }, ns.UXN.DEBUG);
                    
                    settingsInitialized = true;   
                }
                
                var $inserted = $("#" + ns.UXN.DEBUG.IDS.STYLE + uxn.id);

                if ($inserted.length) {

                    return;
                }

                var styles = window.getComputedStyle(uxn.$firstLevel[0]),

                    position = styles.position,
                    opacity = styles.opacity,
                    zIndex = styles.zIndex,

                    $style = $("<style />");

                $style[0].id = ns.UXN.DEBUG.IDS.STYLE + uxn.id;

                $style.text([

                    "\n\t" + uxn.opt.nav + " > " + uxn.opt.subnav + " {\n",
                        (opacity > ns.UXN.DEBUG.OPACITY) ? 
                            "\t\topacity:       " + ns.UXN.DEBUG.OPACITY + " !important;\n" : "",

                        (position !== "relative" && position !== "absolute" && position !== "fixed" && position !== "sticky") ? 
                            "\t\tposition: relative !important;\n" : "",

                        (+zIndex < ns.UXN.DEBUG.Z_INDEX || zIndex === "auto") ? 
                            "\t\tz-index:         " + ns.UXN.DEBUG.Z_INDEX + " !important;\n" : "",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + "." + uxn.opt.activeInstance +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.ACTIVE_INSTANCE + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.currentSubnav +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.CURRENT_SUBNAV + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.openerOpened +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.ITEM_OPENED + " !important;\n",
                        "\t\tz-index: " + ns.UXN.DEBUG.OPENER_OPENED_Z_INDEX + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.itemOpened +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.OPENER_OPENED + " !important;\n",
                        "\t\tz-index: " + ns.UXN.DEBUG.ITEM_OPENED_Z_INDEX + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.openerHasFadingOut +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.ITEM_HAS_FADING_OUT + " !important;\n",
                        "\t\tz-index: " + ns.UXN.DEBUG.OPENER_FADING_Z_INDEX + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.itemHasFadingOut +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.OPENER_HAS_FADING_OUT + " !important;\n", 
                        "\t\tz-index: " + ns.UXN.DEBUG.ITEM_FADING_Z_INDEX + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.subnavHasFadingOut +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.SUBNAV_HAS_FADING_OUT + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + ns.UXN.POSITIONS.CLASSES.RESET +" {\n",
                        "\t\toutline: 1px solid " + ns.UXN.DEBUG.COLORS.RESET_POSITION + " !important;\n",
                        "\t\tz-index: " + ns.UXN.DEBUG.RESET_Z_INDEX + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.subnavHasOpened +" {\n",
                        "\t\tbackground-color: " + ns.UXN.DEBUG.COLORS.SUBNAV_HAS_OPENED + " !important;\n",
                    "\t}\n",

                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.itemHasFadingOut + " > " + uxn.opt.subnav + ",",
                    "\n\t" + uxn.opt.nav + " ." + uxn.opt.openerHasFadingOut + " > " + uxn.opt.subnav + " {\n",
                        "\t\tbackground-color: " + ns.UXN.DEBUG.COLORS.SUBNAV_IS_FADING_OUT + " !important;\n",
                    "\t}\n"

                ].join(""));

                $style.appendTo("head");
            },
            
            debugRectangle = function (uxn, top, left, bottom, right, color) {

                var s = document.createElementNS(SVGNS, "svg"),
                    p = document.createElementNS(SVGNS, "rect");

                s.setAttributeNS(null, "class", ns.UXN.DEBUG.CLASSES.SVG);
                s.setAttributeNS(null, "width", window.innerWidth);
                s.setAttributeNS(null, "height", window.innerHeight);

                s.style.position = "fixed";
                s.style.zIndex = 0;
                s.style.top = 0;
                s.style.left = 0;

                p.setAttributeNS(null, "fill", color || ns.UXN.DEBUG.COLORS.SURROUNDING_ZONE);
                p.setAttributeNS(null, "width", right - left);
                p.setAttributeNS(null, "height", bottom - top);
                p.setAttributeNS(null, "x", left);
                p.setAttributeNS(null, "y", top);

                s.appendChild(p);

                uxn.$nav[0].appendChild(s);
            },

            debugTriangle = function (uxn, ax, ay, bx, by, cx, cy, color) {

                var s = document.createElementNS(SVGNS, "svg"),
                    p = document.createElementNS(SVGNS, "polygon");

                s.setAttributeNS(null, "class", ns.UXN.DEBUG.CLASSES.SVG);
                s.setAttributeNS(null, "width", window.innerWidth);
                s.setAttributeNS(null, "height", window.innerHeight);

                s.style.position = "fixed";
                s.style.zIndex = 0;
                s.style.top = 0;
                s.style.left = 0;

                p.setAttributeNS(null, "fill", color || ns.UXN.DEBUG.COLORS.TRIANGLE);
                p.setAttributeNS(null, "points", ax + "," + ay + " " + bx + "," + by + " " + cx + "," + cy);

                s.appendChild(p);

                uxn.$nav[0].appendChild(s);
            },

            clearDebug = function (uxn) {

                var svgs = uxn.$nav[0].querySelectorAll("." + ns.UXN.DEBUG.CLASSES.SVG),

                    length = svgs.length, i = 0;

                for (i; i < length; i++) {

                    uxn.$nav[0].removeChild(svgs[i]);
                }
            };
        
        return {
            debugRectangle: debugRectangle,
            debugTriangle: debugTriangle,
            clearDebug: clearDebug,
            removeStylesForDebugging: removeStylesForDebugging,
            insertStylesForDebugging: insertStylesForDebugging
        };
    }());
}(jQuery, window));