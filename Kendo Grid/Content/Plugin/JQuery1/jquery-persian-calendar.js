/*
* jQuery UI Datepicker 1.7.2 (with custom calendar support)
*
* Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* http://docs.jquery.com/UI/Datepicker
*
* Depends:
*	ui.core.js
*/

// Support for custom calendar added by Mahdi Hasheminezhad. email: hasheminezhad at gmail dot com (http://hasheminezhad.com)
// 

(function ($) { // hide the namespace

    $.extend($.ui, { datepicker: { version: "1.7.2"} });

    var PROP_NAME = 'datepicker';

    /* Date picker manager.
    Use the singleton instance of this class, $.datepicker, to interact with the date picker.
    Settings for (groups of) date pickers are maintained in an instance object,
    allowing multiple different settings on the same page. */

    function Datepicker() {
        this.debug = false; // Change this to true to start debugging
        this._curInst = null; // The current instance in use
        this._keyEvent = false; // If the last event was a key event
        this._disabledInputs = []; // List of date picker inputs that have been disabled
        this._datepickerShowing = false; // True if the popup picker is showing , false if not
        this._inDialog = false; // True if showing within a "dialog", false if not
        this._mainDivId = 'k-datepicker-div'; // The ID of the main datepicker division
        this._inlineClass = 'k-datepicker-inline'; // The name of the inline marker class
        this._appendClass = 'k-datepicker-append'; // The name of the append marker class
        this._triggerClass = 'k-datepicker-trigger'; // The name of the trigger marker class
        this._dialogClass = 'k-datepicker-dialog'; // The name of the dialog marker class
        this._disableClass = 'k-datepicker-disabled'; // The name of the disabled covering marker class
        this._unselectableClass = 'k-datepicker-unselectable'; // The name of the unselectable cell marker class
        this._currentClass = 'k-datepicker-current-day'; // The name of the current day marker class
        this._dayOverClass = 'k-datepicker-days-cell-over'; // The name of the day hover marker class
        this.regional = []; // Available regional settings, indexed by language code
        this.regional[''] = { // Default regional settings
            calendar: Date,
            closeText: 'Done', // Display text for close link
            prevText: 'Prev', // Display text for previous month link
            nextText: 'Next', // Display text for next month link
            currentText: 'Today', // Display text for current month link
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'], // Names of months for drop-down and formatting
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
            dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], // Column headings for days starting at Sunday
            dateFormat: 'mm/dd/yy', // See format options on parseDate
            firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
            isRTL: false // True if right-to-left language, false if left-to-right
        };
        this._defaults = { // Global defaults for all the date picker instances
            showOn: 'focus', // 'focus' for popup on focus,
            // 'button' for trigger button, or 'both' for either
            showAnim: 'slideDown', // Name of jQuery animation for popup
            showOptions: {}, // Options for enhanced animations
            defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
            appendText: '', // Display text following the input box, e.g. showing the format
            buttonText: '...', // Text for trigger button
            buttonImage: '', // URL for trigger button image
            buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
            hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
            navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
            gotoCurrent: false, // True if today link goes back to current selection instead
            changeMonth: false, // True if month can be selected directly, false if only prev/next
            changeYear: false, // True if year can be selected directly, false if only prev/next
            showMonthAfterYear: false, // True if the year select precedes month, false for month then year
            yearRange: '-100:+100', // Range of years to display in drop-down,
            // either relative to current year (-nn:+nn) or absolute (nnnn:nnnn)
            showOtherMonths: false, // True to show dates in other months, false to leave blank
            calculateWeek: this.iso8601Week, // How to calculate the week of the year,
            // takes a Date and returns the number of the week for it
            shortYearCutoff: '+10', // Short year values < this are in the current century,
            // > this are in the previous century,
            // string value starting with '+' for current year + value
            minDate: null, // The earliest selectable date, or null for no limit
            maxDate: null, // The latest selectable date, or null for no limit
            duration: 'fast', // Duration of display/closure
            beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
            beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
            onSelect: null, // Define a callback function when a date is selected
            onChangeMonthYear: null, // Define a callback function when the month or year is changed
            onClose: null, // Define a callback function when the datepicker is closed
            numberOfMonths: 1, // Number of months to show at a time
            showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
            stepMonths: 1, // Number of months to step back/forward
            stepBigMonths: 12, // Number of months to step back/forward for the big links
            altField: '', // Selector for an alternate field to store selected dates into
            altFormat: '', // The date format to use for the alternate field
            constrainInput: true, // The input is constrained by the current date format
            showButtonPanel: false // True to show button panel, false to not show it
        };
        $.extend(this._defaults, this.regional['']);
        this.dpDiv = $('<div id="' + this._mainDivId + '" style="display:none;z-index:10003" class="k-datepicker k-block k-rtl  "></div>');
        this.Date = this._defaults.calendar;
    }

    $.extend(Datepicker.prototype, {
        /* Class name added to elements to indicate already configured with a date picker. */
        markerClassName: 'hasDatepicker',

        /* Debug logging (if enabled). */
        log: function () {
            if (this.debug)
                console.log.apply('', arguments);
        },

        /* Override the default settings for all instances of the date picker.
        @param  settings  object - the new settings to use as defaults (anonymous object)
        @return the manager object */
        setDefaults: function (settings) {
            extendRemove(this._defaults, settings || {});
            this.Date = this._defaults.calendar;
            return this;
        },

        /* Attach the date picker to a jQuery selection.
        @param  target    element - the target input field or division or span
        @param  settings  object - the new settings to use for this date picker instance (anonymous) */
        _attachDatepicker: function (target, settings) {
            // check for settings on the control itself - in namespace 'date:'
            var inlineSettings = null;
            for (var attrName in this._defaults) {
                var attrValue = target.getAttribute('date:' + attrName);
                if (attrValue) {
                    inlineSettings = inlineSettings || {};
                    try {
                        inlineSettings[attrName] = eval(attrValue);
                    } catch (err) {
                        inlineSettings[attrName] = attrValue;
                    }
                }
            }
            var nodeName = target.nodeName.toLowerCase();
            var inline = (nodeName == 'div' || nodeName == 'span');
            if (!target.id)
                target.id = 'dp' + (++this.uuid);
            var inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {}, inlineSettings || {});
            if (nodeName == 'input') {
                this._connectDatepicker(target, inst);
            } else if (inline) {
                this._inlineDatepicker(target, inst);
            }
        },

        /* Create a new instance object. */
        _newInst: function (target, inline) {
            var id = target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
            return { id: id, input: target, // associated target
                selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
                drawMonth: 0, drawYear: 0, // month being drawn
                inline: inline, // is datepicker inline or not
                dpDiv: (!inline ? this.dpDiv : // presentation div
			$('<div class="' + this._inlineClass + ' k-datepicker k-block k-rtl"></div>'))
            };
        },

        /* Attach the date picker to an input field. */
        _connectDatepicker: function (target, inst) {
            var input = $(target);
            inst.append = $([]);
            inst.trigger = $([]);
            if (input.hasClass(this.markerClassName))
                return;
            var appendText = this._get(inst, 'appendText');
            var isRTL = false; //this._get(inst, 'isRTL');
            if (appendText) {
                inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
                input[isRTL ? 'before' : 'after'](inst.append);
            }
            var showOn = this._get(inst, 'showOn');
            if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
                input.focus(this._showDatepicker);
            if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
                var buttonText = this._get(inst, 'buttonText');
                var buttonImage = this._get(inst, 'buttonImage');
                inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src: buttonImage, alt: buttonText, title: buttonText })));
                input[isRTL ? 'before' : 'after'](inst.trigger);
                inst.trigger.click(function () {
                    if ($.datepicker._datepickerShowing && $.datepicker._lastInput == target)
                        $.datepicker._hideDatepicker();
                    else
                        $.datepicker._showDatepicker(target);
                    return false;
                });
            }
            input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).
			bind("setData.datepicker", function (event, key, value) {
			    inst.settings[key] = value;
			}).bind("getData.datepicker", function (event, key) {
			    return this._get(inst, key);
			});
            $.data(target, PROP_NAME, inst);
        },

        /* Attach an inline date picker to a div. */
        _inlineDatepicker: function (target, inst) {
            var divSpan = $(target);
            if (divSpan.hasClass(this.markerClassName))
                return;
            divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function (event, key, value) {
			    inst.settings[key] = value;
			}).bind("getData.datepicker", function (event, key) {
			    return this._get(inst, key);
			});
            $.data(target, PROP_NAME, inst);
            this._setDate(inst, this._getDefaultDate(inst));
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
        },

        /* Pop-up the date picker in a "dialog" box.
        @param  input     element - ignored
        @param  dateText  string - the initial date to display (in the current format)
        @param  onSelect  function - the function(dateText) to call when a date is selected
        @param  settings  object - update the dialog date picker instance's settings (anonymous object)
        @param  pos       int[2] - coordinates for the dialog's position within the screen or
        event - with x/y coordinates or
        leave empty for default (screen centre)
        @return the manager object */
        _dialogDatepicker: function (input, dateText, onSelect, settings, pos) {
            var inst = this._dialogInst; // internal instance
            if (!inst) {
                var id = 'dp' + (++this.uuid);
                this._dialogInput = $('<input type="text" id="' + id +
				'" size="1" style="position: absolute; top: -100px;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                $('body').append(this._dialogInput);
                inst = this._dialogInst = this._newInst(this._dialogInput, false);
                inst.settings = {};
                $.data(this._dialogInput[0], PROP_NAME, inst);
            }
            extendRemove(inst.settings, settings || {});
            this._dialogInput.val(dateText);

            this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
            if (!this._pos) {
                var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
            }

            // move input on screen for focus, but hidden behind dialog
            this._dialogInput.css('left', this._pos[0] + 'px').css('top', this._pos[1] + 'px');
            inst.settings.onSelect = onSelect;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            if ($.blockUI)
                $.blockUI(this.dpDiv);
            $.data(this._dialogInput[0], PROP_NAME, inst);
            return this;
        },

        /* Detach a datepicker from its control.
        @param  target    element - the target input field or division or span */
        _destroyDatepicker: function (target) {
            var $target = $(target);
            var inst = $.data(target, PROP_NAME);
            if (!$target.hasClass(this.markerClassName)) {
                return;
            }
            var nodeName = target.nodeName.toLowerCase();
            $.removeData(target, PROP_NAME);
            if (nodeName == 'input') {
                inst.append.remove();
                inst.trigger.remove();
                $target.removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress);
            } else if (nodeName == 'div' || nodeName == 'span')
                $target.removeClass(this.markerClassName).empty();
        },

        /* Enable the date picker to a jQuery selection.
        @param  target    element - the target input field or division or span */
        _enableDatepicker: function (target) {
            var $target = $(target);
            var inst = $.data(target, PROP_NAME);
            if (!$target.hasClass(this.markerClassName)) {
                return;
            }
            var nodeName = target.nodeName.toLowerCase();
            if (nodeName == 'input') {
                target.disabled = false;
                inst.trigger.filter('button').
				each(function () { this.disabled = false; }).end().
				filter('img').css({ opacity: '1.0', cursor: '' });
            }
            else if (nodeName == 'div' || nodeName == 'span') {
                var inline = $target.children('.' + this._inlineClass);
                inline.children().removeClass('kd-state-disabled');
            }
            this._disabledInputs = $.map(this._disabledInputs,
			function (value) { return (value == target ? null : value); }); // delete entry
        },

        /* Disable the date picker to a jQuery selection.
        @param  target    element - the target input field or division or span */
        _disableDatepicker: function (target) {
            var $target = $(target);
            var inst = $.data(target, PROP_NAME);
            if (!$target.hasClass(this.markerClassName)) {
                return;
            }
            var nodeName = target.nodeName.toLowerCase();
            if (nodeName == 'input') {
                target.disabled = true;
                inst.trigger.filter('button').
				each(function () { this.disabled = true; }).end().
				filter('img').css({ opacity: '0.5', cursor: 'default' });
            }
            else if (nodeName == 'div' || nodeName == 'span') {
                var inline = $target.children('.' + this._inlineClass);
                inline.children().addClass('kd-state-disabled');
            }
            this._disabledInputs = $.map(this._disabledInputs,
			function (value) { return (value == target ? null : value); }); // delete entry
            this._disabledInputs[this._disabledInputs.length] = target;
        },

        /* Is the first field in a jQuery collection disabled as a datepicker?
        @param  target    element - the target input field or division or span
        @return boolean - true if disabled, false if enabled */
        _isDisabledDatepicker: function (target) {
            if (!target) {
                return false;
            }
            for (var i = 0; i < this._disabledInputs.length; i++) {
                if (this._disabledInputs[i] == target)
                    return true;
            }
            return false;
        },

        /* Retrieve the instance data for the target control.
        @param  target  element - the target input field or division or span
        @return  object - the associated instance data
        @throws  error if a jQuery problem getting data */
        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            }
            catch (err) {
                throw 'Missing instance data for this datepicker';
            }
        },

        /* Update or retrieve the settings for a date picker attached to an input field or division.
        @param  target  element - the target input field or division or span
        @param  name    object - the new settings to update or
        string - the name of the setting to change or retrieve,
        when retrieving also 'all' for all instance settings or
        'defaults' for all global defaults
        @param  value   any - the new value for the setting
        (omit if above is an object or to retrieve a value) */
        _optionDatepicker: function (target, name, value) {
            var inst = this._getInst(target);
            if (arguments.length == 2 && typeof name == 'string') {
                return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
            }
            var settings = name || {};
            if (typeof name == 'string') {
                settings = {};
                settings[name] = value;
            }
            if (inst) {
                if (this._curInst == inst) {
                    this._hideDatepicker(null);
                }
                var date = this._getDateDatepicker(target);
                extendRemove(inst.settings, settings);
                this._setDateDatepicker(target, date);
                this._updateDatepicker(inst);
            }
        },

        // change method deprecated
        _changeDatepicker: function (target, name, value) {
            this._optionDatepicker(target, name, value);
        },

        /* Redraw the date picker attached to an input field or division.
        @param  target  element - the target input field or division or span */
        _refreshDatepicker: function (target) {
            var inst = this._getInst(target);
            if (inst) {
                this._updateDatepicker(inst);
            }
        },

        /* Set the dates for a jQuery selection.
        @param  target   element - the target input field or division or span
        @param  date     Date - the new date
        @param  endDate  Date - the new end date for a range (optional) */
        _setDateDatepicker: function (target, date, endDate) {
            var inst = this._getInst(target);
            if (inst) {
                this._setDate(inst, date, endDate);
                this._updateDatepicker(inst);
                this._updateAlternate(inst);
            }
        },

        /* Get the date(s) for the first entry in a jQuery selection.
        @param  target  element - the target input field or division or span
        @return Date - the current date or
        Date[2] - the current dates for a range */
        _getDateDatepicker: function (target) {
            var inst = this._getInst(target);
            if (inst && !inst.inline)
                this._setDateFromField(inst);
            return (inst ? this._getDate(inst) : null);
        },

        /* Handle keystrokes. */
        _doKeyDown: function (event) {
            var inst = $.datepicker._getInst(event.target);
            var handled = true;
            var isRTL = inst.dpDiv.is('.k-rtl');
            inst._keyEvent = true;
            if ($.datepicker._datepickerShowing)
                switch (event.keyCode) {
                case 9: $.datepicker._hideDatepicker(null, '');
                    break; // hide on tab out
                case 13: var sel = $('td.' + $.datepicker._dayOverClass +
							', td.' + $.datepicker._currentClass, inst.dpDiv);
                    if (sel[0])
                        $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                    else
                        $.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
                    return false; // don't submit the form
                    break; // select the value on enter
                case 27: $.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
                    break; // hide on escape
                case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
                    break; // previous month/year on page up/+ ctrl
                case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
                    break; // next month/year on page down/+ ctrl
                case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
                    handled = event.ctrlKey || event.metaKey;
                    break; // clear on ctrl or command +end
                case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
                    handled = event.ctrlKey || event.metaKey;
                    break; // current on ctrl or command +home
                case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
                    handled = event.ctrlKey || event.metaKey;
                    // -1 day on ctrl or command +left
                    if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
                    // next month/year on alt +left on Mac
                    break;
                case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
                    handled = event.ctrlKey || event.metaKey;
                    break; // -1 week on ctrl or command +up
                case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
                    handled = event.ctrlKey || event.metaKey;
                    // +1 day on ctrl or command +right
                    if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
                    // next month/year on alt +right
                    break;
                case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
                    handled = event.ctrlKey || event.metaKey;
                    break; // +1 week on ctrl or command +down
                default: handled = false;
            }
            else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
                $.datepicker._showDatepicker(this);
            else {
                handled = false;
            }
            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        /* Filter entered characters - based on date format. */
        _doKeyPress: function (event) {
            var inst = $.datepicker._getInst(event.target);
            if ($.datepicker._get(inst, 'constrainInput')) {
                var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
                var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
                return event.ctrlKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
            }
        },

        /* Pop-up the date picker for a given input field.
        @param  input  element - the input field attached to the date picker or
        event - if triggered by focus */
        _showDatepicker: function (input) {
            input = input.target || input;
            if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
                input = $('input', input.parentNode)[0];
            if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
                return;
            var inst = $.datepicker._getInst(input);
            var beforeShow = $.datepicker._get(inst, 'beforeShow');
            extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
            $.datepicker._hideDatepicker(null, '');
            $.datepicker._lastInput = input;
            $.datepicker._setDateFromField(inst);
            if ($.datepicker._inDialog) // hide cursor
                input.value = '';
            if (!$.datepicker._pos) { // position below input
                $.datepicker._pos = $.datepicker._findPos(input);
                $.datepicker._pos[1] += input.offsetHeight; // add the height
            }
            var isFixed = false;
            $(input).parents().each(function () {
                isFixed |= $(this).css('position') == 'fixed';
                return !isFixed;
            });
            if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
                $.datepicker._pos[0] -= document.documentElement.scrollLeft;
                $.datepicker._pos[1] -= document.documentElement.scrollTop;
            }
            var offset = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] };
            $.datepicker._pos = null;
            inst.rangeStart = null;
            // determine sizing offscreen
            inst.dpDiv.css({ position: 'absolute', display: 'block', top: '-1000px' });
            $.datepicker._updateDatepicker(inst);
            // fix width for dynamic number of date pickers
            // and adjust position before showing
            offset = $.datepicker._checkOffset(inst, offset, isFixed);
            inst.dpDiv.css({ position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
                left: offset.left + 'px', top: offset.top + 'px'
            });
            if (!inst.inline) {
                var showAnim = $.datepicker._get(inst, 'showAnim') || 'show';
                var duration = $.datepicker._get(inst, 'duration');
                var postProcess = function () {
                    $.datepicker._datepickerShowing = true;
                    if ($.browser.msie && parseInt($.browser.version, 10) < 7) // fix IE < 7 select problems
                        $('iframe.k-datepicker-cover').css({ width: inst.dpDiv.width() + 4,
                            height: inst.dpDiv.height() + 4
                        });
                };
                if ($.effects && $.effects[showAnim])
                    inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
                else
                    inst.dpDiv[showAnim](duration, postProcess);
                if (duration == '')
                    postProcess();
                if (inst.input[0].type != 'hidden')
                    inst.input[0].focus();
                $.datepicker._curInst = inst;
            }
        },

        /* Generate the date picker content. */
        _updateDatepicker: function (inst) {
            var dims = { width: inst.dpDiv.width() + 4,
                height: inst.dpDiv.height() + 4
            };
            var self = this;
            inst.dpDiv.empty().append(this._generateHTML(inst))
			.find('iframe.k-datepicker-cover').
				css({ width: dims.width, height: dims.height })
			.end()
			.find('button, .k-datepicker-prev, .k-datepicker-next, .k-datepicker-calendar td a')
				.bind('mouseout', function () {
				    $(this).removeClass('k-state-hover');
				    if (this.className.indexOf('k-datepicker-prev') != -1) $(this).removeClass('k-datepicker-prev-hover');
				    if (this.className.indexOf('k-datepicker-next') != -1) $(this).removeClass('k-datepicker-next-hover');
				})
				.bind('mouseover', function () {
				    if (!self._isDisabledDatepicker(inst.inline ? inst.dpDiv.parent()[0] : inst.input[0])) {
				        $(this).parents('.k-datepicker-calendar').find('a').removeClass('k-state-hover');
				        $(this).addClass('k-state-hover');
				        if (this.className.indexOf('k-datepicker-prev') != -1) $(this).addClass('k-datepicker-prev-hover');
				        if (this.className.indexOf('k-datepicker-next') != -1) $(this).addClass('k-datepicker-next-hover');
				    }
				})
			.end()
			.find('.' + this._dayOverClass + ' a')
				.trigger('mouseover')
			.end();
            var numMonths = this._getNumberOfMonths(inst);
            var cols = numMonths[1];
            var width = 17;
            if (cols > 1) {
                inst.dpDiv.addClass('k-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
            } else {
                inst.dpDiv.removeClass('k-datepicker-multi-2 k-datepicker-multi-3 k-datepicker-multi-4').width('');
            }
            inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('k-datepicker-multi');
            inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('k-rtl');
            if (inst.input && inst.input[0].type != 'hidden' && inst == $.datepicker._curInst)
                $(inst.input[0]).focus();
        },

        /* Check positioning to remain on screen. */
        _checkOffset: function (inst, offset, isFixed) {
            var dpWidth = inst.dpDiv.outerWidth();
            var dpHeight = inst.dpDiv.outerHeight();
            var inputWidth = inst.input ? inst.input.outerWidth() : 0;
            var inputHeight = inst.input ? inst.input.outerHeight() : 0;
            var viewWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + $(document).scrollLeft();
            var viewHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + $(document).scrollTop();

            offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
            offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
            offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

            // now check if datepicker is showing outside window viewport - move to a better place if so.
            offset.left -= (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ? Math.abs(offset.left + dpWidth - viewWidth) : 0;
            offset.top -= (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(offset.top + dpHeight + inputHeight * 2 - viewHeight) : 0;

            return offset;
        },

        /* Find an object's position on the screen. */
        _findPos: function (obj) {
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1)) {
                obj = obj.nextSibling;
            }
            var position = $(obj).offset();
            return [position.left, position.top];
        },

        /* Hide the date picker from view.
        @param  input  element - the input field attached to the date picker
        @param  duration  string - the duration over which to close the date picker */
        _hideDatepicker: function (input, duration) {
            var inst = this._curInst;
            if (!inst || (input && inst != $.data(input, PROP_NAME)))
                return;
            if (inst.stayOpen)
                this._selectDate('#' + inst.id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear));
            inst.stayOpen = false;
            if (this._datepickerShowing) {
                duration = (duration != null ? duration : this._get(inst, 'duration'));
                var showAnim = this._get(inst, 'showAnim');
                var postProcess = function () {
                    $.datepicker._tidyDialog(inst);
                };
                if (duration != '' && $.effects && $.effects[showAnim])
                    inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'),
					duration, postProcess);
                else
                    inst.dpDiv[(duration == '' ? 'hide' : (showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide')))](duration, postProcess);
                if (duration == '')
                    this._tidyDialog(inst);
                var onClose = this._get(inst, 'onClose');
                if (onClose)
                    onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);  // trigger custom callback
                this._datepickerShowing = false;
                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
                    if ($.blockUI) {
                        $.unblockUI();
                        $('body').append(this.dpDiv);
                    }
                }
                this._inDialog = false;
            }
            this._curInst = null;
        },

        /* Tidy up after a dialog display. */
        _tidyDialog: function (inst) {
            inst.dpDiv.removeClass(this._dialogClass).unbind('.k-datepicker-calendar');
        },

        /* Close date picker if clicked elsewhere. */
        _checkExternalClick: function (event) {
            if (!$.datepicker._curInst)
                return;
            var $target = $(event.target);
            if (($target.parents('#' + $.datepicker._mainDivId).length == 0) &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.hasClass($.datepicker._triggerClass) &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))
                $.datepicker._hideDatepicker(null, '');
        },

        /* Adjust one of the date sub-fields. */
        _adjustDate: function (id, offset, period) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (this._isDisabledDatepicker(target[0])) {
                return;
            }
            this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
            this._updateDatepicker(inst);
        },

        /* Action for current link. */
        _gotoToday: function (id) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
                inst.selectedDay = inst.currentDay;
                inst.drawMonth = inst.selectedMonth = inst.currentMonth;
                inst.drawYear = inst.selectedYear = inst.currentYear;
            }
            else {
                var date = new this.Date();
                inst.selectedDay = date.getDate();
                inst.drawMonth = inst.selectedMonth = date.getMonth();
                inst.drawYear = inst.selectedYear = date.getFullYear();
            }
            this._notifyChange(inst);
            this._adjustDate(target);
        },

        /* Action for selecting a new month/year. */
        _selectMonthYear: function (id, select, period) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            inst._selectingMonthYear = false;
            inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value, 10);
            this._notifyChange(inst);
            this._adjustDate(target);
        },

        /* Restore input focus after not changing month/year. */
        _clickMonthYear: function (id) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (inst.input && inst._selectingMonthYear && !$.browser.msie)
                inst.input[0].focus();
            inst._selectingMonthYear = !inst._selectingMonthYear;
        },

        /* Action for selecting a day. */
        _selectDay: function (id, month, year, td) {
            var target = $(id);
            if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
                return;
            }
            var inst = this._getInst(target[0]);
            inst.selectedDay = inst.currentDay = $('a', td).html();
            inst.selectedMonth = inst.currentMonth = month;
            inst.selectedYear = inst.currentYear = year;
            if (inst.stayOpen) {
                inst.endDay = inst.endMonth = inst.endYear = null;
            }
            this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
            if (inst.stayOpen) {
                inst.rangeStart = this._daylightSavingAdjust(
				new this.Date(inst.currentYear, inst.currentMonth, inst.currentDay));
                this._updateDatepicker(inst);
            }
        },

        /* Erase the input field and hide the date picker. */
        _clearDate: function (id) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            inst.stayOpen = false;
            inst.endDay = inst.endMonth = inst.endYear = inst.rangeStart = null;
            this._selectDate(target, '');
        },

        /* Update the input field with the selected date. */
        _selectDate: function (id, dateStr) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
            if (inst.input)
                inst.input.val(dateStr);
            this._updateAlternate(inst);
            var onSelect = this._get(inst, 'onSelect');
            if (onSelect)
                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
            else if (inst.input)
                inst.input.trigger('change'); // fire the change event
            if (inst.inline)
                this._updateDatepicker(inst);
            else if (!inst.stayOpen) {
                this._hideDatepicker(null, this._get(inst, 'duration'));
                this._lastInput = inst.input[0];
                if (typeof (inst.input[0]) != 'object')
                    inst.input[0].focus(); // restore focus
                this._lastInput = null;
            }
        },

        /* Update any alternate field to synchronise with the main field. */
        _updateAlternate: function (inst) {
            var altField = this._get(inst, 'altField');
            if (altField) { // update alternate field too
                var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
                var date = this._getDate(inst);
                dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
                $(altField).each(function () { $(this).val(dateStr); });
            }
        },

        /* Set as beforeShowDay function to prevent selection of weekends.
        @param  date  Date - the date to customise
        @return [boolean, string] - is this date selectable?, what is its CSS class? */
        noWeekends: function (date) {
            var day = date.getDay();
            return [(day > 0 && day < 6), ''];
        },

        /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
        @param  date  Date - the date to get the week for
        @return  number - the number of the week within the year that contains this date */
        iso8601Week: function (date) {
            var checkDate = new this.Date(date.getFullYear(), date.getMonth(), date.getDate());
            var firstMon = new this.Date(checkDate.getFullYear(), 1 - 1, 4); // First week always contains 4 Jan
            var firstDay = firstMon.getDay() || 7; // Day of week: Mon = 1, ..., Sun = 7
            firstMon.setDate(firstMon.getDate() + 1 - firstDay); // Preceding Monday
            if (firstDay < 4 && checkDate < firstMon) { // Adjust first three days in year if necessary
                checkDate.setDate(checkDate.getDate() - 3); // Generate for previous year
                return $.datepicker.iso8601Week(checkDate);
            } else if (checkDate > new this.Date(checkDate.getFullYear(), 12 - 1, 28)) { // Check last three days in year
                firstDay = new this.Date(checkDate.getFullYear() + 1, 1 - 1, 4).getDay() || 7;
                if (firstDay > 4 && (checkDate.getDay() || 7) < firstDay - 3) { // Adjust if necessary
                    return 1;
                }
            }
            return Math.floor(((checkDate - firstMon) / 86400000) / 7) + 1; // Weeks to given date
        },

        /* Parse a string value into a date object.
        See formatDate below for the possible formats.

        @param  format    string - the expected format of the date
        @param  value     string - the date in the above format
        @param  settings  Object - attributes include:
        shortYearCutoff  number - the cutoff year for determining the century (optional)
        dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
        dayNames         string[7] - names of the days from Sunday (optional)
        monthNamesShort  string[12] - abbreviated names of the months (optional)
        monthNames       string[12] - names of the months (optional)
        @return  Date - the extracted date value or null if value is blank */
        parseDate: function (format, value, settings) {
            if (format == null || value == null)
                throw 'Invalid arguments';
            value = (typeof value == 'object' ? value.toString() : value + '');
            if (value == '')
                return null;
            var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
            var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
            var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
            var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
            var year = -1;
            var month = -1;
            var day = -1;
            var doy = -1;
            var literal = false;
            // Check whether a format character is doubled
            var lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches)
                    iFormat++;
                return matches;
            };
            // Extract a number from the string value
            var getNumber = function (match) {
                lookAhead(match);
                var origSize = (match == '@' ? 14 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)));
                var size = origSize;
                var num = 0;
                while (size > 0 && iValue < value.length &&
					value.charAt(iValue) >= '0' && value.charAt(iValue) <= '9') {
                    num = num * 10 + parseInt(value.charAt(iValue++), 10);
                    size--;
                }
                if (size == origSize)
                    throw 'Missing number at position ' + iValue;
                return num;
            };
            // Extract a name from the string value and convert to an index
            var getName = function (match, shortNames, longNames) {
                var names = (lookAhead(match) ? longNames : shortNames);
                var size = 0;
                for (var j = 0; j < names.length; j++)
                    size = Math.max(size, names[j].length);
                var name = '';
                var iInit = iValue;
                while (size > 0 && iValue < value.length) {
                    name += value.charAt(iValue++);
                    for (var i = 0; i < names.length; i++)
                        if (name == names[i])
                            return i + 1;
                    size--;
                }
                throw 'Unknown name at position ' + iInit;
            };
            // Confirm that a literal character matches the string value
            var checkLiteral = function () {
                if (value.charAt(iValue) != format.charAt(iFormat))
                    throw 'Unexpected literal at position ' + iValue;
                iValue++;
            };
            var iValue = 0;
            for (var iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal)
                    if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                        literal = false;
                    else
                        checkLiteral();
                else
                    switch (format.charAt(iFormat)) {
                    case 'd':
                        day = getNumber('d');
                        break;
                    case 'D':
                        getName('D', dayNamesShort, dayNames);
                        break;
                    case 'o':
                        doy = getNumber('o');
                        break;
                    case 'm':
                        month = getNumber('m');
                        break;
                    case 'M':
                        month = getName('M', monthNamesShort, monthNames);
                        break;
                    case 'y':
                        year = getNumber('y');
                        break;
                    case '@':
                        var date = new this.Date(getNumber('@'));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'"))
                            checkLiteral();
                        else
                            literal = true;
                        break;
                    default:
                        checkLiteral();
                }
            }
            if (year == -1)
                year = new this.Date().getFullYear();
            else if (year < 100)
                year += new this.Date().getFullYear() - new this.Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    var dim = this._getDaysInMonth(year, month - 1);
                    if (day <= dim)
                        break;
                    month++;
                    day -= dim;
                } while (true);
            }
            var date = this._daylightSavingAdjust(new this.Date(year, month - 1, day));
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
                throw 'Invalid date'; // E.g. 31/02/*
            return date;
        },

        /* Standard date formats. */
        ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
        COOKIE: 'D, dd M yy',
        ISO_8601: 'yy-mm-dd',
        RFC_822: 'D, d M y',
        RFC_850: 'DD, dd-M-y',
        RFC_1036: 'D, d M y',
        RFC_1123: 'D, d M yy',
        RFC_2822: 'D, d M yy',
        RSS: 'D, d M y', // RFC 822
        TIMESTAMP: '@',
        W3C: 'yy-mm-dd', // ISO 8601

        /* Format a date object into a string value.
        The format can be combinations of the following:
        d  - day of month (no leading zero)
        dd - day of month (two digit)
        o  - day of year (no leading zeros)
        oo - day of year (three digit)
        D  - day name short
        DD - day name long
        m  - month of year (no leading zero)
        mm - month of year (two digit)
        M  - month name short
        MM - month name long
        y  - year (two digit)
        yy - year (four digit)
        @ - Unix timestamp (ms since 01/01/1970)
        '...' - literal text
        '' - single quote

        @param  format    string - the desired format of the date
        @param  date      Date - the date value to format
        @param  settings  Object - attributes include:
        dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
        dayNames         string[7] - names of the days from Sunday (optional)
        monthNamesShort  string[12] - abbreviated names of the months (optional)
        monthNames       string[12] - names of the months (optional)
        @return  string - the date in the above format */
        formatDate: function (format, date, settings) {
            if (!date)
                return '';
            var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
            var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
            var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
            var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
            // Check whether a format character is doubled
            var lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches)
                    iFormat++;
                return matches;
            };
            // Format a number, with leading zero if necessary
            var formatNumber = function (match, value, len) {
                var num = '' + value;
                if (lookAhead(match))
                    while (num.length < len)
                        num = '0' + num;
                return num;
            };
            // Format a name, short or long as requested
            var formatName = function (match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            };
            var output = '';
            var literal = false;
            if (date)
                for (var iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal)
                        if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                            literal = false;
                        else
                            output += format.charAt(iFormat);
                    else
                        switch (format.charAt(iFormat)) {
                        case 'd':
                            output += formatNumber('d', date.getDate(), 2);
                            break;
                        case 'D':
                            output += formatName('D', date.getDay(), dayNamesShort, dayNames);
                            break;
                        case 'o':
                            var doy = date.getDate();
                            for (var m = date.getMonth() - 1; m >= 0; m--)
                                doy += this._getDaysInMonth(date.getFullYear(), m);
                            output += formatNumber('o', doy, 3);
                            break;
                        case 'm':
                            output += formatNumber('m', date.getMonth() + 1, 2);
                            break;
                        case 'M':
                            output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case 'y':
                            output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                            break;
                        case '@':
                            output += date.getTime();
                            break;
                        case "'":
                            if (lookAhead("'"))
                                output += "'";
                            else
                                literal = true;
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            return output;
        },

        /* Extract all possible characters from the date format. */
        _possibleChars: function (format) {
            var chars = '';
            var literal = false;
            for (var iFormat = 0; iFormat < format.length; iFormat++)
                if (literal)
                    if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                        literal = false;
                    else
                        chars += format.charAt(iFormat);
                else
                    switch (format.charAt(iFormat)) {
                    case 'd': case 'm': case 'y': case '@':
                        chars += '0123456789';
                        break;
                    case 'D': case 'M':
                        return null; // Accept anything
                    case "'":
                        if (lookAhead("'"))
                            chars += "'";
                        else
                            literal = true;
                        break;
                    default:
                        chars += format.charAt(iFormat);
                }
            return chars;
        },

        /* Get a setting value, defaulting if necessary. */
        _get: function (inst, name) {
            return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
        },

        /* Parse existing date and initialise date picker. */
        _setDateFromField: function (inst) {
            var dateFormat = this._get(inst, 'dateFormat');
            var dates = inst.input ? inst.input.val() : null;
            inst.endDay = inst.endMonth = inst.endYear = null;
            var date = defaultDate = this._getDefaultDate(inst);
            var settings = this._getFormatConfig(inst);
            try {
                date = this.parseDate(dateFormat, dates, settings) || defaultDate;
            } catch (event) {
                this.log(event);
                date = defaultDate;
            }
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            inst.currentDay = (dates ? date.getDate() : 0);
            inst.currentMonth = (dates ? date.getMonth() : 0);
            inst.currentYear = (dates ? date.getFullYear() : 0);
            this._adjustInstDate(inst);
        },

        /* Retrieve the default date shown on opening. */
        _getDefaultDate: function (inst) {
            var date = this._determineDate(this._get(inst, 'defaultDate'), new this.Date());
            var minDate = this._getMinMaxDate(inst, 'min', true);
            var maxDate = this._getMinMaxDate(inst, 'max');
            date = (minDate && date < minDate ? minDate : date);
            date = (maxDate && date > maxDate ? maxDate : date);
            return date;
        },

        /* A date may be specified as an exact value or a relative one. */
        _determineDate: function (date, defaultDate) {
            var offsetNumeric = function (offset) {
                var date = new this.Date();
                date.setDate(date.getDate() + offset);
                return date;
            };
            var offsetString = function (offset, getDaysInMonth) {
                var date = new this.Date();
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
                var matches = pattern.exec(offset);
                while (matches) {
                    switch (matches[2] || 'd') {
                        case 'd': case 'D':
                            day += parseInt(matches[1], 10); break;
                        case 'w': case 'W':
                            day += parseInt(matches[1], 10) * 7; break;
                        case 'm': case 'M':
                            month += parseInt(matches[1], 10);
                            day = Math.min(day, getDaysInMonth(year, month));
                            break;
                        case 'y': case 'Y':
                            year += parseInt(matches[1], 10);
                            day = Math.min(day, getDaysInMonth(year, month));
                            break;
                    }
                    matches = pattern.exec(offset);
                }
                return new this.Date(year, month, day);
            };
            date = (date == null ? defaultDate :
			(typeof date == 'string' ? offsetString(date, this._getDaysInMonth) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : date)));
            date = (date && date.toString() == 'Invalid Date' ? defaultDate : date);
            if (date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
            }
            return this._daylightSavingAdjust(date);
        },

        /* Handle switch to/from daylight saving.
        Hours may be non-zero on daylight saving cut-over:
        > 12 when midnight changeover, but then cannot generate
        midnight datetime, so jump to 1AM, otherwise reset.
        @param  date  (Date) the date to check
        @return  (Date) the corrected date */
        _daylightSavingAdjust: function (date) {
            if (!date) return null;
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },

        /* Set the date(s) directly. */
        _setDate: function (inst, date, endDate) {
            var clear = !(date);
            var origMonth = inst.selectedMonth;
            var origYear = inst.selectedYear;
            date = this._determineDate(date, new this.Date());
            inst.selectedDay = inst.currentDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = inst.currentMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = inst.currentYear = date.getFullYear();
            if (origMonth != inst.selectedMonth || origYear != inst.selectedYear)
                this._notifyChange(inst);
            this._adjustInstDate(inst);
            if (inst.input) {
                inst.input.val(clear ? '' : this._formatDate(inst));
            }
        },

        /* Retrieve the date(s) directly. */
        _getDate: function (inst) {
            var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
			this._daylightSavingAdjust(new this.Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
            return startDate;
        },

        /* Generate the HTML for the current state of the date picker. */
        _generateHTML: function (inst) {
            var today = new this.Date();
            today = this._daylightSavingAdjust(
			new this.Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
            var isRTL = this._get(inst, 'isRTL');
            var showButtonPanel = this._get(inst, 'showButtonPanel');
            var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
            var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
            var numMonths = this._getNumberOfMonths(inst);
            var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
            var stepMonths = this._get(inst, 'stepMonths');
            var stepBigMonths = this._get(inst, 'stepBigMonths');
            var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
            var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new this.Date(9999, 9, 9) :
			new this.Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
            var minDate = this._getMinMaxDate(inst, 'min', true);
            var maxDate = this._getMinMaxDate(inst, 'max');
            var drawMonth = inst.drawMonth - showCurrentAtPos;
            var drawYear = inst.drawYear;
            if (drawMonth < 0) {
                drawMonth += 12;
                drawYear--;
            }
            if (maxDate) {
                var maxDraw = this._daylightSavingAdjust(new this.Date(maxDate.getFullYear(),
				maxDate.getMonth() - numMonths[1] + 1, maxDate.getDate()));
                maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
                while (this._daylightSavingAdjust(new this.Date(drawYear, drawMonth, 1)) > maxDraw) {
                    drawMonth--;
                    if (drawMonth < 0) {
                        drawMonth = 11;
                        drawYear--;
                    }
                }
            }
            inst.drawMonth = drawMonth;
            inst.drawYear = drawYear;
            var prevText = this._get(inst, 'prevText');
            prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new this.Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
            
            var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a style="direction:ltr" class="k-datepicker-next" onclick="DP_jQuery.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' +
			' title="' + prevText + '"><span class="kd-icon kd-icon-circle-triangle-' + (isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a style="direction:ltr" class="k-datepicker-next kd-state-disabled" title="' + prevText + '"><span class="kd-icon kd-icon-circle-triangle-' + (isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));

            var nextText = this._get(inst, 'nextText');
            nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new this.Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));

            var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a style="direction:ltr" class="k-datepicker-prev" onclick="DP_jQuery.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' +
			' title="' + nextText + '"><span class="kd-icon kd-icon-circle-triangle-' + (isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a style="direction:ltr" class="k-datepicker-prev kd-state-disabled" title="' + nextText + '"><span class="kd-icon kd-icon-circle-triangle-' + (isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));

            var currentText = this._get(inst, 'currentText');
            var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
            currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
            var controls = (!inst.inline ? '<button type="button" class="k-datepicker-close k-state-default ui-priority-primary" onclick="DP_jQuery.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>' : '');
            var buttonPanel = (showButtonPanel) ? '<div class="k-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="k-datepicker-current k-state-default ui-priority-secondary" onclick="DP_jQuery.datepicker._gotoToday(\'#' + inst.id + '\');"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
            var firstDay = parseInt(this._get(inst, 'firstDay'), 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);
            var dayNames = this._get(inst, 'dayNames');
            var dayNamesShort = this._get(inst, 'dayNamesShort');
            var dayNamesMin = this._get(inst, 'dayNamesMin');
            var monthNames = this._get(inst, 'monthNames');
            var monthNamesShort = this._get(inst, 'monthNamesShort');
            var beforeShowDay = this._get(inst, 'beforeShowDay');
            var showOtherMonths = this._get(inst, 'showOtherMonths');
            var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
            var endDate = inst.endDay ? this._daylightSavingAdjust(
			new this.Date(inst.endYear, inst.endMonth, inst.endDay)) : currentDate;
            var defaultDate = this._getDefaultDate(inst);
            var html = '';
            for (var row = 0; row < numMonths[0]; row++) {
                var group = '';
                for (var col = 0; col < numMonths[1]; col++) {
                    var selectedDate = this._daylightSavingAdjust(new this.Date(drawYear, drawMonth, inst.selectedDay));
                    var cornerClass = 'ui-corner-all';
                    var calender = '';
                    if (isMultiMonth) {
                        calender += '<div class="k-datepicker-group k-datepicker-group-';
                        switch (col) {
                            case 0: calender += 'first'; cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
                            case numMonths[1] - 1: calender += 'last'; cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
                            default: calender += 'middle'; cornerClass = ''; break;
                        }
                        calender += '">';
                    }
                    calender += '<div class="k-block k-header' + cornerClass + '">' +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|left /.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					selectedDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="k-datepicker-calendar"><thead>' +
					'<tr>';
                    var thead = '';
                    for (var dow = 0; dow < 7; dow++) { // days of the week
                        var day = (dow + firstDay) % 7;
                        thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="k-datepicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
                    }
                    calender += thead + '</tr></thead><tbody>';
                    var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                    if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
                        inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                    var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                    var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7)); // calculate the number of rows to generate
                    var printDate = this._daylightSavingAdjust(new this.Date(drawYear, drawMonth, 1 - leadDays));
                    for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        calender += '<tr>';
                        var tbody = '';
                        for (var dow = 0; dow < 7; dow++) { // create date picker days
                            var daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
                            var otherMonth = (printDate.getMonth() != drawMonth);
                            var unselectable = otherMonth || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                            tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' k-datepicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' k-datepicker-other-month' : '') + // highlight days from other months
							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
                            // or defaultDate is current printedDate and defaultDate is selectedDate
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' kd-state-disabled' : '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' ' + this._currentClass : '') + // highlight selected day
							(printDate.getTime() == today.getTime() ? ' k-datepicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' onclick="DP_jQuery.datepicker._selectDay(\'#' +
							inst.id + '\',' + drawMonth + ',' + drawYear + ', this);return false;"') + '>' + // actions
							(otherMonth ? (showOtherMonths ? printDate.getDate() : '&#xa0;') : // display for other months
							(unselectable ? '<span class="k-state-default">' + printDate.getDate() + '</span>' : '<a class="k-state-default' +
							(printDate.getTime() == today.getTime() ? ' k-state-focused' : '') +
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' k-state-active' : '') + // highlight selected day
							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display for this month
                            printDate.setDate(printDate.getDate() + 1);
                            printDate = this._daylightSavingAdjust(printDate);
                        }
                        calender += tbody + '</tr>';
                    }
                    drawMonth++;
                    if (drawMonth > 11) {
                        drawMonth = 0;
                        drawYear++;
                    }
                    calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
							((numMonths[0] > 0 && col == numMonths[1] - 1) ? '<div class="k-datepicker-row-break"></div>' : '') : '');
                    group += calender;
                }
                html += group;
            }
            html += buttonPanel + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !inst.inline ?
			'<iframe src="javascript:false;" class="k-datepicker-cover" frameborder="0"></iframe>' : '');
            inst._keyEvent = false;
            return html;
        },

        /* Generate the month and year header. */
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
			selectedDate, secondary, monthNames, monthNamesShort) {
            minDate = (inst.rangeStart && minDate && selectedDate < minDate ? selectedDate : minDate);
            var changeMonth = this._get(inst, 'changeMonth');
            var changeYear = this._get(inst, 'changeYear');
            var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
            var html = '<div class="k-datepicker-title">';
            var monthHtml = '';
            // month selection
            if (secondary || !changeMonth)
                monthHtml += '<span class="k-datepicker-month">' + monthNames[drawMonth] + '</span> ';
            else {
                var inMinYear = (minDate && minDate.getFullYear() == drawYear);
                var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
                monthHtml += '<select class="k-datepicker-month" ' +
				'onchange="DP_jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
				'onclick="DP_jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
			 	'>';
                for (var month = 0; month < 12; month++) {
                    if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
                        monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
                }
                monthHtml += '</select>';
            }
            if (!showMonthAfterYear)
                html += monthHtml + ((secondary || changeMonth || changeYear) && (!(changeMonth && changeYear)) ? '&#xa0;' : '');
            // year selection
            if (secondary || !changeYear)
                html += '<span class="k-datepicker-year">' + drawYear + '</span>';
            else {
                // determine range of years to display
                var years = this._get(inst, 'yearRange').split(':');
                var year = 0;
                var endYear = 0;
                if (years.length != 2) {
                    year = drawYear - 10;
                    endYear = drawYear + 10;
                } else if (years[0].charAt(0) == '+' || years[0].charAt(0) == '-') {
                    year = drawYear + parseInt(years[0], 10);
                    endYear = drawYear + parseInt(years[1], 10);
                } else {
                    year = parseInt(years[0], 10);
                    endYear = parseInt(years[1], 10);
                }
                year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                html += '<select class="k-datepicker-year" ' +
				'onchange="DP_jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
				'onclick="DP_jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
				'>';
                for (; year <= endYear; year++) {
                    html += '<option value="' + year + '"' +
					(year == drawYear ? ' selected="selected"' : '') +
					'>' + year + '</option>';
                }
                html += '</select>';
            }
            if (showMonthAfterYear)
                html += (secondary || changeMonth || changeYear ? '&#xa0;' : '') + monthHtml;
            html += '</div>'; // Close datepicker_header
            return html;
        },

        /* Adjust one of the date sub-fields. */
        _adjustInstDate: function (inst, offset, period) {
            var year = inst.drawYear + (period == 'Y' ? offset : 0);
            var month = inst.drawMonth + (period == 'M' ? offset : 0);
            var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
            var date = this._daylightSavingAdjust(new this.Date(year, month, day));
            // ensure it is within the bounds set
            var minDate = this._getMinMaxDate(inst, 'min', true);
            var maxDate = this._getMinMaxDate(inst, 'max');
            date = (minDate && date < minDate ? minDate : date);
            date = (maxDate && date > maxDate ? maxDate : date);
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            if (period == 'M' || period == 'Y')
                this._notifyChange(inst);
        },

        /* Notify change of month/year. */
        _notifyChange: function (inst) {
            var onChange = this._get(inst, 'onChangeMonthYear');
            if (onChange)
                onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
        },

        /* Determine the number of months to show. */
        _getNumberOfMonths: function (inst) {
            var numMonths = this._get(inst, 'numberOfMonths');
            return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
        },

        /* Determine the current maximum date - ensure no time components are set - may be overridden for a range. */
        _getMinMaxDate: function (inst, minMax, checkRange) {
            var date = this._determineDate(this._get(inst, minMax + 'Date'), null);
            return (!checkRange || !inst.rangeStart ? date :
			(!date || inst.rangeStart > date ? inst.rangeStart : date));
        },

        /* Find the number of days in a given month. */
        _getDaysInMonth: function (year, month) {
            return 32 - new this.Date(year, month, 32).getDate();
        },

        /* Find the day of the week of the first of a month. */
        _getFirstDayOfMonth: function (year, month) {
            return new this.Date(year, month, 1).getDay();
        },

        /* Determines if we should allow a "next/prev" month display change. */
        _canAdjustMonth: function (inst, offset, curYear, curMonth) {
            var numMonths = this._getNumberOfMonths(inst);
            var date = this._daylightSavingAdjust(new this.Date(
			curYear, curMonth + (offset < 0 ? offset : numMonths[1]), 1));
            if (offset < 0)
                date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
            return this._isInRange(inst, date);
        },

        /* Is the given date in the accepted range? */
        _isInRange: function (inst, date) {
            // during range selection, use minimum of selected date and range start
            var newMinDate = (!inst.rangeStart ? null : this._daylightSavingAdjust(
			new this.Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)));
            newMinDate = (newMinDate && inst.rangeStart < newMinDate ? inst.rangeStart : newMinDate);
            var minDate = newMinDate || this._getMinMaxDate(inst, 'min');
            var maxDate = this._getMinMaxDate(inst, 'max');
            return ((!minDate || date >= minDate) && (!maxDate || date <= maxDate));
        },

        /* Provide the configuration settings for formatting/parsing. */
        _getFormatConfig: function (inst) {
            var shortYearCutoff = this._get(inst, 'shortYearCutoff');
            shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new this.Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
            return { shortYearCutoff: shortYearCutoff,
                dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
                monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')
            };
        },

        /* Format the given date for display. */
        _formatDate: function (inst, day, month, year) {
            if (!day) {
                inst.currentDay = inst.selectedDay;
                inst.currentMonth = inst.selectedMonth;
                inst.currentYear = inst.selectedYear;
            }
            var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new this.Date(year, month, day))) :
			this._daylightSavingAdjust(new this.Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
            return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
        }
    });

    /* jQuery extend now ignores nulls! */
    function extendRemove(target, props) {
        $.extend(target, props);
        for (var name in props)
            if (props[name] == null || props[name] == undefined)
                target[name] = props[name];
        return target;
    };

    /* Determine whether an object is an array. */
    function isArray(a) {
        return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
    };

    /* Invoke the datepicker functionality.
    @param  options  string - a command, optionally followed by additional parameters or
    Object - settings for attaching new datepicker functionality
    @return  jQuery object */
    $.fn.datepicker = function (options) {

        /* Initialise the date picker. */
        if (!$.datepicker.initialized) {
            $(document).mousedown($.datepicker._checkExternalClick).
			find('body').append($.datepicker.dpDiv);
            $.datepicker.initialized = true;
        }

        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate'))
            return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
        if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
            return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
        return this.each(function () {
            typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
        });
    };

    $.datepicker = new Datepicker(); // singleton instance
    $.datepicker.initialized = false;
    $.datepicker.uuid = new this.Date().getTime();
    $.datepicker.version = "1.7.2";

    // Workaround for #4055
    // Add another global to avoid noConflict issues with inline event handlers
    window.DP_jQuery = $;

})(jQuery);

