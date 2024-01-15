
const CONFIG = {"VERSION":"20230906","PROJECT_NAME":"imaems"};



// > imaemsUI
const imaemsUI = (function (window, jQuery) {
    if (!window.jQuery) { throw new Error("requires jQuery") }

    const debug = 1;

    let $ = window.jQuery;

    let breakpoints = {
        "xxs": 0,
        "xs": 375,
        "sm": 576,
        "md": 768,
        "lg": 1024,
        "xl": 1280,
        "xxl": 1366,
        "uxl": 1680
    };

    let mqUp = {
        "xxs": window.matchMedia("(min-width: " + breakpoints.xxs + "px)"),
        "xs": window.matchMedia("(min-width: " + breakpoints.xs + "px)"),
        "sm": window.matchMedia("(min-width: " + breakpoints.sm + "px)"),
        "md": window.matchMedia("(min-width: " + breakpoints.md + "px)"),
        "lg": window.matchMedia("(min-width: " + breakpoints.lg + "px)"),
        "xl": window.matchMedia("(min-width: " + breakpoints.xl + "px)"),
        "xxl": window.matchMedia("(min-width: " + breakpoints.xxl + "px)"),
        "uxl": window.matchMedia("(min-width: " + breakpoints.uxl + "px)"),
    };


    let mqDown = {
        "xxs": window.matchMedia("(max-width: " + breakpoints.xs + "px)"),
        "xs": window.matchMedia("(max-width: " + breakpoints.sm + "px)"),
        "sm": window.matchMedia("(max-width: " + breakpoints.md + "px)"),
        "md": window.matchMedia("(max-width: " + breakpoints.lg + "px)"),
        "lg": window.matchMedia("(max-width: " + breakpoints.xl + "px)"),
        "xl": window.matchMedia("(max-width: " + breakpoints.xxl + "px)"),
        "xxl": window.matchMedia("(max-width: " + breakpoints.uxl + "px)"),
        // "uxl" : window.matchMedia("(max-width: "+breakpoints.+"px)"),
    };


    // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }


    // https://medium.com/@mingjunlu/lazy-loading-images-via-the-intersection-observer-api-72da50a884b7
    if ('loading' in HTMLImageElement.prototype) {
        // 支援原生 lazy loading
        console.log('支援原生 lazy loading!!');
    } else {
        // 不支援，改用其他備案
    }


    const updateCursor = ({ x, y }) => {
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--y', y);

        // console.log(x, y);
    }

    document.body.addEventListener('pointermove', updateCursor)
    const {ref, createApp} = Vue;
    return {
/**
 * ---------------------------------------------------------------------------------
 * >> .init()
 */

init() {
    const _ = this;
    $("body").addClass('js-loading-ok');
    _.scrolling();
    _.customElement().modField();

    $(window).on('resize', function () {
        if (mqUp.lg.matches) {
            // console.log("qwe");
            $("body").removeClass("js-open-mobile-menu");
        }
    });

    if ($("#goTop").length) {
        createApp(_.goTop()).mount("#goTop");
    }
    

},

/**
 * ---------------------------------------------------------------------------------
 * >> .customElement()
 */

customElement() {
    const _ = this;

    return {
        modCard: function() {
            // 卡片
            class moduleCard extends HTMLElement {
                constructor() {
                    // Always call super first in constructor
                    super();
                    $(this).css({
                        "display": "block"
                    });
                    // Element functionality written in here
                    $(this).hover(function() {
                        $(this).addClass("js-hover");
                    }, function() {
                        $(this).removeClass("js-hover");
                    });
                }
            }
            customElements.define("module-card", moduleCard);
        },
        modField: function(){
            class moduleField extends HTMLElement {
                constructor() {
                    // Always call super first in constructor
                    super();
                    function fieldFocus(elm) {
                        // console.log("fieldFocus");
                        let $this_parent = $(elm).parents("module-field");
                        $this_parent.addClass("js-focus");
                    }
                    function fieldFocusout(elm) {
                        // console.log("fieldFocusout");
                        let $this_parent = $(elm).parents("module-field");
                        $this_parent.removeClass("js-focus");
                    }
                    const $ctrler = $(this).find("[class$=-ctrler]");
                    // console.log($ctrler);

                    if ($(this).hasClass("date_field")) {
                        // $ctrler.addClass("input-group");
                        $ctrler.append($("<div>", {
                            class: "icon"
                        }).append("<i class=\"fa-solid fa-calendar-days\"></i>"));
                    }
                    

                    let $this_input = $(this).find("input");
                    if ($this_input) {
                        $this_input
                        .focus(function() {
                            fieldFocus($(this));
                        }).focusout(function() {
                            fieldFocusout($(this));
                        });
                    }

                    let $this_select = $(this).find("select");
                    if ($this_select) {
                        $this_select
                        .focus(function() {
                            fieldFocus($(this));
                        }).focusout(function() {
                            fieldFocusout($(this));
                        });
                    }

                    let $this_textarea = $(this).find("textarea");
                    if ($this_textarea) {
                        $this_textarea
                        .focus(function() {
                            fieldFocus($(this));
                        }).focusout(function() {
                            fieldFocusout($(this));
                        });
                    }

                }
            }
            customElements.define("module-field", moduleField);
        },
        listPagination: function() {   
            class listPagination extends HTMLElement {
                constructor() {
                    // Always call super first in constructor
                    super();
                    // Element functionality written in here
                }
            }
            customElements.define("list-pagination", listPagination);
        }
    
    }


},
/**
 * ---------------------------------------------------------------------------------
 * >> .goTop()
 */

goTop() {
    return {
        setup() {
            const goToTop = () => {
                event.preventDefault();
                // console.log("gototop");
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            };
    
            return {
                goToTop
            }
        }
    }

},
/**
 * ---------------------------------------------------------------------------------
 * >> .scrolling()
 */

scrolling() {
    const _ = this;
    if($(window).scrollTop() >= 100) {
        $("body").addClass('js-scrolling');
    }
    $(window).scroll(function(event) {
        // console.log($(this).scrollTop());
        if ($(this).scrollTop() >= 100) {
            $("body").addClass('js-scrolling');
        }else {
            $("body").removeClass('js-scrolling');
        }
    });

},
/**
 * ---------------------------------------------------------------------------------
 * >> .mmenu()  手機版menu 動作
 */
mmenu(){
    return {
        init: function() {
            console.log("mmenu start");
            let _this = this;

            let $body = $("body");

            (!$body.hasClass("js-open-mobile-menu")) ? _this.open($body): _this.close($body);
        },

        // mmenu.open
        open: function(el) {
            // console.log('open');
            el.addClass("js-open-mobile-menu");
        },

        // mmenu.close
        close: function(el) {
            // console.log('close');
            el.removeClass("js-open-mobile-menu");
        }
    }
},

/**
 * ---------------------------------------------------------------------------------
 * >> .log()  
 */
log(...args){
    if (debug) {
        const stack = new Error().stack;
        const callerInfo = stack.split('\n')[2].trim();  // 取得呼叫 `customLog` 的堆疊資訊
        console.log(
            `%cCalled from %c${callerInfo}:%c\n`, 
            "color: brown; font-weight: bolder;",  // "Called from" 的樣式
            "color: blue;",   // callerInfo 的樣式
            "color: black;", // 重置為預設風格
            ...args
          );
    }
},

/**
 * ---------------------------------------------------------------------------------
 * >> .frmValidate()
 */

frmValidate() {
    return {
        errMsg: function(){
            
        },
        handleFormSubmit: function(form, constraints, callback) {
            const _ = this;
            var errors = validate(form, constraints, { fullMessages: false });// validate the form aainst the constraints
            _.showErrors(form, errors || {}); // then we update the form to reflect the results
            if (!errors) {
                callback();
            }
        },
        showErrors: function(form, errors) {
            const _ = this;
            $.each(form.find("input[name], select[name], textarea[name]"), function (i, el) {
                console.log(i);
                console.log(el);
                _.showErrorsForInput(el, errors && errors[el.name]);
            });
        },
        showErrorsForInput: function(input, errors) {
            const $field = $(input.closest("module-field"));
            const $errorMsg = $("<div>", {
                class: "error-msg"
            });
    
            // console.log($field);
    
            $field.removeClass("has-error");
            $field.removeClass("has-success");
    
    
    
            if (errors) {
                $field.addClass("has-error");
                $field.find(".error-msg").remove();
                $.each(errors, function (i, error) {
                    $field.find(".imaems_field-block").append($errorMsg.html(error));
                });
            } else {
                $field.addClass("has-success");
                $field.find(".error-msg").remove();
            }
        }
    }

},


/*
frmValidate(frm, constraints) {
    const $frm = frm;

    // $frm.submit((e) => {
        // e.preventDefault();

        var errors = validate($frm, constraints, { fullMessages: false });
        console.log(errors);

        showErrors($frm, errors || {});

    // });

    const $frm_controls = $frm.find(".form-control");
    // console.log($frm_controls.length);
    $frm_controls.each(function (i, el) {
        $(el).on('change', () => {
            console.log('Input value changed');
            var errors = validate($frm, constraints, { fullMessages: false }) || {};
            showErrorsForInput(el, errors[el.name])
        });
    });

    const showErrors = (form, errors) => {
        $.each(form.find("input[name], select[name], textarea[name]"), function (i, el) {
            // console.log(i);
            // console.log(el);
            showErrorsForInput(el, errors && errors[el.name]);
        });
    }

    const showErrorsForInput = (input, errors) => {
        const $field = $(input.closest("module-field"));
        const $errorMsg = $("<div>", {
            class: "error-msg"
        });

        // console.log($field);

        $field.removeClass("has-error");
        $field.removeClass("has-success");



        if (errors) {
            $field.addClass("has-error");
            $field.find(".error-msg").remove();
            $.each(errors, function (i, error) {
                $field.append($errorMsg.html(error));
            });
        } else {
            $field.addClass("has-success");
            $field.find(".error-msg").remove();
        }
    }


},
*/
    }
}(window, jQuery));


$(function() {
    imaemsUI.init();

    // $("#date").flatpickr({
    //     "locale": "zh_tw"
    // });
    flatpickr.localize(flatpickr.l10ns.zh_tw);
    flatpickr("#date", {
        maxDate: "today"
    });
});
