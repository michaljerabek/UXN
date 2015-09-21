/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, UXN*/

var demos = {};

$(function () {

    demos.demo1 = new UXN({
        nav: "#demo1",
        setPositions: true,
        firstLevelPositionBase: $("#demo1").closest(".examples__tab")
    });
    
    demos.demo2 = new UXN({
        nav: "#demo2",
        setPositions: true,
        firstLevelPositionBase: $("#demo2").closest(".examples__tab"),
        fading: UXN.FADING_TYPE.TRANSITION
    });
    
    demos.demo3 = new UXN({
        nav: "#demo3",
        opener: ".UXN__opener",
        setPositions: true,
        firstLevelPositionBase: $("#demo3").closest(".examples__tab"),
        fading: UXN.FADING_TYPE.ANIMATION,
        animation: "hide"
    });
    
    demos.demo4 = new UXN({
        nav: "#demo4",
        item: ".UXN__item",
        subnav: ".UXN__subnav",
        fading: UXN.FADING_TYPE.TRANSITION,
        ignoreLayoutOnSliding: true,
        minZoneExt: 0,
        maxZoneExt: 15,
        mouseTolerance: 0.25
    });
    
    demos.demo5 = new UXN({
        nav: "#demo5",
        setPositions: true,
        firstLevelPositionBase: $("#demo5").closest(".examples__tab"),

        fading: UXN.FADING_TYPE.JS,
        onOpen: function ($subnav) {

            $subnav.stop().slideDown(150);
        },
        onClose: function ($subnav, $opener, $item, done) {

            $subnav.stop().slideUp(150, function () {

                $subnav.css("display", "");

                done();
            });
        }
    });
    
    demos.demo6 = new UXN({
        nav: "#demo6",
        item: ".UXN__item",
        subnav: ".UXN__subnav",

        delayHide: true,
        closeOnlyInLevel: true,

        allowSlidingOnFirstLevel: true,
        fading: UXN.FADING_TYPE.TRANSITION,

        onClose: function ($subnav, $opener, $item) {

            if ($item.hasClass("UXN__item--subcategory") && this.$currentItem[0] === $item[0]) {

                return false;
            }
        },

        onOpen: function ($subnav, $opener, $item) {

            if ($item.hasClass("UXN__item--category") && !this.hasSubnavOpenedSubnav($subnav)) {

                this.open(this.getSubnav($subnav), true);
            }
        },

        onSubnavChange: function ($current) {
          
            if ($current[0] === this.$firstLevel[0]) {

                this.opt.mouseTolerance = 0;
                
            } else {
                
                this.opt.mouseTolerance = 0.25;
            }
        },
        
        minZoneExt: 0,
        maxZoneExt: 15,
        mouseTolerance: 0.25
    });
    
    demos.demo7 = new UXN({
        nav: "#demo7",
        item: ".UXN__item",
        subnav: ".UXN__subnav",

        setPositions: true,
        firstLevelPositionBase: $("#window"),
        firstLevelPositionsFromCenter: false,

        fading: UXN.FADING_TYPE.TRANSITION
    });
    
    var stopLocation = false,
    
        showTabByLocation = function () {

            if (stopLocation) {

                stopLocation = false;

                return;
            }

            var id = window.location.hash.match(/[0-9]+/);

            if (id && demos["demo" + id[0]]) {

                id = id[0];

                $("#tab" + id).click();

                demos["demo" + id[0]].wake();
            }
        };
    
    $(window).on("hashchange", showTabByLocation);

    if (window.location.hash === "") {

        var checked = $(".examples__switch:checked").attr("id");
        
        window.location.hash = "#" + checked.match(/[0-9]+/)[0];

    } else {

        showTabByLocation();
    }

    $(".debug-mode").on("click", function () {

        var $this = $(this);

        demos[$this.parent().find("[id^='demo']")[0].id].toggleDebug();

        $this.toggleClass("on");
    });

    $(".examples__switch").on("change", function () {

        if (this.checked) {

            stopLocation = true;

            var id = this.id.match(/[0-9]+/);

            window.location.hash = "#" + id[0];

            demos["demo" + id[0]].wake();
        }
    });
});

