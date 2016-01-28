/******************************************
 * menuoptions.org
 * -> requires jquery ui > 1.9
 *
 * Create menus over any element and 
 *  create select menus under input=text elements.
 *  Uses autocomplete and user configured 
 *  mouseover filtering
 *
 * @author          Mike Etts
 * @copyright       Copyright (c) 2014-2015
 * @license         Menu Options jQuery widget is licensed under the MIT license
 * @link            http://www.menuoptions.org
 * @docs            http://menuoptions.readthedocs.org/en/latest/
 * @version         Version 1.7.4-9
 *
 *
 ******************************************/
/*global $, alert, window, console*/
/*jslint nomen: true*/
/* jshint -W097 */
"use strict";
$.widget('mre.menuoptions', {
    options: {
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#bootmenuofs
        BootMenuOfs: 125,   // how far to left of expanded menu should dropdown appear
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#clearbtn
        ClearBtn: false,   // if set, will clear the input field to it's left
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#selectonly
        SelectOnly: false,  // if true, will not allow user to type input
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#data
        Data: '',  // pass in your array, object or array of objects here
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#columncount
        ColumnCount: 1, // display data in this number of columns
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#usevalueforkey
        UseValueForKey: false, // if user wants value = text()
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#width
        Width: '', // let user specify the exact width they want
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#height
        Height: '', // let user specify the exact height they want
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#showat
        ShowAt: 'bottom', // 'bottom' or 'right' are the options
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        DataKeyNames: {}, // specify object keys that contain desired data
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#filters
        Filters: [], // header filters (pass mouse over them & they filter choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#menuoptionstype
        MenuOptionsType: 'Select', //or Navigate (run JS,follow href) or Rocker (for binary choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        DisableHiLiting : true, // set to false to enable autocomplete highlighting
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#showdownarrow 
        ShowDownArrow : "black", // set to None to hide down arrow on menus, else pass in color of arrow
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#initialvalue
        InitialValue : {}, // allows initial value ot be set
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#window
        Window : "repl", // "repl" means replace current window, new mean open new browser window
        _ID: 'UnIqDrOpDoWnSeLeCt', // will be substituted later by the eventNamespace
        _bootstrap: false, // make changes if in bootstrap 3
        _vert_ofs : 0,
        _prev_event : '',
        _prev_target : '',
        _prevXY : { X : 0, Y : 0 },
        _CurrentFilter: '',
        _orig_bc : '',
        _currTD : [ 0, 1 ],
        _event_ns : '',
        _curr_img : '',
        _menu_box : {
            top : 0,
            bottom : 0,
            left : 0,
            right : 0,
        },
        _width_adj : {
            width_menu : 0,
            width_adjustment : 0,
            width_after_adj : 0
        },
    },

  // the constructor
    _create: function () {

        if (this.options.Data.toString() === '') {
            this._validation_fail('MenuOptions requires the Data parameter to be populated');
            return;
        }

        if (this.options.ColumnCount < 1) {
            this._validation_fail('MenuOptions requires ColumnCount parameter be > 0');
            return;
        }

        // make sure incoming data is in required format
        this._build_array_of_objs();
        if (this.orig_objs === false) {
            this._validation_fail('Invalid Data format supplied to menuoptions');
            return;
        }

        this._check_for_bootstrap();

        this._setOptions( this.options );

        if (/Rocker/i.test($(this.options)[0].MenuOptionsType) ) {
            if (this._rocker_main({'val' : ''}) === false) {
                return;
            }
        } else {
            this._add_clear_btn();
            this._build_dropdown(this.orig_objs);
            this._bind_events();
            $(this.element).attr('autocomplete', 'off');
        }

        this._detect_destroyed_input();

        this._refresh(); 

        $(this.element).addClass('ui-menuoptions');
    },

    _validation_fail : function (err_msg) {
        var prefix = "input id #"+ $(this.element).attr('id') + ": ";
        alert(prefix + err_msg);
        this._destroy();
    },

    _check_for_bootstrap : function (err_msg) {
        if ( $('script[src*=bootstrap]').length > 0 ) {
            this.options._bootstrap = true;
        }
    },

    refreshData : function (RefreshCfg) {
        this._setOptions( RefreshCfg );
    },

    add_menuoption_key : function () {
        var input_val = this.element.val();
        var matchedRec = $.grep(this.ary_of_objs, function (rec) {
                var select_str = rec.val.replace(/<[\w\W]*?>/g, '');
                return select_str === input_val || rec.ky === input_val;
                /*--  return rec.ky === input_val;  --*/
            });
        if (matchedRec.length === 0) {
            this._validation_fail('Matching value was not found in select list');
        } else {
            var raw_val = matchedRec[0].val.replace(/<[\w\W]*?>/g, '');
            if (/Rocker/i.test($(this.options)[0].MenuOptionsType) ) {
                this._set_rocker ( matchedRec, raw_val );
            } else {
                $(this.element).removeAttr('value');
                $(this.element).val(raw_val);
                $(this.element).attr('menu_opt_key', matchedRec[0].ky);
            }
        }
    },

    set_select_value : function (new_rec_obj) {
        var val = '',
            matchedRec = {};
        if (new_rec_obj.hasOwnProperty('ky')) {
            matchedRec = $.grep(this.ary_of_objs, function (rec) {
                return parseInt(rec.ky, 10) === parseInt(new_rec_obj.ky, 10);
            });
            val = matchedRec[0].val;
        } else {
            val = new_rec_obj.val;
        }
        if (/Rocker/i.test($(this.options)[0].MenuOptionsType) ) {
            if (val !== null && val === '') {
                $(this.element).attr('menu_opt_key', '');
                $('div#RK_RT_' + this._event_ns).attr('class', 'rtup');
                $('div#RK_LT_' + this._event_ns).attr('class', 'ltup');
            } else {
                this._change_rocker($(this.element).parent()
                        .find('span:contains(' + val + ')').parent());
            }
        } else {
            this.element.val(val);
            if ( val.length > 0 ) { // skip for clearing out input
                this.add_menuoption_key();
            }
        }
    },

    _change_rocker: function (target) {
        /*--  set key and value for hidden input control  --*/
        $(this.element)
            .attr('menu_opt_key', target.attr('menu_opt_key'));
        $(this.element).val(target.find('span').text());
        if (/ltup/.test(target.attr('class'))) {
            $('div#RK_LT_' + this._event_ns).attr('class', 'ltdown');
            $('div#RK_RT_' + this._event_ns).attr('class', 'rtup');
        } else if (/rtup/.test(target.attr('class'))) {
            $('div#RK_LT_' + this._event_ns).attr('class', 'ltup');
            $('div#RK_RT_' + this._event_ns).attr('class', 'rtdown');
        }
    },

    _rocker_main : function (orig_val) {
        if (this.orig_objs.length !== 2) {
            this._validation_fail('When using the rocker control, exactly 2 elements need to be supplied to menuoptions');
            return false;
        }
        if ($('div.rocker[id=RK_' + this._event_ns + ']').length) {
            $('div.rocker[id=RK_' + this._event_ns + ']').remove();
        }
        this._create_rocker();
        this._bind_rocker();
        if (orig_val.val.length > 0) {
            this.set_select_value(orig_val);
        }
    },

    _bind_rocker: function () {
        this._on($('div[id$=T_' + this._event_ns + ']'), {
            'click':  '_rocker_click'
        });
    },

    _initval_exists : function () {
        var retval = false;
        if ((this.options.InitialValue.hasOwnProperty('val') &&
                this.options.InitialValue.val.length >= 0) ||
                (this.options.InitialValue.hasOwnProperty('ky') &&
                this.options.InitialValue.ky.length >= 0)) {
            retval = true;
        }
        return retval;
    },

    _create_rocker : function () {
        var rtclass = "rtup",
            ltclass = "ltup",
            currval = $(this.element).val();
        $(this.element).hide();
        $(this.element).next('span.clearbtn').hide();
        this._event_ns = this.eventNamespace.replace(/^\./, '');
        if (this._initval_exists()) {
            this.set_select_value(this.options.InitialValue);
        }
        if (currval.length > 0 && new RegExp(currval).test(this.orig_objs[0].val)) {
            ltclass = "ltdown";
        }
        if (currval.length > 0 && new RegExp(currval).test(this.orig_objs[1].val)) {
            rtclass = "rtdown";
        }
        $(this.element).parent().append("<div class=rocker id=RK_" + this._event_ns +
            ">" + "<div id=RK_LT_" + this._event_ns + " class=" + ltclass +
            " menu_opt_key=" + this.orig_objs[0].ky + "></div>" +
            "<div id=RK_RT_" + this._event_ns + " class=" + rtclass +
            " menu_opt_key=" + this.orig_objs[1].ky + "></div>" +
            "</div></div>");
        $('div#RK_LT_' + this._event_ns)
            .append('<span class=innertext>' + this.orig_objs[0].val + '</span>');
        $('div#RK_RT_' + this._event_ns)
            .append('<span class=innertext>' + this.orig_objs[1].val + '</span>');
    },

    _rocker_click : function (event) {
        var tgt = $(event.target).is('[menu_opt_key]') ? $(event.target) : $(event.target.parentElement);
        this._change_rocker(tgt);
        this._trigger("onSelect", this, {
            "newCode": tgt.attr('menu_opt_key'),
            "newVal" : tgt.children().text(),
            "type": "RockerClick"
        });
    },

    _set_rocker : function ( matchedRec, raw_val ) {
        $(this.element).attr('menu_opt_key', matchedRec[0].ky);
        $(this.element).val(raw_val);
        if ( new RegExp(raw_val).test($('div#RK_RT_' + 
                    this.options._ID + " span").text()) ) {
            $('div#RK_RT_' + this.options._ID).attr('class', 'rtdown');
            $('div#RK_LT_' + this.options._ID).attr('class', 'ltup');
        } else if ( new RegExp(raw_val).test($('div#RK_LT_' + 
                    this.options._ID + " span").text()) ) {
            $('div#RK_RT_' + this.options._ID).attr('class', 'rtup');
            $('div#RK_LT_' + this.options._ID).attr('class', 'ltdown');
        }
    },

    _detect_destroyed_input: function () {
        $(this.element).bind('remove', function () {
            this._destroy();
        });
    },

    _buildWholeDropDown : function (e) {

        if (e.type === 'search') { // clear menu_opt_key when input is cleared
            $(this.element).attr('menu_opt_key', '');
        }
        if (/Select/.test($(this.options)[0].MenuOptionsType) &&
                e.type === 'mouseenter' && this.options._prev_event === 'mouseenter' &&
                !/(all)/.test($(e.target).text())) {
            return; // Firefox
        }
        if (/Navigate/.test($(this.options)[0].MenuOptionsType) &&
                (/mouseenter/.test(e.type))) {
            // detect mouseover menu for keypress detection
            $(this.options)[0]._curr_img = $(e.currentTarget);
        }
        /* if wholeDropDown is already visible and this is not 
            a mouseover filtering operation, just return */
        if ($('table.CrEaTeDtAbLeStYlE').is(':visible') &&
                this.cached['.mo_elem'].val().length === 0  &&
                $(this.options)[0]._CurrentFilter.length === 0 &&
                ! this.options._bootstrap &&
                /Navigate/.test($(this.options)[0].MenuOptionsType)) {
            return;
        }
        // prevents multiple consecutive calls - Firefox in particular
        if ((e.type === 'click' && this.options._prev_event === 'mouseenter') ||
                (e.type === 'mousedown' && this.options._prev_event === 'mouseenter')) {
            return;
        }
        this.options._currTD = [0, 1];
        this.options._prev_event = e.type;
        // if there is text in input, filter results accordingly
        if (this.cached['.mo_elem'].val().length) {
            this._process_matches(e, this.cached['.mo_elem'].val());
            return;
        }
        this._build_dropdown(this.orig_objs);
        this._show_drop_down(e);
    },

    _build_filtered_dropdown: function (event, matching) {
        this._build_dropdown( matching );
        this._show_drop_down(event);
    },

    _build_dropdown: function (ary_of_objs) {
        var tablehtml = this._create_table(ary_of_objs);
        this._event_ns = this.eventNamespace.replace(/^\./, '');
        this.dropdownbox = $(tablehtml);
        this._cache_elems();
        this._calcDropBoxCoordinates();
    },

    _color_border : function (StrToCheck) {
        var select_str = '',
            IsSearchStrValidAnsw = false;
        IsSearchStrValidAnsw = $.grep(this.ary_of_objs, function (rec) {
            // the replace is to ignore images user may have used
            select_str = rec.val.replace(/<[\w\W]*?>/g, '');
            return StrToCheck.match(new RegExp(select_str, 'i'));
        });
        if (IsSearchStrValidAnsw.length === 0) {
            $(this.element).css({'border-color' : 'red' });
        } else {
            $(this.element).css({'border-color' : this.options._orig_bc });
        }
    },

    __triggerChoice : function (event) {
        var firstMenuItem = $('table.CrEaTeDtAbLeStYlE').find('td:first'),
            hilited = $('.CrEaTeDtAbLeStYlE tr td.mo');
        if (hilited.length > 0) {
            firstMenuItem = hilited;
        }
        this.element.val(firstMenuItem.text());
        this.element.attr('menu_opt_key', firstMenuItem.attr('menu_opt_key'));
        if (!this.options.DisableHiLiting) {
            $(this.element).css({'border-color' : this.options._orig_bc });
        }
        this._trigger("onSelect", this, {
            "newCode": $(event.target).attr('menu_opt_key'),
            "newVal" : firstMenuItem.text(),
            "type": "EnterKey"
        });
        this.cached['.dropdownspan'].remove();
    },

    __buildMatchAry : function (StrToCheck, no_img) {
        var origImg = "",
            newval = "",
            newStr = "",
            $dd = this,
            lastChar = StrToCheck.charAt(StrToCheck.length - 1),
            RegExStr = '',
            matching = [];
        if (StrToCheck.match(/\{|\}|\\|\*|\(|\)|\./) &&
                !($(this.options)[0].MenuOptionsType.match(/Navigate/i))) {
            newStr = [StrToCheck.slice(0, (StrToCheck.length - 1)), '\\', lastChar].join('');
            StrToCheck = newStr;
        }
        RegExStr = new RegExp(StrToCheck, 'i');
        matching = $.map(this.orig_objs, function (o) {
            if (/Navigate/i.test($($dd.options)[0].MenuOptionsType) && RegExStr.test(o.val)) {
                return o;
            }
            no_img = o.val.replace(/<img[\w\W]*?>/, '');
            if (RegExStr.test(no_img)) {
                newval = no_img.replace(RegExStr, '<span style="color:brown;font-size:110%;">' +
                        no_img.match(RegExStr) + '</span>');
                origImg = o.val.match(/<img[\w\W]*?>/);
                if (origImg) {
                    newval = origImg + newval;
                }
                return { ky: o.ky, val: newval };
            }
        });
        if (matching.length === 0) { // cut chars not in any of the choices
            this.cached['.mo_elem'].val(this.cached['.mo_elem'].val().slice(0, -1));
        }
        return matching;
    },

    _process_matches : function (event, StrToCheck) {
        var matching = [];
        if (StrToCheck !== '') {
            matching = this.__buildMatchAry(StrToCheck, false);
            this.cached['.dropdownspan'].remove();
        }
        if (matching.length > 0) {
            // re-create drop down select
            this._build_filtered_dropdown(event, matching);
        } else {
            this._buildWholeDropDown(event);
        }
        if (!this.options.DisableHiLiting) {
            this._color_border(StrToCheck);
        }
    },

    _run_header_filter : function (event) {
        if (this.cached['.mo_elem'].val().length) {
            // disable mouseover filters if user started autocomplete
            return;
        }
        // mouseover event continually fires during any move within the <td> cell
        if (this.options._CurrentFilter === $(event.currentTarget).text()) {
            return;
        }
        // get text from header filter <td>
        var SearchStr = $(event.currentTarget).text();
        this.options._CurrentFilter = $(event.currentTarget).text();
        if ($.isPlainObject(this.options.Filters[0])) {
            if ($(event.currentTarget).attr('menuopt_regex')) {
                SearchStr = $(event.currentTarget).attr('menuopt_regex');
                this._process_matches(event,  SearchStr);
            } else if ($(event.currentTarget).text().match(/\(all\)/i)) {
                this._buildWholeDropDown(event);
            } else {
                this._validation_fail('Filter key ' + $(event.currentTarget).text() +
                    'does not have a matching regular expression');
            }
        } else { // assume array of scalars
            if ($.inArray(SearchStr, this.options.Filters) > -1) {
                this._process_matches(event,  SearchStr);
            } else {
                // if filter is not in list, user passed over ALL
                this._buildWholeDropDown(event);
            }
        }
    },

    _createFilterHeader : function () {
        var TDary = [],
            p = [];
        if (!$.isPlainObject(this.options.Filters[0])) {
            TDary = $.map(this.options.Filters, function (obj) {
                return '\t<td class=dflt>' + obj + '</td>\n';
            });
            TDary.unshift('\t<td class=dflt>(all)</td>\n');
        } else {
            /*jslint unparam: true*/
            $.each(this.options.Filters, function (key, value) {
                p = $.map(value, function (v, i) {
                    return i;
                });
                TDary.push('\t<td class=dflt id=hdr_fltr' + p[0] +
                        ' menuopt_regex="' + value[p[0]] + '">' + 
                        p[0] + '</td>\n');
            });
            /*jslint unparam: false*/
            TDary.unshift('\t<td class=dflt id=hdr_fltrAll>(all)</td>\n');
        }
        return '\n<table id=HF_' + this._event_ns + ' class=HdrFilter>\n<tr>\n' + 
            TDary.join('') + '</tr>\n</table>\n';
    },

    _clear_filter: function () {
        this.options._CurrentFilter = '';
    },

    _bind_events: function () {
        var ky = '',
             Sel = {}; 

        // build selector : function() object for table.HdrFilter
        ky = 'mouseenter span#SP_' + this.options._ID + ' table#HF_' + 
            this._event_ns + ' td.dflt';
        Sel[ky] = '_run_header_filter';
        ky = 'click span#SP_' + this.options._ID + ' table#HF_' + this._event_ns + ' td.dflt';
        Sel[ky] = '_run_header_filter';
        ky = 'mouseleave  span#SP_' + this.options._ID + ' table#HF_' + this._event_ns + ' td.dflt';
        Sel[ky] = '_clear_filter';
        this._on($('body'), Sel);

        Sel = {}; 
        ky = 'click button.navbar-toggle'; 
        Sel[ky] = '_removeDropDown';
        this._on($('body'), Sel); 

        // highlight the clear button
        this._on(this.cached['.clearBtn'], {
            'mouseleave': '_hiLiteOnOff',
            'mouseenter': '_hiLiteOnOff',
            'mousedown': '_clearInput',
            'click': '_clearInput'
        });
        // bind events to this.element
        this._on({
            'touchend':  '_buildWholeDropDown',
            'mousedown':  '_buildWholeDropDown',
            'click':  '_buildWholeDropDown',
            'mouseenter':  '_buildWholeDropDown',
            'focus':  '_buildWholeDropDown',
            'input':  '_buildWholeDropDown',
            'search':  '_buildWholeDropDown',
            'mouseleave':  '_removeDropDown',
            'blur': '_removeDropDown',
        });
        // set mouseenter and mouseleave class for table cell
        this._on($('body'), {
            'mouseleave span table.CrEaTeDtAbLeStYlE td.dflt': '_hiLiteOnOff',
            'mouseenter span table.CrEaTeDtAbLeStYlE td.dflt': '_hiLiteOnOff'
        });

        // when user chooses (clicks), insert text into input box
        Sel = {};
        ky = 'mousedown span#SP_' + this.options._ID + ' table.CrEaTeDtAbLeStYlE td ';
        Sel[ky] = '_choice_selected';
        this._on($('body'), Sel);

        // when mouse leaves the container, remove it from DOM
        Sel = {};
        ky = 'mouseleave span#SP_' + this.options._ID;
        Sel[ky] = '_removeDropDown';
        this._on($('body'), Sel);

        // allow user to filter viewable choices
        this._on(this.cached['.mo_elem'], {
            keypress: '_autocomplete',
            keydown: '_autocomplete',
            keyup: '_autocomplete',
        });
    },

    _clearInput: function (e) {
        var $this=this;
        if ( ! $(this.element).prop('disabled') ) {
            $(this.element).attr('menu_opt_key', '');
            $(this.element).val('');
            setTimeout( function() {
                $($this.element).focus(); //chrome needs delay
            }, 80 );
        }
    },

    _arrow_keys : function (event) {
        var kc = event.keyCode,
            $rt = 39,
            $lt = 37,
            $up = 38,
            $dwn = 40,
            arr_key_pressed = false,
            row = this.options._currTD[0],
            col = this.options._currTD[1],
            highlited = $('.CrEaTeDtAbLeStYlE tr td.mo');
        if (/keydown|keyup/.test(event.type)) {
            if (/keyup/.test(event.type) &&
                    (kc === $rt || kc === $lt || kc === $up || kc === $dwn)) {
                event.preventDefault();
                return true;
            }
            switch (event.keyCode) {
            case $.ui.keyCode.TAB:
                return false;
            case $.ui.keyCode.RIGHT:
                if (col < $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(1) td').length) {
                    col = this.options._currTD[1] = this.options._currTD[1] + 1;
                }
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.LEFT:
                if (col > 1) {
                    col = this.options._currTD[1] = this.options._currTD[1] - 1;
                }
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.UP:
                if (row > 1) {
                    row = this.options._currTD[0] = this.options._currTD[0] - 1;
                }
                this.__scroll(row);
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.DOWN:
                if (row < $('.CrEaTeDtAbLeStYlE tbody tr').length) {
                    this.options._currTD[0] += 1;
                    row = this.options._currTD[0];
                }
                this.__scroll(row);
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.ENTER:
                if (/divider/.test($(highlited).prop('class'))) {
                    arr_key_pressed = false;
                } else if (highlited.length > 0) {
                    if (/Select/.test($(this.options)[0].MenuOptionsType)) {
                        this.__triggerChoice(event);
                    } else if (/keydown/.test(event.type)) {
                        this._run_menu_item(event);
                    }
                }
                event.preventDefault();
                break;
            case $.ui.keyCode.DELETE:
                if ($(this.options)[0].MenuOptionsType.match(/Select/i) &&
                        this.cached['.mo_elem'].length === 0) {
                    this.cached['.dropdownspan'].remove();
                    $('.CrEaTeDtAbLeStYlE tr td').removeClass('mo');
                    this._buildWholeDropDown(event);
                }
                break;
            }
            if (arr_key_pressed === true) {
                $('.CrEaTeDtAbLeStYlE tr td').removeClass('mo');
                $('.CrEaTeDtAbLeStYlE tr:nth-child(' + row + ') td:nth-child(' + col + ')').addClass('mo');
                return arr_key_pressed;
            }
        }
        return false;
    },

    __scroll: function (row) {
        var row_top = $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(' + row + ')').offset().top,
            row_ht = $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(' + row + ')').height(),
            vis_ht = $('span#SP_' + this.options._ID).height(),
            vis_top = $('span#SP_' + this.options._ID).offset().top;
        if (vis_top > row_top) {
            this.options._vert_ofs -= row_ht;
            $('span#SP_' + this.options._ID).scrollTop(this.options._vert_ofs);
        } else if (vis_top + vis_ht < row_top + row_ht) {
            this.options._vert_ofs += row_ht;
            $('span#SP_' + this.options._ID).scrollTop(this.options._vert_ofs);
        }
    },

    _autocomplete: function (e) {
        if (/keydown|keyup/.test(e.type) && this._arrow_keys(e) === true) {
            return;
        }
        if (/Navigate/.test($(this.options)[0].MenuOptionsType)) {
            return;
        }
        if (e.keyCode === $.ui.keyCode.ENTER) {
            e.preventDefault();
        }
        if (/keydown/.test(e.type)) {
            if ((this.cached['.mo_elem'].is(':visible') &&
                    e.keyCode === $.ui.keyCode.ENTER) ||
                    (e.keyCode === $.ui.keyCode.TAB &&
                    this.cached['.mo_elem'].val().length > 0)) {
                this._process_matches(e, this.cached['.mo_elem'].val());
                this.__triggerChoice(e);
                return;
            }
        }
        if (/keyup/.test(e.type) || e.keyCode === $.ui.keyCode.BACKSPACE) {
            this._process_matches(e, this.cached['.mo_elem'].val());
        }
    },

    _hiLiteOnOff : function (event) {
        if ($(event.target).attr('class')) {
            if ($(event.target).attr('class').match(/clearbtn/)) {
                $(event.target).toggleClass('ClearButtonMO');
            }
            if ($(event.target).attr('class').match(/ *dflt */)) {
                if (event.type === 'mouseenter') {
                    $(event.target).addClass('mo');
                } else {
                    $('span table.CrEaTeDtAbLeStYlE td.dflt').removeClass('mo');
                }
            }
        }
    },

    // called when created, and later when changing options
    _refresh : function () {
        return;
    },

    _cache_elems : function () {
        var $dd_span = this.dropdownbox,
            $dropdowncells = this.dropdownbox.find('td'),
            $menuoptions_elem = this.element,
            $clearBtn = $('span#CB_' + this._event_ns);
        this.cached = {
            '.dropdownspan' : $dd_span,
            '.dropdowncells' : $dropdowncells,
            '.clearBtn' : $clearBtn,
            '.mo_elem' : $menuoptions_elem
        };

    },

    _recreate_mo : function() {
        var orig_val = $(this.element).val();
        this._build_array_of_objs();
        if (/Rocker/i.test($(this.options)[0].MenuOptionsType) ) {
            this._rocker_main({ 'val' : orig_val });
        } else {
            if ($('div.rocker[id=RK_' + this._event_ns + ']').length) {
                $('div.rocker[id=RK_' + this._event_ns + ']').remove();
                $(this.element).show();
                $(this.element).next('span.clearbtn').show();
            }
            this._build_dropdown(this.orig_objs);
        }
    },

    _setOptions : function ( options ) {
        var $dd_span = this;
        if ( $(this.element).val().length ) {
            this.add_menuoption_key();
            /*--  calling MenuOptions with no parameters will   --*/
            /*--  just run add_menuoption_key()  --*/
            if ( Object.keys(options).length === 0 ) {
                return;
            }
        }
        this.options._orig_showat = this.options.ShowAt;
        $.each(options, function (key, value) {
            if ($dd_span.options.hasOwnProperty(key)) {
                $dd_span._setOption(key, options[key]);
            }
        });
        this._set_showat();
        if (this._initval_exists()) {
            this.set_select_value(this.options.InitialValue);
        }
        if (this.options.SelectOnly) {
            $(this.element).prop('readonly', true);
        }
        this._setOption('_ID', this.eventNamespace.replace(/^\./, ''));
        if (/Select/.test(this.options.MenuOptionsType)) {
            this._setOption('_orig_bc', $(this.element).css('border-top-color'));
        }
        this._recreate_mo();  
    },

    _set_showat : function () {
        if (this.options.ShowAt.match(/^ *bottom *$/i)) {
            this._setOption('ShowAt', 'left bottom-2' );
        } else if (this.options.ShowAt.match(/^ *right *$/i)) {
            this._setOption('ShowAt', 'right-2 top');
        }
    },

    /* 
        Pass in the results of serialize() to re_serialize and it will replace 
        values with values found in value.
        Sample call to re_serialize :
            $('input#times').menuoptions('re_serialize',$('form').serialize());
    */
    re_serialize : function (serialize_str) {
        var new_get_str = '';
        /*jslint unparam: true*/
        $.each(serialize_str.split('&'), function (k, v) {
            $.each(v.split('='), function (k2, v2) {
                if ($('input[name="' + v2 + '"]') &&
                        $('input[name="' + v2 + '"]').attr('menu_opt_key')) {
                    new_get_str += v2 + '=' + 
                        $('input[name="' + v2 + '"]').attr('menu_opt_key') + '&';
                } else {
                    new_get_str += v2 + '=' + $('input[name="' + v2 + '"]').val() + '&';
                }
                return false;
            });
        });
        /*jslint unparam: false*/
        return new_get_str.slice(0, -1);
    },

    _destroy : function () {
        $(this.element).removeClass('ui-menuoptions');
        $('span#SP_' + this.options._ID).remove();
        this._super();
    },

    _runSort : function (ary_of_objs) {
        if (this.options.Sort.length > 0) {
            var sortInstruct = this.options.Sort;
            if (sortInstruct[0].match(/alpha/i) && sortInstruct[1].match(/asc/i)) {
                ary_of_objs.sort(function (a, b) {return ((a.val) > (b.val) ? 1 :
                        ((b.val) > (a.val)) ? -1 : 0); });
            }
            if (sortInstruct[0].match(/alpha/i) && sortInstruct[1].match(/desc/i)) {
                ary_of_objs.sort(function (a, b) {return ((a.val) < (b.val) ? 1 :
                        ((b.val) < (a.val)) ? -1 : 0); });
            }
            if (sortInstruct[0].match(/num/i) && sortInstruct[1].match(/asc/i)) {
                ary_of_objs.sort(function (a, b) {return (a - b); });
            }
            if (sortInstruct[0].match(/num/i) && sortInstruct[1].match(/desc/i)) {
                ary_of_objs.sort(function (a, b) {return (b - a); });
            }
        }
    },

    _build_row : function (dd_span, subary) {
        return $.map(subary, function (obj) {
            if (!$.isFunction(obj.ky) && obj.ky.match(/^ *divider *$/i) &&
                    dd_span.options.MenuOptionsType === 'Navigate') {
                // for menu's, a non clickable divider row (for categories, etc)
                return '\t<td class=' + obj.ky + '>' + obj.val + '</td>\n';
            }
            return '\t<td class=dflt menu_opt_key="' + obj.ky + 
                '">' + obj.val + '</td>\n';
        });
    },
    _create_table : function (ary_of_objs) {
        var buffer = '',
            subary = [],
            TDary = [],
            RowCnt = 0,
            start_ofs = 0,
            html = '',
            i = 0,
            menu_pos = /bottom/.test($(this.options)[0].ShowAt) ? 'bot' : 'rt';

        // sort as per default or user specification
        this._runSort(ary_of_objs);
        // set val = key attr
        if (this.options.UseValueForKey === true &&
                ary_of_objs.length === this.orig_objs.length) {
            /*jslint unparam: true*/
            $.each(ary_of_objs, function (k, v) { v.val = v.ky; });
            /*jslint unparam: false*/
        }
        while (RowCnt * this.options.ColumnCount < ary_of_objs.length) {
            start_ofs = RowCnt === 0 ? 0 : (RowCnt * this.options.ColumnCount);
            subary = ary_of_objs.slice(start_ofs, start_ofs + this.options.ColumnCount);
            TDary = this._build_row(this, subary);
            // pad with empty cells (if necessary) to match TD count of other rows
            for (i = subary.length + 1; i <= this.options.ColumnCount; i += 1) {
                TDary.push('<td class=dflt menu_opt_key="">&nbsp;</td>');
            }
            buffer += '<tr>\n' + TDary.join('') + '</tr>\n';
            RowCnt += 1;
        }
        buffer = '<table class=CrEaTeDtAbLeStYlE cellpadding=4px>\n' + 
            buffer + '</table>';
        if (this.options.Filters.length && $(this.element).val().length === 0) {
            buffer = this._createFilterHeader() + buffer;
        }
        if ( $('button.navbar-toggle').length && 
             /block/.test($('button.navbar-toggle').css('display')) && 
             $(this.element).closest('ul.navbar-nav').length ) {
             menu_pos = "rt";
        }
        html = '<span class=' + $(this.options)[0].MenuOptionsType + menu_pos + ' id=SP_' + this.options._ID + '>' + buffer + '\n</span>';
        return html;
    },

    _add_clear_btn : function () {
        var ClrBtn = '', id = '';
        if (this.options.ClearBtn && /Select/.test(this.options.MenuOptionsType)) {
            id = 'CB_' + this.eventNamespace.replace(/^\./, ''); 
            ClrBtn = '<span class="clearbtn clearbtnpos" id=' + id + '>X</span>';
            $(this.element).after(ClrBtn);
            $("span#"+id).position({ of: $(this.element), my:'center center', at:'right-10' });
        }
        this._show_menu_arrs();
    },

    __set_arrow : function ( direction ) {
        var arr_dir = /down/.test(direction) ? 'top' : 'left';
        $('span[id="arr_' + this.options._ID + '"]').remove();
        this.element.html(this.element.html() + "&nbsp;<span id=arr_" + this.options._ID + " class=" + direction + "_arrow></span>");
        $('#arr_' + this.options._ID + '.' + direction + '_arrow').css('border-' + arr_dir, '4px solid ' + this.options.ShowDownArrow);
    },

    _show_menu_arrs : function () {
        if (/Navigate/.test(this.options.MenuOptionsType) && ! /None/i.test(this.options.ShowDownArrow)) {
            if ( $('button.navbar-toggle').length && 
                 /block/.test($('button.navbar-toggle').css('display')) && 
                $(this.element).closest('ul.navbar-nav').length ) {
                this.__set_arrow( "right" );
            } else if (/^right/i.test(this.options.ShowAt) ) {
                this.__set_arrow( "right" );
            } else {
                this.__set_arrow( "down" );
            }
        }
    },

    _build_array_of_objs_menu : function () {
        if (!$.isArray(this.options.Data)) { 
            var data = [];
            $.each(this.options.Data, function (key, value) {
                // handle single object
                data.push({ ky: value, val: key });
            });
            this.orig_objs = this.ary_of_objs = data;
        } else {
            // reverse key value pair 
            this.orig_objs = this.ary_of_objs = $.map(this.options.Data, function (k) {
                return { ky: k[Object.keys(k)[0]], val: Object.keys(k)[0]};
            });
        }
    },

    _get_custom_keys : function (obj, ary_of_objs) {
        var kys = Object.keys(obj),
            obj_ky=this.options.DataKeyNames.key,
            obj_val=this.options.DataKeyNames.value;
        var valid_kys = $.grep(kys, function(n,i) { 
                if ( n===obj_ky || n===obj_val ) 
                    return n; 
            });
        if ( valid_kys.length != 2 ) {
            this._validation_fail(" Data error: DataKeyNames is invalid "+
                                  " (it only matched "+valid_kys.length+
                                  " keys in the Data parameter)");
            return false;
        } else {
            ary_of_objs.push({ ky: obj[obj_ky].toString(), 
                val: obj[obj_val].toString() });
        }
    },

    _obj_create : function (ary_of_objs, value) {
        var kys, obj_ky, obj_val;
        if ($.isArray(value) === true) {
            $.each(value, function (key, val) {
                ary_of_objs.push({ ky: val, val: val });
            });
        } else {
            if ( Object.keys(this.options.DataKeyNames).length > 0 ) {
               return this._get_custom_keys(value, ary_of_objs);
            } else {
                kys = Object.keys(value);
                for (var i = 0; i < kys.length; i++) { 
                    if (value.hasOwnProperty(kys[i])) {
                        ary_of_objs.push({ ky: kys[i], val: value[kys[i]] });
                    } else {
                        this._validation_fail(" Data error: Key with no value error" + 
                                " in incoming Data parameter");
                        return false;
                    }
                }
            }
        }
        return true;
    },

    _build_array_of_objs : function () {
        var $dd_span = this,
            ary_of_objs = [];
        if (this.options.MenuOptionsType === 'Navigate') {
            this._build_array_of_objs_menu();
            return;
        }
        if (typeof $dd_span.options.Data[0] === 'string') {
            /*--  take 1 dimensional array and make array of objs  --*/
            /*jslint unparam: true*/
            ary_of_objs = $.map($dd_span.options.Data, function (k, v) {
                return { ky: k, val: k };
            });
            /*jslint unparam: false*/
        } else {
            $.each($dd_span.options.Data, function (key, value) {
                if ($.isPlainObject($dd_span.options.Data[0])) { 
                    /*--  make sure objects follow {ky: "key", "val:"value} pattern --*/
                    if ($dd_span._obj_create(ary_of_objs, value) === false) { 
                             return false; 
                    } 
                } else if (!$.isArray($dd_span.options.Data)) { 
                    /*--  if (!$.isArray($dd_span.options.Data)) {  --*/
                    // handle single object
                    ary_of_objs.push({ ky: key, val: value });
                } else if ($.isArray($dd_span.options.Data[0])) {
                    // handle array of arrays
                    $dd_span._obj_create(ary_of_objs, value);
                }
                $dd_span.total_rec_cnt += 1;
             });
        }
        this.orig_objs = this.ary_of_objs = ary_of_objs;
    },

    _run_menu_item : function (e) {
        // the replace below is to strip out images
        var SelectedCellValue = $(e.target).text(),
            hilited = $('.CrEaTeDtAbLeStYlE tr td.mo'),
            MatchedObjects = [];
        if (hilited.length > 0) {
            SelectedCellValue = hilited.text();
        }
        MatchedObjects = $.grep(this.ary_of_objs, function (rec) {
            return SelectedCellValue === rec.val.replace(/^< *img[\w\W]*?>/, '');
        });
        if (MatchedObjects && MatchedObjects.length > 0) {
            if ($.isFunction(MatchedObjects[0].ky)) {
                MatchedObjects[0].ky.call();
            } else {
                if (!$(e.target).attr('class').match(/^ *divider *$/i)) {
                    if (/^new$/i.test(this.options.Window)) {
                        window.open(MatchedObjects[0].ky);
                    } else {
                        window.open(MatchedObjects[0].ky, "_self");
                    }
                }
            }
        }
    },

    _choice_selected : function (e) {
        var $dd_span = this,
            newVal = '';
        if (/^ *divider *$/i.test($(e.target).attr('class'))) {
            return;
        }
        this.cached['.dropdownspan'].remove();
        // dup click event sent (???), screen out 2nd
        if ($(e.currentTarget).text() === this._prev_target &&
                e.pageX === this.options._prevXY.X &&
                e.pageY === this.options._prevXY.Y) {
            return;
        }
        this._prev_target = $(e.currentTarget).text();
        this.options._prevXY.X = e.pageX;
        this.options._prevXY.Y = e.pageY;
        this.options._prev_event = e.type;
        $dd_span = this;
        if ($dd_span.options.MenuOptionsType === 'Select') {
            newVal = $.trim($(e.currentTarget).text());
            $dd_span.element.val(newVal);
            $dd_span._trigger("onSelect", $dd_span, {
                "newCode" : $(e.target).attr('menu_opt_key'),
                "newVal" : newVal,
                "type": "Click"
            });
            $dd_span.element.attr('menu_opt_key', $(e.target).attr('menu_opt_key'));
            e.target.className = e.target.className.replace(/ mo/, '');
        } else {
            this._run_menu_item(e);
        }
        /*--  reset mouseover class in the cached elements  --*/
        $(this.cached['.dropdowncells']).removeClass('mo');
        // once user clicks their choice, remove dropdown span from DOM
        $dd_span.cached['.dropdownspan'].remove();
        if (!this.options.DisableHiLiting) {
            $(this.element).css({'border-color' : this.options._orig_bc });
        }
    },

    _calcDropBoxCoordinates : function () {
        // figure out the coords of the select box
        // ( the top & bottom adjustments provide overlap between 
        // element & drop down||right )
        this.options._menu_box.top = this.cached['.dropdownspan'].position().top;
        this.options._menu_box.bottom = this.options._menu_box.top + 
            this.cached['.dropdownspan'].height();
        this.options._menu_box.left = this.cached['.dropdownspan'].position().left;
        this.options._menu_box.right = this.options._menu_box.left + 
            this.cached['.dropdownspan'].width();
    },

    _didMouseExitDropDown: function (e) {
        // this is where mouse is inside drop down 
        if (e.pageX + 1  > this.options._menu_box.left  &&
                e.pageX  < this.options._menu_box.right - 1 &&
                e.pageY + 1 > this.options._menu_box.top &&
                e.pageY  < this.options._menu_box.bottom) {
            return false;
        }
        return true;
    },

    _removeDropDown : function (e) {
        if (/Navigate/.test($(this.options)[0].MenuOptionsType) &&
                (/mouseleave/.test(e.type))) {
            $(this.options)[0]._curr_img = null;
        }
        this.options._prev_event = e.type;
        // prevent 2 calls in a row (we trigger one by calling .blur() )
        if (e.type === 'blur' && this.options._prev_event === 'mouseleave') {
            return;
        }
        // is the mouse over the drop down? If not, remove it from DOM
        if ($('span#SP_' + this.options._ID).length) {
            if (this._didMouseExitDropDown(e) === true) {
                this.cached['.dropdownspan'].remove();
            }
        }
    },

    _resetOffsetOfDropDown: function () {
        // If the menu width was changed, 
        //    test to see if it changed it's original offsets
        // If it did, re-align menu to parent element
        if (this.menu_start_loc.left !==
                this.cached['.dropdownspan'].offset().left ||
                this.menu_start_loc.top !==
                this.cached['.dropdownspan'].offset().top) {
            if (this.cached['.dropdownspan'] &&
                    this.cached['.dropdownspan'][0]) {
                this.options._width_adj.width_adjustment =
                    parseInt(this.cached['.dropdownspan'][0].style.left, 10) +
                    ((this.options._width_adj.width_after_adj -
                        this.options._width_adj.width_menu) / 2);
                this.cached['.dropdownspan'].css({ 'left':
                        this.options._width_adj.width_adjustment });
            }
        }
    },

    _addDropDownToDOM : function () {
        // only one dropdown at a time
        $('body span[id^="SP_menuoption"]').remove();
        this.dropdownbox
                .appendTo('body')
                .hide(1);
    },

    _show_drop_down : function (e) {
        var $dd_span = this,
            final_width = 0,
            showAt = this.options.ShowAt;

        this._addDropDownToDOM();
        this._get_n_set_width();
        if ( $('button.navbar-toggle').length && 
             /block/.test($('button.navbar-toggle').css('display')) && 
             $(this.element).closest('ul.navbar-nav').length ) {
             showAt = 'left+' + this.options.BootMenuOfs + ' top';
        }
        // show the menu
        $dd_span.cached['.dropdownspan']
            .stop(true, false)
            .show()
            .position({
                of :  this.element,
                my : 'left top',
                at : showAt,
                collision : 'flipfit'
            });
        final_width = parseInt($('span#SP_' + this.options._ID).css('width'), 10);
        $('span#SP_' + $dd_span.options._ID).css({ zIndex: 9999});
        if (this._use_scroller()) {
            $('span#SP_' + $dd_span.options._ID).css({'overflow-y': 'scroll',
                'overflow-x': 'hidden', 'width' : final_width + 18,
                'height': parseInt($dd_span.options.Height, 10)
                });
            $dd_span.cached['.dropdownspan']
                .stop(true, false)
                .show()
                .position({
                    of : this.element,
                    my : 'left top',
                    at : showAt,
                    collision : 'flipfit'
                });
        }
        $('table.CrEaTeDtAbLeStYlE').find('tr:even').addClass('even');
        $('table.CrEaTeDtAbLeStYlE').find('tr:odd').addClass('odd');
        this._refresh();
        this._calcDropBoxCoordinates();
    },

    _use_scroller : function () {
        // is a scroll bar needed here? returns true or false
        var final_ht = parseInt($('span#SP_' + this.options._ID).css('height'), 10);
        return (/Select/i.test(this.options.MenuOptionsType) && 
                /^\d+/.test(this.options.Height) && 
                parseInt(this.options.Height, 10) < final_ht);
    },

    _get_n_set_width : function () {
        var $dd_span = this,
            menu_width = parseInt($('span#SP_' + this.options._ID).css('width'), 10);
        $dd_span.menu_start_loc = $dd_span.cached['.dropdownspan'].offset();
        $dd_span.options._width_adj.width_menu = menu_width;
        $dd_span.options._width_adj.width_after_adj = (menu_width >
                $(this.element).width()) ?  menu_width : $(this.element).outerWidth();
        if ($dd_span.options.Width !== '' && $dd_span.options.Width !== 0) {
            // if user specified width, use that width
            $dd_span.options._width_adj.width_after_adj = (parseInt($dd_span.options.Width, 10));
        }
        $('span#SP_' + $dd_span.options._ID + ', span#SP_' + $dd_span.options._ID +
                    ' > table').css({  'width': $dd_span.options._width_adj.width_after_adj });
        if (this.options.ShowAt.match(/left[\w\W]*bottom[\w\W]*/i)) {
            $('span#SP_' + $dd_span.options._ID)
                    .offset({left : $(this.element).offset().left});
        } else {
            $('span#SP_' + $dd_span.options._ID)
                .offset({left : $(this.element).offset().left + $(this.element).outerWidth() });
        }
    },

});
