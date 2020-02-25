$(function () {
    $("ul._lo > *").wrap(function () {
        var layout = $(this).attr('_lo');
        var s = '';
        if (layout) {
            var ar = layout.split(',');
            s = 'style=" ';
            $.each(ar, function (i, v) {
                v = $.trim(v);
                if (v.length > 0) {
                    switch (i) {
                        case 0: s += 'width:' + v + ';'; break;
                        case 1: s += 'height:' + v + ';'; break;
                        case 2: s += 'margin:' + v + ';'; break;
                        case 3: s += 'padding:' + v + ';'; break;
                        case 4: s += 'border:' + v + ';'; break;
                        case 5: s += 'overflow:' + v + ';'; break;
                    }
                }
            });
            s += '"';
        }
        s = '<li class="_lo" ' + s + '/>';
        $(this).removeAttr('_lo');
        return s;
    });

    $("ul._lo").append('<li class="_lo_end"/>');
});
