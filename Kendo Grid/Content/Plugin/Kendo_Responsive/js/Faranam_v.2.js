function showLoading() {
    $("body").append("<div id='removeFaranam' style='width:100%;height:100%;position:fixed;background-color:rgba(0,0,0,0.7);top:0'><div style='position: absolute;top: 0;right: 0;left: 0;bottom: 0;margin: auto;height: 90px;width: 123px;'><img style='text-align:center;margin: 0 auto;position: absolute;top: 0;right: 0;left: 0;' src='http://isss.behdasht.gov.ir/Resource/Plugin/Image/loading-image.gif'><br><span style='top: 65px;position: absolute;right: 0;left: 0;color: rgba(212, 212, 212, 1)'>لطفا کمی صبر کنید</span></div></div>");
};
function hideLoading() {
    $("#removeFaranam").remove();
}
$(function () {
	var pwtOptions = {
        format: "YYYY/MM/DD",
        formatter: function (unix) {
            var pdate = new persianDate(unix);
            pdate.formatPersian = false;
            return pdate.format("YYYY/MM/DD");
        },
        daysTitleFormat: "YYYY MMMM",
        observer: true,
        sendOption: "p",
        autoclose: true,
        toolbox: true,
        name:'',
        altField: "#alternateField",
        altFormat: "u",
        altFieldFormatter: function (unix) {
            var pdate = new persianDate(unix);
            pdate.formatPersian
            pdate.formatPersian = false;
            return pdate.format("YYYY MM DD");
        },
        onSelect: function (unix) {
            debugger;
            viewModel[$(this)[0].name] = $(this)[0].inputVal;
            $('.date').persianDatepicker("hide");
        }
    };
	
	
    $('.date').each(function () {
        debugger;
        pwtOptions.name = $(this).context.name;
        if ($(this).val()){
            $(this).persianDatepicker(pwtOptions);
        } else {
            $(this).persianDatepicker(pwtOptions).val('');
		}
    });
	var today = $('meta[name=today]').attr('content');
    $('.date').each(function () {
		$(this).attr('pDateEnChar', today);
    });

	
    $(".be-number").keydown(function (e) {
        debugger;
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});