//****************************************************************//
// Mahdi Hasheminezhad. email: hasheminezhad at gmail dot com (http://hasheminezhad.com)
jQuery(function($){
	$.datepicker.regional['fa'] = {
		calendar: JalaliDate,
		closeText: 'قبول',
		prevText: 'قبل',
		nextText: 'بعد',
		currentText: 'امروز',
		monthNames: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],
		monthNamesShort: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],
		dayNames: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
		dayNamesShort: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه'],
		dayNamesMin: ['ی','د','س','چ','پ','ج','ش'],
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy/mm/dd', firstDay: 6,
		isRTL: true};
	$.datepicker.setDefaults($.datepicker.regional['fa']);
});


// JalaliDate: a Date-like object wrapper for jalali.js functions
// Mahdi Hasheminezhad. email: hasheminezhad at gmail dot com (http://hasheminezhad.com)
function JalaliDate(p0, p1, p2) {
    var georgianDate;
    var jalaliDate;
    var isJalali = true;

    if (!p0) {
        setFullDate();
    } else if (typeof (p0) == 'boolean') {
        isJalali = p0;
        setFullDate();
    } else if (typeof (p0 == 'number')) {
        var y = parseInt(p0, 10);
        var m = parseInt(p1, 10);
        var d = parseInt(p2, 10);
        y += div(m, 12);
        m = remainder(m, 12);
        var g = jalali_to_gregorian([y, m, d]);
        setFullDate(new Date(g[0], g[1], g[2]));
    } else if (p0 instanceof Array) {
        throw new "JalaliDate(Array) is not implemented yet!";
    } else {
        setFullDate(p0);
    }

    function setFullDate(date) {
        if (date instanceof JalaliDate) {
            date = date.getGeorgianDate();
        }
        georgianDate = new Date(date);
        if (!georgianDate || georgianDate == 'Invalid Date' || isNaN(georgianDate || !georgianDate.getDate())) {
            georgianDate = new Date();
        }
        jalaliDate = gregorian_to_jalali([
            georgianDate.getFullYear(),
            georgianDate.getMonth(),
            georgianDate.getDate()]);
        return this;
    }
    this.getGeorgianDate = function() { return georgianDate; }

    this.setFullDate = setFullDate;

    this.setDate = function(e) {
        jalaliDate[2] = e;
        var g = jalali_to_gregorian(jalaliDate);
        georgianDate = new Date(g[0], g[1], g[2]);
        jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
    };

    this.getFullYear = function() { return jalaliDate[0]; };
    this.getMonth = function() { return jalaliDate[1]; };
    this.getDate = function() { return jalaliDate[2]; };
    this.toString = function() { return jalaliDate.join(',').toString(); };
    this.getDay = function() { return georgianDate.getDay(); };
    this.getHours = function() { return georgianDate.getHours(); };
    this.getMinutes = function() { return georgianDate.getMinutes(); };
    this.getSeconds = function() { return georgianDate.getSeconds(); };
    this.getTime = function() { return georgianDate.getTime(); };
    this.getTimeZoneOffset = function() { return georgianDate.getTimeZoneOffset(); };
    this.getYear = function() { return JalaliDate[0] % 100; };

    this.setHours = function(e) { georgianDate.setHours(e) };
    this.setMinutes = function(e) { georgianDate.setMinutes(e) };
    this.setSeconds = function(e) { georgianDate.setSeconds(e) };
    this.setMilliseconds = function(e) { georgianDate.setMilliseconds(e) };
}

