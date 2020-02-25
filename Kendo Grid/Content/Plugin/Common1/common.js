$.ajaxPrefilter(function (options) {
    options.data = options.data ? options.data.replace(/ي/g, "ی").replace(/ك/g, "ک") : options.data;
});

function blockUI(flag, selector) {
    selector = selector ? selector : 'body';
    kendo.ui.progress($(selector), flag);
}

function showMessage(message, type, duration) {
    var msgBar = $('div.notification-bar');
    msgBar.remove();
    msgBar = $('<div class="notification-bar k-state-selected k-rtl"/>');
    msgBar
        .appendTo('body')
        .click(function () { $(this).remove() })
        .html(message)
        .removeClass('success info warning error')
        .addClass(type)
        .fadeIn(100);
    setTimeout(function () { msgBar.remove(); }, duration ? duration : 10000);
}

function WidthBasedOnPageWidth(percent) {
    var pagewidth = GetViewPointWidth();
    var mywidth = (pagewidth * percent) / 100;
    return mywidth;
}

function HeightBasedOnPageHeight(percent) {
    var screenHeight = GetViewPointHeight();
    var myHeight = (screenHeight * percent) / 100;
    return myHeight;
}

function GetViewPointWidth() {
    var viewportwidth;
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth
    }
    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth
    }
    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth
    }
    return viewportwidth;
}

function GetViewPointHeight() {
    var viewportheight;
    if (typeof window.innerWidth != 'undefined') {
        viewportheight = window.innerHeight
    }
    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportheight = document.documentElement.clientHeight
    }
    else {
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
    return viewportheight;
}

function persianizeDigits(input) {
    if (typeof input != "string") {
        input = input.toString();
    }
    var result = "";
    for (var i = 0; i < input.length; i++) {
        var uniCode = parseInt(input.charCodeAt(i));
        if (uniCode >= 48 && uniCode <= 57) {
            uniCode = uniCode + 1728
            str = String.fromCharCode(uniCode);
        }
        else {
            str = String.fromCharCode(uniCode);
        }
        result = result + str;
    }
    return result;
}

function guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
