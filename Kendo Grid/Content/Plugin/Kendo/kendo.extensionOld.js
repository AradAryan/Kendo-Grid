/*chagnes done to kendo.all.min.js
1- errorTemplate: ''
2- numerictextbox.options{span, decimal, min, format} 
3- k-numeric-wrap style must be deleted.
*/
// validation
var validationConfig = {
    rules: {
        required: function (input) {
            if (input.is("[d-val*=required]"))
                return isMatch(input, input.val() && input.val().length > 0);
            return true;
        },
        mobile: function (input) {
            if (input.is("[d-val*=mobile]"))
                return isMatch(input, input.val().match(/^(09\d{9}){0,1}$/));
            return true;
        },
        zipCode: function (input) {
            if (input.is("[d-val*=zipCode]"))
                return isMatch(input, input.val().match(/^$|^\d{10}$/));
            return true;
        },
        phone: function (input) {
            if (input.is("[d-val*=phone]"))
                return isMatch(input, input.val().match(/^$|^0[0-9\-]{5,49}$/));
            return true;
        },
        tel: function (input) {
            if (input.is("[d-val*=tel]"))
                return isMatch(input, input.val().match(/^$|^[0-9-]{5,49}$/));
            return true;
        },
        nationalCode: function (input) {
            if (input.is("[d-val*=nationalCode]"))
                return isMatch(input, input.val().match(/^$|^\d{10}$/) && isValidNationalCode(input.val()));
            return true;
        },
        nationalId: function (input) {
            if (input.is("[d-val*=nationalId]"))
                return isMatch(input, input.val().match(/^$|^\d{11}$/));
            return true;
        },
        birthCertSerial: function (input) {
            if (input.is("[d-val*=birthCertSerial]"))
                return isMatch(input, input.val().match(/^$|^\d{6}$/));
            return true;
        },
        email: function (input) {
            if (input.is("[d-val*=email]"))
                return isMatch(input, input.val().match(/^$|^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
            return true;
        },
        date: function (input) {
            if (input.is("[d-val*=date]"))
                return isMatch(input, input.val().match(/^$|^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])$/));
            return true;
        },
        miladiDate: function (input) {
            if (input.is("[d-val*=miladiDate]"))
                return isMatch(input, input.val().match(/^$|^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])$/));
            return true;
        },
        integer: function (input) {
            if (input.is("[d-val*=integer]"))
                return isMatch(input, input.val().match(/^(\+|-)?\d*$/));
            return true;
        },
        letter: function (input) {
            if (input.is("[d-val*=letter]"))
                return isMatch(input, input.val().match(/^([a-zA-Z پچجحخهعغفقثصضشسیبلاتنمكيکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/));
            return true;
        },
        time: function (input) {
            if (input.is("[d-val*=time]"))
                return isMatch(input, input.val().match(/^$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/));
            return true;
        },
        decimal: function (input) {
            if (input.is("[d-val*=decimal]"))
                return isMatch(input, input.val().match(/^$|^[-+]?(?:\d*\.?\d+)$/));
            return true;
        },
        url: function (input) {
            if (input.is("[d-val*=url]"))
                return isMatch(input, input.val().match(/^$|^((ht|f)tp(s)?:\/\/)?(w{0,3}\.)?[a-zA-Z0-9_\-\.\:\#\/\~\}]+(\.[a-zA-Z]{1,4})(\/[a-zA-Z0-9_\-\.\:\#\/\~\}])?(\?[a-zA-Z0-9])?$/));
            return true;
        },
        noPunctuation: function (input) {
            if (input.is("[d-val*=noPunctuation]"))
                return isMatch(input, input.val().match(/^([a-zA-Z0-9 پچجحخهعغفقثصضشسیيبلاتنمكکگوئدذرزطظژؤآءً ])*$/));
            return true;
        },
        justPersian: function (input) {
            if (input.is("[d-val*=justPersian]"))
                return isMatch(input, input.val().match(/^([پچجحخهعغفقثصضشسیيبلاتنمكکگوئدذرزطظژؤآءً ])*$/));
            return true;
        },
        comboRequired: function (input) {
            if (input.is("[d-val*=comboRequired]"))
                return isMatch(input, input.val() == '0' ? false : input.val());
            return true;
        },
        intRange: function (input) {
            if (input.is("[d-val*=intRange]"))
                return isMatch(input, input.val().match(/^$|^\d+(\-\d+)?(\,(\d+(\-\d+)?))*$/));
            return true;
        }
    },
    messages: {
        mobile: function (input) {
            setMessage(input, "شماره را به درستی وارد نمایید. مثال: 09123334455");
        },
        zipCode: function (input) {
            setMessage(input, " کد پستی  را به درستی وارد نمایید.");
        },
        phone: function (input) {
            setMessage(input, " شماره را به درستی وارد نمایید. مثال: 9-02133445566");
        },
        tel: function (input) {
            setMessage(input, " شماره را به درستی وارد نمایید. مثال: 44556677");
        },
        nationalCode: function (input) {
            setMessage(input, " کد ملی  را به درستی وارد نمایید.");
        },
        nationalId: function (input) {
            setMessage(input, " شناسه ملی  را به درستی وارد نمایید.");
        },
        birthCertSerial: function (input) {
            setMessage(input, "سریال شناسنامه 6 رقمی است.");
        },
        email: function (input) {
            setMessage(input, " نشانی الکترونیکی معتبر وارد کنید");
        },
        date: function (input) {
            setMessage(input, " فرمت تاریخ نادرست است مثال 1390/02/13");
        },
        miladiDate: function (input) {
            setMessage(input, " فرمت تاریخ نادرست است مثال 2002/01/22");
        },
        integer: function (input) {
            setMessage(input, " فقط اعداد وارد کنید");
        },
        letter: function (input) {
            setMessage(input, 'فقط حروف وارد کنید ');
        },
        time: function (input) {
            setMessage(input, " ساعت را معتبر وارد نمایید. مثال: 8:00");
        },
        decimal: function (input) {
            setMessage(input, " عدد اعشاری معتبر وارد کنید");
        },
        url: function (input) {
            setMessage(input, " نشانی معتبر وارد کنید. مثال www.test.com");
        },
        noPunctuation: function (input) {
            setMessage(input, " فقط اعداد و حروف وارد کنید");
        },
        justPersian: function (input) {
            setMessage(input, " فقط حروف فارسی وارد نمایید");
        },
        comboRequired: function (input) {
            setMessage(input, "هیچ گزینه انتخاب نشده است");
        },
        required: function (input) {
            setMessage(input, "الزامی");
        },
        intRange: function (input) {
            setMessage(input, "رنج عددی قابل قبول وارد نمایید.");
        }
    }
}

function getRealInput(input) {
    var element = input.parent('.k-widget.k-dropdown');
    if (!element.length) {
        element = input.parent('.k-widget.k-combobox');
        if (!element.length) {
            element = input.parent('span').parent('.k-widget.k-numerictextbox');
            if (!element.length) {
                element = input.parent('.k-widget.k-autocomplete');
                if (!element.length) {
                    element = input.parent('span').parent('.k-widget.k-datepicker')
                    if (!element.length) 
                        element = input;
                }
            }
        }
    }
    return element;
}

function isMatch(input, value) {
    var element = getRealInput(input);
    if (value) {
        element.removeClass('validation-error');
        $('span.validation-msg').hide();
    }
    else {
        element.addClass('validation-error');
    }
    return element.is(':visible')
        ? (typeof (value) === 'boolean')
            ? value
            : value && value.length
        : true;
}

function setMessage(input, msg) {
    var element = getRealInput(input);
    element.attr('d-msg', msg);
}
//Layouting
function recalcLayout(selector) {
    selector = selector ? selector : '';
    $(selector + ' div[d-field]')
        .each(function (i, v) {
            var txt = $(this).attr('d-field');
            if (txt && txt.length)
                $(this).addClass('k-textbox').prepend('<h4 class="k-header">' + txt + '</h4>');
        });
    $(selector + 'div[d-wrp]')
        .each(function (i, v) {
            var txt = $(this).attr('d-wrp');
            if (txt && txt.length)
                $(this).addClass('k-block').prepend('<h4 class="k-headerBg">' + txt + '</h4>');
        });

    $('div[d-wrp].d-horizontal div[d-field]').not('.d-command-bar').each(function () {
        var arr = new Array();
        var divToAdd = $('<div d-field="' + $(this).attr('d-field') + '" class="' + $(this).attr('class') + '"></div>');
        divToAdd.insertAfter($(this));
        $(this).children().first().appendTo(divToAdd);

        $(this).children().each(function () {
            var classToAdd = $(this).is('.x1, .x2, .x3, .x4, .x5, .x05') ? $(this).attr('class') : 'x1';
            var divNextToAdd = $('<div d-field="" class="' + classToAdd + '"> </div>');
            $(this).appendTo(divNextToAdd);
            arr.push(divNextToAdd);
        });

        $(this).remove();
        for (var i = arr.length - 1; i >= 0 ; i--) {
            arr[i].insertAfter(divToAdd);
        }
    });
}
$(function () {
    //Layouting
    recalcLayout();

    //validation
    $('input[d-mask]').each(function () {
        var dDefText = $(this).attr('d-def');
        if (dDefText != undefined) {
            var def = dDefText.split(" ");
            $.mask.definitions[def[0]] = "[" + def[1] + "]";
        }

        var dMaskText = $(this).attr('d-mask');
        $(this).mask(dMaskText);

    });



    $('.validation-error').live('mouseover', function (e) {
        var message = $('span.validation-msg');
        message.text($(this).attr('d-msg'));
        var position = $(this).offset();
        message.css({ top: position.top - 30, left: position.left + 2 });
        message.show();
    });
    $('.validation-error').live('mouseout', function (e) {
        $('span.validation-msg').hide();
    });
    $('form').kendoValidator(validationConfig);
    $('input[d-val*="date"]')
        .datepicker({
            onSelect: function () {
                $(this).change();
            }
        })
        .attr('maxlength', 10)
        .addClass('d-ltr');

    $('input[d-val*="miladiDate"]')
        .kendoDatePicker({ format: 'yyyy/MM/dd' })
        .attr('maxlength', 10)
        .addClass('d-ltr');

    $('input[d-val*="nationalCode"], input[d-val*="zipCode"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 10)
        .addClass('d-ltr');
    $('input[d-val*="nationalId"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 11)
        .addClass('d-ltr');
    $('input[d-val*="birthCertSerial"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 6)
        .addClass('d-ltr');
    $('input[d-val*="url"], input[d-val*="email"]')
        .attr('maxlength', 80)
        .addClass('d-ltr');
    $('input[d-val*="phone"], input[d-val*="tel"]')
        .keypress(function (event) {
            filterKeys(event, [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 15)
        .addClass('d-ltr');

    $('input[d-val*="mobile"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 11)
        .addClass('d-ltr');

    $('input[d-val*="integer"]')
        .keypress(function (event) {
            filterKeys(event, [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', function () { return $(this).attr('maxlength') ? $(this).attr('maxlength') : 19; })
        .addClass('d-ltr');

    $('input[data-role="numerictextbox"]')
       .keyup(function (e) {
           $(this).val(commaSeparatedNumber($(this).val()));
       })
       .addClass('d-ltr');

    $('input[d-val*="time"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58]);
        })
        .attr('maxlength', 5)
        .addClass('d-ltr');
    $('input[d-val*="decimal"]')
        .keypress(function (event) {
            filterKeys(event, [45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', function () { return $(this).attr('maxlength') ? $(this).attr('maxlength') : 19; })
        .addClass('d-ltr');

    $('input[d-val*="intRange"]')
        .keypress(function (event) {
            filterKeys(event, [44, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', function () { return $(this).attr('maxlength') ? $(this).attr('maxlength') : 80; })
        .addClass('d-ltr');
});
function isInvalid(formSelector) {
    if (!formSelector) formSelector = 'form';
    var result = $(formSelector).kendoValidator(validationConfig).data("kendoValidator").validate() === false;
    if (result) showAlert('تمامی اطلاعات مورد نیاز را بدرستی وارد نمایید.', null, 'هشدار');
    return result;
}
function filterKeys(event, validKeys) {
    var controlKeys = [8, 9, 13, 35, 36, 37, 39];
    var isControlKey = controlKeys.join(",").match(new RegExp(event.which));
    if (!event.which || ($.inArray(event.which, validKeys) != -1) || isControlKey) return;
    else event.preventDefault();
}


////// window
//Alert

function showAlert(template, callback, title, width) {
    var _alert = $('<div class="alert-content k-rtl"><div class="alert-message"></div><button class="window-ok k-button b2">ادامه</button></div>');
    _alert.find('div.alert-message').html(typeof (template) == 'string' ? template : $(template).html());
    var kendoWindow = _alert.kendoWindow({
        width: width ? width + 'px' : "300px",
        title: title ? title : 'پیام',
        resizable: false,
        modal: true
    });

    kendoWindow.data("kendoWindow")
        .center().open();

    kendoWindow
        .find(".window-ok")
            .click(function () {
                kendoWindow.data("kendoWindow").close();
                if (callback) callback();
            });
}

//Confirm
function showConfirm(template, callbackOk, callbackCancel, title, width) {
    var _alert = $('<div class="confirm-content k-rtl"><div class="confirm-message"></div><button class="k-button b3 confirm-yes main-command">بله</button><button class="k-button b1 confirm-no main-command">خير</button></div>');
    _alert.find('div.confirm-message').html(typeof (template) == 'string' ? template : $(template).html());
    var kendoWindow = _alert.kendoWindow({
        width: width ? width + 'px' : "300px",
        title: title ? title : 'تایید',
        resizable: false,
        modal: true
    });

    kendoWindow.data("kendoWindow")
          .center().open();

    kendoWindow
        .find(".confirm-yes,.confirm-no")
            .click(function () {
                kendoWindow.data("kendoWindow").close();
                if ($(this).hasClass("confirm-yes")) {
                    if (callbackOk) return callbackOk();
                }
                else {
                    if (callbackCancel) return callbackCancel();
                }
            })
}
function commaSeparatedNumber(x) {
    x = x.replace(/,/g, '');
    var parts = x.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function customValidation(option) {
    jQuery.extend(validationConfig.rules, option.rules)
    jQuery.extend(validationConfig.messages, option.messages)
}

function isValidNationalCode(meli_code) {
    if (!meli_code || !meli_code.length) return true;   
    if (meli_code != "1111111111" &&
        meli_code != "0000000000" &&
        meli_code != "2222222222" &&
        meli_code != "3333333333" &&
        meli_code != "4444444444" &&
        meli_code != "5555555555" &&
        meli_code != "6666666666" &&
        meli_code != "7777777777" &&
        meli_code != "8888888888" &&
        meli_code != "9999999999"
    ) {

        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 +
            parseInt(meli_code.charAt(1)) * 9 +
            parseInt(meli_code.charAt(2)) * 8 +
            parseInt(meli_code.charAt(3)) * 7 +
            parseInt(meli_code.charAt(4)) * 6 +
            parseInt(meli_code.charAt(5)) * 5 +
            parseInt(meli_code.charAt(6)) * 4 +
            parseInt(meli_code.charAt(7)) * 3 +
            parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
            return true;
        }
    }
    return false;
}