/* jalali.js  Gregorian to Jalali and inverse date convertor
* Copyright (C) 2001  Roozbeh Pournader <roozbeh@sharif.edu>
* Copyright (C) 2001  Mohammad Toossi <mohammad@bamdad.org>
* Copyright (C) 2003,2008  Behdad Esfahbod <js@behdad.org>
*
* This program is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 2.1 of the License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You can receive a copy of GNU Lesser General Public License at the
* World Wide Web address <http://www.gnu.org/licenses/lgpl.html>.
*
* For licensing issues, contact The FarsiWeb Project Group,
* Computing Center, Sharif University of Technology,
* PO Box 11365-8515, Tehran, Iran, or contact us the
* email address <FWPG@sharif.edu>.
*/

/* Changes:
 * 
 * 2008-Jul-32:
 *	Use a remainder() function to fix conversion of ancient dates
 *	(before 1600 gregorian).  Reported by Shamim Rezaei.
 *
 * 2003-Mar-29:
 *      Ported to javascript by Behdad Esfahbod
 *
 * 2001-Sep-21:
 *	Fixed a bug with "30 Esfand" dates, reported by Mahmoud Ghandi
 *
 * 2001-Sep-20:
 *	First LGPL release, with both sides of conversions
 */
 
g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);
 
function div(a,b) {
  return Math.floor(a/b);
}

