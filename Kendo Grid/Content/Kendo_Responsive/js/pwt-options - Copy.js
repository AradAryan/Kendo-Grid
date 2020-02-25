    var options = {
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
