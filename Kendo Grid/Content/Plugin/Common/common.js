$.ajaxPrefilter(function (options) {
    //options.data = options.data ? options.data.replace(/ي/g, "ی").replace(/ك/g, "ک") : options.data;
    options.data = options.data ? options.data.replace(/%D9%8A/g, "%DB%8C").replace(/%D9%83/g, "%DA%A9") : options.data;
});

function blockUI(flag, selector) {
    selector = selector ? selector : 'body';
    kendo.ui.progress($(selector), flag);
}

function hideMessage() {
    var msgBar = $('div.notification-bar');
    msgBar.remove();
}

function showMessage(message, type, duration) {
    var msgBar = $('div.notification-bar');
    msgBar.remove();
    msgBar = $('<div class="notification-bar k-state-selected k-rtl"/>');
    type = (typeof type == 'string')
        ? type
        : (typeof type == 'number')
            ? (type == 0)
                ? 'success'
                : (type == 1)
                    ? 'warning'
                    : (type == 2)
                        ? 'error'
                        : 'info'
            : 'info';
    msgBar
        .appendTo('body')
        .click(function () { $(this).remove() })
        .html(message)
        .removeClass('success info warning error')
        .addClass(type)
        .fadeIn(100);
    setTimeout(function () { msgBar.remove(); }, duration ? duration : 10000);
    return msgBar;
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

function getBasicDataId(obj) {
    var id = parseInt(obj);
    if (typeof (id) == 'number') return id;
    return obj.Id;
}

function getMiladiDateString(selector) {
    return $(selector).data().kendoDatePicker.value().toDateString();
}

function getComboValue(data, property){
    return data 
        ? typeof (data) == 'object'
            ? data[property]
            : data
        : null;
}
