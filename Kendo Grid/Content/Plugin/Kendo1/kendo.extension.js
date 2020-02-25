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
            if (input.is(["d-val*=tel"]))
                return isMatch(input, input.val().match(/^$|^[0-9-]{5,49}$/));
            return true;
        },
        nationalCode: function (input) {
            if (input.is("[d-val*=nationalCode]"))
                return isMatch(input, input.val().match(/^$|^\d{10}$/));
            return true;
        },
        nationalId: function (input) {
            if (input.is("[d-val*=nationalId]"))
                return isMatch(input, input.val().match(/^$|^\d{11}$/));
            return true;
        },
        email: function (input) {
            if (input.is("[d-val*=email]"))
                return isMatch(input, input.val().match(/^$|^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
            return true;
        },
        date: function (input) {
            if (input.is("[d-val*=date]"))
                return isMatch(input, input.val().match(/^$|^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/));
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
                return isMatch(input, input.val().match(/^([a-zA-Z0-9 پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/));
            return true;
        },
        comboRequired: function (input) {
            if (input.is("[d-val*=comboRequired]"))
                return isMatch(input, input.val());
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
        email: function (input) {
            setMessage(input, " نشانی الکترونیکی معتبر وارد کنید");
        },
        date: function (input) {
            setMessage(input, " فرمت تاریخ نادرست است مثال 1390/02/13");
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
        comboRequired: function (input) {
            setMessage(input, "هیچ گزینه انتخاب نشده است");
        },
        required: function (input) {
            setMessage(input, "الزامی");
        }
    }
}
function isMatch(input, value) {
    if (value) {
        input.parents('div[d-field]').removeClass('validation-error');
        $('span.validation-msg').hide();
    }
    else {
        input.parents('div[d-field]').addClass('validation-error');
    }
    if (typeof (value) === 'boolean') return value;
    return value && value.length;
}
function setMessage(input, msg) {
    if (input.is('select'))
        input.parent('span[role="listbox"]').attr('d-msg', msg);
    else
        input.attr('d-msg', msg);
}

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
                $(this).addClass('k-block').prepend('<h4 class="k-state-hover">' + txt + '</h4>');
        });
}
$(function () {
    //Layouting
    recalcLayout();

    //validation
    $('.validation-error .k-invalid, .validation-error span.k-widget.k-dropdown').live('mouseover', function (e) {
        if ($(this).is('span') && !$(this).children('select.k-invalid').length) return;
        var message = $('span.validation-msg');
        message.text($(this).attr('d-msg'));
        var position = $(this).offset();
        message.css({ top: position.top - 35, left: position.left + 2 });
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

    $('input[d-val*="nationalCode"], input[d-val*="zipCode"], input[d-val*="nationalId"]')
        .keypress(function (event) {
            filterKeys(event, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        })
        .attr('maxlength', 10)
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

    $('input[d-val*="decimal"]')
        .keypress(function (event) {
            filterKeys(event, [45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
        }) 
        .attr('maxlength', function () { return $(this).attr('maxlength') ? $(this).attr('maxlength') : 19; })
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
    var _alert = $('<div class="alert-content k-rtl"><div class="alert-message"></div><button class="window-ok k-button">ادامه</button></div>');
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
    var _alert = $('<div class="confirm-content k-rtl"><div class="confirm-message"></div><button class="k-button confirm-yes main-command">بله</button><button class="k-button confirm-no main-command">خير</button></div>');
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