var spinnerVisible = false;
function showProgress() {
    if (!spinnerVisible) {
        $("div#spinner").fadeIn("fast");
        spinnerVisible = true;
    }
};
function hideProgress() {
    if (spinnerVisible) {
        var spinner = $("div#spinner");
        spinner.stop();
        spinner.fadeOut("fast");
        spinnerVisible = false;
    }
};

var utils = {
    validation: {
        atLeastOfItemFilled: function () {
            if (arguments.length == 0) {
                return true;
            }
            for (var item, i = 0; i < arguments.length; i++) {
                item = arguments[i];
                if (typeof item == 'string' && item) {
                    return true;
                }
                item = $(item);
                if (item.is(':text,select,textarea') && item.val()) {
                    return true;
                }
                if (item.is(':radio:checked,:checkbox:checked')) {
                    return true;
                }
            }
            return false;
        }
    },

    manageNoItemSelected: function (vm, raisedByChange) {
        if (!raisedByChange) {
            $(':checkbox:not(#noItemSelected)').change(function (e) {
                utils.manageNoItemSelected(vm, true);
            });
        }
        if ($(':checkbox:checked:not(#noItemSelected)').length == 0) {
            $('#noItemSelected').removeAttr('disabled');
        } else {
            vm.set('noItemSelected', false);
            $('#noItemSelected').attr('disabled', 'disabled');
        }
    }
};