function remainder(a,b) {
  return a - div(a,b)*b;
}

function formatMonthAndDay(a) {
    return a >= 10 ? a : '0' + a;
}

function gregorian_to_jalali(g /* array containing year, month, day*/ )
{
   var gy, gm, gd;
   var jy, jm, jd;
   var g_day_no, j_day_no;
   var j_np;
 
   var i;

   gy = g[0]-1600;
   //gm = g[1]-1;
   gm = g[1];
   gd = g[2]-1;

   g_day_no = 365*gy+div((gy+3),4)-div((gy+99),100)+div((gy+399),400);
   for (i=0;i<gm;++i)
      g_day_no += g_days_in_month[i];
   if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
      /* leap and after Feb */
      ++g_day_no;
   g_day_no += gd;
 
   j_day_no = g_day_no-79;
 
   j_np = div(j_day_no, 12053);
   j_day_no = remainder (j_day_no, 12053);
 
   jy = 979+33*j_np+4*div(j_day_no,1461);
   j_day_no = remainder (j_day_no, 1461);
 
   if (j_day_no >= 366) {
      jy += div((j_day_no-1),365);
      j_day_no = remainder ((j_day_no-1), 365);
   }
 
   for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
      j_day_no -= j_days_in_month[i];
   }
   //jm = i+1;
   jm = i;
   jd = j_day_no+1;

   return new Array(jy, jm, jd);
}

function jalali_to_gregorian(j /* array containing year, month, day*/ )
{
   var gy, gm, gd;
   var jy, jm, jd;
   var g_day_no, j_day_no;
   var leap;

   var i;

   jy = j[0]-979;
   //jm = j[1]-1;
   jm = j[1];
   jd = j[2] - 1;

   j_day_no = 365*jy + div(jy,33)*8 + div((remainder (jy, 33)+3),4);
   for (i=0; i < jm; ++i)
      j_day_no += j_days_in_month[i];

   j_day_no += jd;

   g_day_no = j_day_no+79;

   gy = 1600 + 400*div(g_day_no,146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
   g_day_no = remainder (g_day_no, 146097);

   leap = 1;
   if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
   {
      g_day_no--;
      gy += 100*div(g_day_no,36524); /* 36524 = 365*100 + 100/4 - 100/100 */
      g_day_no = remainder (g_day_no, 36524);
      
      if (g_day_no >= 365)
         g_day_no++;
      else
         leap = 0;
   }

   gy += 4*div(g_day_no,1461); /* 1461 = 365*4 + 4/4 */
   g_day_no = remainder (g_day_no, 1461);

   if (g_day_no >= 366) {
      leap = 0;

      g_day_no--;
      gy += div(g_day_no, 365);
      g_day_no = remainder (g_day_no, 365);
   }

   for (i = 0; g_day_no >= g_days_in_month[i] + (i == 1 && leap); i++)
      g_day_no -= g_days_in_month[i] + (i == 1 && leap);
   //gm = i+1;
  gm = i;
  gd = g_day_no + 1;

   return new Array(gy, gm, gd);
}

function jalali_today() {
  Today = new Date();
  j = gregorian_to_jalali(new Array(
                          Today.getFullYear(),
                          Today.getMonth()+1,
                          Today.getDate()
                          ));
  return j[2]+"/"+j[1]+"/"+j[0];
}

//********************************************************************//

function validateDatepicker(target, autocorrect) {
    function getYMDValue(ymd, parts, dateFormat) {
        return parseInt(parts[parseInt(dateFormat.replace(/[\/]/g, '').indexOf(ymd) / 2)], 10);
    }
    function simpleValidation() {
        try {
            dp.Date = dp._get(inst, 'calendar');
            var parsedDate = dp.parseDate(dateFormat, target.value, inst, inst.settings);
            if (!dp._isInRange(inst, parsedDate)) target.value = '';
        } catch (ex) {
            target.value = '';
        }
    }

    var dp = jQuery.datepicker;
    var inst = dp._getInst(target);
    var dateFormat = dp._get(inst, 'dateFormat');
    if (!autocorrect || (dateFormat != 'dd/mm/yy' && dateFormat != 'mm/dd/yy' && dateFormat != 'yy/mm/dd')) {
        simpleValidation();
        return;
    }
    var firstLength = dateFormat[0] == 'y' ? 4 : 2;
    var splitted = target.value.replace(/[,.-]/g, '/').split('/');
    if (splitted.length == 1 && splitted[0].length > firstLength) {
        splitted[1] = splitted[0].substr(firstLength);
        splitted[0] = splitted[0].substr(0, firstLength);
        if (splitted[1].length > 2) {
            splitted[2] = splitted[1].substr(2);
            splitted[1] = splitted[1].substr(0, 2);
        }
    }
    var d = getYMDValue('d', splitted, dateFormat) || 0;
    var m = getYMDValue('m', splitted, dateFormat) || 0;
    var y = getYMDValue('y', splitted, dateFormat) || 0;
    var value = '';
    if (y || m || d) {
        var t;
        if (y <= 31 && d > 31) { t = d; d = y; y = t; }
        if (d <= 12 && m > 12) { t = d; d = m; m = t; }
        var calendar = dp._get(inst, 'calendar') || Date;
        var shortYearCutoff = dp._get(inst, 'shortYearCutoff') || 99;
        var now = new calendar();
        var thisYear = now.getFullYear();
        if (d == 0 && y != 0) { d = y; y = 0; }
        if (y <= 0 || y > 9999) y = thisYear;
        if (y < 100) y += thisYear - thisYear % 100 + (y <= shortYearCutoff ? 0 : -100);
        m = m || (now.getMonth() + 1);
        d = d || now.getDate();
        var date = new calendar(y, m - 1, d);
        var min = dp._get(inst, 'minDate');
        var max = dp._get(inst, 'maxDate');
        if (min && dp._compareDate(date, '<', min)) date = min;
        if (max && dp._compareDate(date, '>', max)) date = max;
        if (min && max && dp._compareDate(min, '>', max)) {
            value = '';
        } else {
            d = date.getDate();
            m = date.getMonth() + 1;
            y = date.getFullYear();
            if (d < 10) d = '0' + d;
            if (m < 10) m = '0' + m;
            if (y < 1000) y = '0' + y;
            value = dateFormat.replace('dd', d).replace('mm', m).replace('yy', y);
        }
    }
    target.value = value;
    simpleValidation();
    target.focus();
}

function fixPersianString(s) { return !s ? null : s.replace(/\u0660/g, '\u06F0').replace(/\u0661/g, '\u06F1').replace(/\u0662/g, '\u06F2').replace(/\u0663/g, '\u06F3').replace(/\u0664/g, '\u06F4').replace(/\u0665/g, '\u06F5').replace(/\u0666/g, '\u06F6').replace(/\u0667/g, '\u06F7').replace(/\u0668/g, '\u06F8').replace(/\u0669/g, '\u06F9').replace(/\u0643/g, '\u06A9').replace(/\u0649/g, '\u06CC').replace(/\u064A/g, '\u06CC').replace(/\u06C0/g, '\u0647\u0654'); }
