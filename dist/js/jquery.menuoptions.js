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
 * @copyright       Copyright (c) 2014-2016
 * @license         Menu Options jQuery widget is licensed under the MIT license
 * @link            http://www.menuoptions.org
 * @docs            http://menuoptions.readthedocs.org/en/latest/
 * @version         Version 1.7.5-10
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
        BootMenuOfs: 140,   // how far to left of expanded menu should dropdown appear
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#clearbtn
        ClearBtn: false,   // if set, will clear the input field to it's left
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#selectonly
        Data: '',  // pass in your array, object or array of objects here
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#columncount
        ColumnCount: 1, // display data in this number of columns
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        DataKeyNames: {}, // specify object keys that contain desired data
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        DisableHiLiting : false, // set to false to enable autocomplete highlighting
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#filters
        Filters: [], // header filters (pass mouse over them & they filter choices)
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#height
        Height: '', // let user specify the exact height they want
        Help: '', // prompt to show expected input
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#initialvalue
        Justify : 'left', // allows initial value ot be set
        InitialValue : {}, // allows initial value ot be set
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#menuoptionstype
        MenuOptionsType: 'Select', //or Navigate (run JS,follow href) or Rocker (for binary choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#showat
        ShowAt: 'bottom', // 'bottom' or 'right' are the options
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        SelectOnly: false,  // if true, will not allow user to type input
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#data
        ShowDownArrow : "black", // set to None to hide down arrow on menus, else pass in color of arrow
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#showdownarrow 
        UseValueForKey: false, // if user wants value = text()
        Mask : '', 
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#width
        Width: '', // let user specify the exact width they want
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#window
        Window : "repl", // "repl" means replace current window, new mean open new browser window
        _mask: {},
        _ID: 'UnIqDrOpDoWnSeLeCt', // will be substituted later by the eventNamespace
        _bootstrap: false, // make changes if in bootstrap 3
        _vert_ofs : 0,
        _prev : { 'event': '', 'text': '' },
        _mask_status : { mask_only: false, mask_passed : false },
        _CurrentFilter : '',
        _currTD : [ 0, 1 ],
        _event_ns : '',
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

        if ( /invalid/i.test(this._test_mask_cfg()) ) {
            return this._validation_fail('MenuOptions requires the Data parameter to be populated','fatal');
        }

        if (this.options.ColumnCount < 1) {
            return this._validation_fail('MenuOptions requires ColumnCount parameter be > 0','fatal');
        }

        if ( this.options._mask_status.mask_only === false ) {
            this._check_for_bootstrap();

            // make sure incoming data is in required format
            this._build_array_of_objs();
            if (this.orig_objs === false) {
                return this._validation_fail('Invalid Data format supplied to menuoptions','fatal');
            }

            if (/Rocker/i.test(this.options.MenuOptionsType) && this.orig_objs.length !== 2) {
                    return this._validation_fail('When using the rocker control, exactly 2 elements need to be supplied to menuoptions','fatal');
            }
        }

        this._setOptions( this.options );  

        this._bind_events();

        this._refresh(); 

        this._detect_destroyed_input();

        $(this.element).addClass('ui-menuoptions');
    },

    _test_mask_cfg : function () {
        if (this.options.Data.toString() === '' && this.options.Mask === '') {
                return 'invalid';
        } else if ( this.options.Data.toString() === '' && this.options.Mask.length > 0 ) {
            this.options._mask_status.mask_only = true;
            return 'mask';
        } else if ( this.options.Data.toString() !== '' && this.options.Mask.length > 0 ) {
            return 'mask_and_autocomplete';
        } else if ( this.options.Data.toString() !== '' && this.options.Mask.length === 0 ) {
            return 'autocomplete';
        }
    },

    _add_clear_btn : function () {
        var ClrBtn = '', id = '';
        if (this.options.ClearBtn && /Select/.test(this.options.MenuOptionsType)) {
            id = 'CB_' + this.options._ID;
            if ( $('span#'+id).length === 0 ) {
                ClrBtn = '<span class="clearbtn" id=' + id + '>X</span>'; 
                $(this.element).after(ClrBtn);
            }
            $("span#"+id).position({ of: $(this.element), my:'center center', at:'right-10' });  
        }
        this._show_help();   
        this.cached['.clearBtn']=$('span#CB_' + this._event_ns);
    },

    _show_help : function () { // show mask and help prompts here
        var id = 'HLP_' + this.options._ID,
            help_msg = this.options._mask.hasOwnProperty('Help') ? this.options._mask.Help : '';
        if ( $('span#'+id).length === 0 ) {
            var HelpTxt = '<span class=helptext id=' + id +'>'+help_msg+'</span>'; 
            $(this.element).after(HelpTxt);
            $("span#"+id).position({ of: $(this.element), my:'center center-8', at:'right+4' });
        }
        $('span#'+'HLP_'+this.options._ID).hide(); 
    },


    _validation_fail : function (err_msg, severity) {
        var prefix = "input id #"+ $(this.element).attr('id') + ": ";
        alert(prefix + err_msg);
        if (/fatal/i.test(severity) ) {
            this._destroy();
        }
        return false;
    },

    _mask_vars : function() {
        return {
            'HH:MM AM' : { 
                'MaxLen' : 8,
                'Help': 'HH:MM AM',     
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'H:M'}); } },
                'valid' : { 1: { max_val: 1}, 
                            2: function( val,obj ) { return /1/.test(val[0]) ? obj._day_test(val,2,1) : obj._day_test(val,9,1); },
                            4: { max_val : 5}, 5: { max_val : 9}, 
                            7: function( val,obj ) {return obj._is_char_valid(val,'AP','A or P only', 'one_char', 6);},
                            8: function( val,obj ) {return obj._is_char_valid(val,'M','M only', 'one_char', 7); }
                            },
                'consts' : { 3: ':', 6: ' ', 8:'M'},
                'Whole' : function( val, obj ) { if (/^[01][0-9]:[0-5][0-9] [AP]M$/.test(val)) {return [true,''];} else {return [false,'invalid time'];} }
            },
            'Mon DD, YYYY' : { 
                'MaxLen' : 12,
                'Help': 'Mon DD, YYYY',     
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'MdY'}); },
                             2: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':2, 'fmt': 'MdY'}); } },
                'valid' : { 1: function( val, obj ) { return obj._is_char_valid(val,'JFMASOND','invalid month', 'one_char',0); },
                            2: function( val, obj ) { return obj._is_char_valid(val.substring(0,2),'Ja|Fe|Ma|Ap|Ju|Au|Se|Oc|No|De','invalid month', 'string', 0); },
                            3: function( val, obj ) { return obj._is_char_valid(val.substring(0,3),'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec','invalid month', 'string', 0); },
                            5: function( val, obj ) { return obj._get_days(val,'MdY'); },
                            6: function( val, obj ) { return obj._get_days(val,'MdY'); },
                            9: { max_val: 9 },
                            10: { max_val: 9 },
                            11: { max_val: 9 },
                            12: { max_val: 9 } },
                'consts' : { 4: ' ', 7:',', 8:' '},
                'Whole' : function( val, obj ) { return obj._get_days(val,'MdY'); }
            },
            'YYYYMMDD' : { 
                'MaxLen' : 8,
                'Help': 'YYYYMMDD',     
                'hotkey' : { 1: function( val,obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'YMD'}); } }, 
                'valid' : { 1: { max_val: 9 },
                            2: { max_val: 9 },
                            3: { max_val: 9 },
                            4: { max_val: 9 },
                            5: { max_val: 1 },
                            6: function( val,obj ) { return /1/.test(val[4]) ? obj._day_test(val,2,5) : obj._day_test(val,9,5); },
                            7: function( val, obj ) { return obj._get_days(val,'YMD'); },
                            8: function( val, obj ) { return obj._get_days(val,'YMD'); } }, 
                'Whole' : function( val, obj ) { return obj._get_days(val,'YMD'); }
            },
            '(999) 999-9999' : { 
                'MaxLen' : 14,
                'Help': '(999) 999-9999',
                'valid' : { 'all' : { max_val: 9 }},
                'initial' : { 'val' : '(', 'ofs' : 0 },
                'consts' : { 1: '(', 5:')', 6:' ', 10:'-'},
                'Whole' : '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$'
            },
            '$0,000.00' : { 
                'Help': '$0,000.00',
                'valid' : { 'all' : function( val,obj ) {return obj._check_money({ value: val, ofs : 3 }); } },
                'initial' : { 'val' : '$0.00', 'ofs' : 3 },
                'sep' : ',',
                'Whole' : '^\$\d{1,3}\.[0-9]{2}$|^\$(\d{1,3},)+\d{3}\.[0-9]{2}$'
            }
        };
    },

    _set_initial_mask_value : function () {
        var val, ofs;
        if ( this.cached['.mo_elem'].val().length === 0 ) {
            if ( this.options._mask.hasOwnProperty('initial') ) {
                if ( this.options._mask.initial.hasOwnProperty('val') ) {
                    val = this.options._mask.initial.val;
                    this.element.val(val);
                }
                if ( this.options._mask.initial.hasOwnProperty('ofs') ) {
                    ofs = val.length - this.options._mask.initial.ofs;
                    this.element.focus().get(0).setSelectionRange(ofs,ofs);
                    this.element.blur();
                }
            }
        }
    },

    _set_valid_mask : function () {
        var all_masks = this._mask_vars();
        if ( this.options.Mask.length > 0 ) {
            if ( all_masks.hasOwnProperty(this.options.Mask) ) {
                this.options._mask = all_masks[this.options.Mask];
                $(this.element).prop('maxLength', this.options._mask.MaxLen);
            } else {
                return this._validation_fail(this.options.Mask+" is not a valid mask.",'fatal');
            }
        }
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
        var matched = this._match_list_hilited({'StrToCheck': this.element.val(), 'chk_key': true, 'case_ins': false});
        if ( matched.length > 0 ) {
            var raw_val = matched[0].val.toString().replace(/<[\w\W]*?>/g, '');
            if (/Rocker/i.test(this.options.MenuOptionsType) ) {
                this._set_rocker ( matched, raw_val );
            } else {
                $(this.element).removeAttr('value');
                $(this.element).val(raw_val);
                $(this.element).attr('menu_opt_key', matched[0].ky);
                $(this.element).removeClass('data_error').addClass('data_good'); 
            }
        } else if ( $(this.element).val().length > 0 ) {
                $(this.element).removeClass('data_good').addClass('data_error'); 
        }
        this._add_clear_btn();
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
        if (/Rocker/i.test(this.options.MenuOptionsType) ) {
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
            } else {
                $(this.element).removeClass('data_error data_good');
            }
        }
    },

    _create_rocker : function () {
        var rtclass = "rtup",
            ltclass = "ltup",
            currval = this.cached['.mo_elem'].val();
        this.cached['.mo_elem'].hide();
        this.cached['.mo_elem'].next('span.clearbtn').hide();
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
        this.cached['.mo_elem'].parent().append("<div class=rocker id=RK_" + this._event_ns +
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
        this.__exec_trigger({ 'newCode': tgt.attr('menu_opt_key'),
                            'newVal' :  tgt.children().text(), 'type': "RockerClick" });
    },

    _set_rocker : function ( matchedRec, raw_val ) {
        this.cached['.mo_elem'].attr('menu_opt_key', matchedRec[0].ky);
        this.cached['.mo_elem'].val(raw_val);
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

    _change_rocker: function (target) {
        /*--  set key and value for hidden input control  --*/
        this.cached['.mo_elem']
            .attr('menu_opt_key', target.attr('menu_opt_key'));
        this.cached['.mo_elem'].val(target.find('span').text());
        if (/ltup/.test(target.attr('class'))) {
            $('div#RK_LT_' + this._event_ns).attr('class', 'ltdown');
            $('div#RK_RT_' + this._event_ns).attr('class', 'rtup');
        } else if (/rtup/.test(target.attr('class'))) {
            $('div#RK_LT_' + this._event_ns).attr('class', 'ltup');
            $('div#RK_RT_' + this._event_ns).attr('class', 'rtdown');
        }
    },

    _rocker_main : function (orig_val) {
        $('span#CB_' + this.options._ID).remove();
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
                this.options.InitialValue.ky.length > 0)) {
            retval = true;
        }
        return retval;
    },

    _detect_destroyed_input: function () {
        $(this.element).bind('remove', function () {
            this._destroy();
        });
    },

    __exec_trigger : function(params) {
        var newVal = $.trim(params.newVal);
        this.cached['.mo_elem'].val(newVal);
        this.cached['.mo_elem'].attr('menu_opt_key',params.newCode);
        this._trigger("onSelect", this, {
            "newCode": params.newCode,
            "newVal" : newVal,
            "type": params.type
        });
        if ( ! /Rocker/i.test(this.options.MenuOptionsType) ) {
            this.cached['.mo_elem'].removeClass('data_error').addClass('data_good'); 
            $("span#HLP_"+this.options._ID).show().html('&nbsp;').removeClass('helptext err_text').addClass('mask_match');
        }
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
                if (! $(e.target).hasOwnProperty('class') || ! /^divider$/i.test((e.target).attr('class'))) {
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
        if (/^ *divider *$/i.test($(e.target).attr('class'))) {
            return;
        }
        this.options._prev.event = e.type;
        if ( /Select/i.test(this.options.MenuOptionsType) ) {
            this.__exec_trigger({ 'newCode': $(e.target).closest('td').attr('menu_opt_key'),
                              'newVal' : $(e.target).closest('td').text(), 'type': "Click" });
        } else if ( /Navigate/i.test(this.options.MenuOptionsType)) {
            this._run_menu_item(e);
        }
        // once user clicks their choice, remove dropdown span from DOM
        $('span#SP_' + this.options._ID).remove();
        this.cached['.mo_elem'].focus();
    },

    _check_mask : function (e) {
        var val = this.cached['.mo_elem'].val();
        if ( val.length === this.options._mask.MaxLen ) {
            this._match_complete();
            return;
        }
        if (/input/.test(e.type)) {
             this._is_last_mask_char_valid(e, val);
        }
    },

    _match_complete : function () {
        if ( this.options._mask.hasOwnProperty('Whole') === false ||
             this.options._mask.hasOwnProperty('MaxLen') === false ) {
            return false;
        }
        var val = this.cached['.mo_elem'].val();
        if ( val.length === this.options._mask.MaxLen ) {
            if ( $.isFunction(this.options._mask.Whole)) {
                 var result = this.options._mask.Whole(val, this);
                 if ( result[0] === false ) {
                    this._valid_test(this.cached['.mo_elem'].val());
                 } else {
                    this.__set_help_msg('', 'completed');
                 }
                 return result[0];
            } else if ( new RegExp(this.options._mask.Whole).test(val) === true ) {
                 this.__set_help_msg('', 'completed');
                 return true;
            } else {
                this.options._mask_status.mask_passed = false;
                return false;
            }
        }
    },

    _build_match_ary : function (event, StrToCheck) {
        var matched = this._match_list_hilited({'StrToCheck': StrToCheck, 'chk_key': false, 'case_ins': true, evt: event});
        if ( /Select/.test(this.options.MenuOptionsType) && matched.length === 0 && this.options._CurrentFilter === '') {
            if ( this.options.Mask.length > 0 && this._is_last_mask_char_valid(event, StrToCheck) === true ) { 
                this._match_complete();
            } else {
                return this._match_list_hilited({'StrToCheck': this.cached['.mo_elem'].val(), 'chk_key': false, 'case_ins': true, evt: event});
            }
        }
        return matched;
    },

    _add_const : function (StrToCheck) {
        /*--  append constant value to end of string  --*/
        var str_len = StrToCheck.length;
        if (this.options._mask.hasOwnProperty('consts')) {
            for (var x = str_len; str_len < this.options._mask.MaxLen; str_len++) {
                if (this.options._mask.consts.hasOwnProperty(str_len+1)) {
                    this.cached['.mo_elem'].val(this.cached['.mo_elem'].val()+this.options._mask.consts[str_len+1]);
                    this._match_complete();
                } else {
                    break;
                }
            }
        }
    },

    _match_list_hilited : function (params) {
        if ( /Select|Rocker/.test(this.options.MenuOptionsType) && params.StrToCheck.length === 0 ) {
            return [];
        }
        var origImg = "",
            no_img='',
            newval = "",
            re = /(\{|\}|\\|\*|\(|\))|\[|\]/g;
        if ( !/Navigate/i.test(this.options.MenuOptionsType) ) {
            params.StrToCheck=params.StrToCheck.replace(re, '\\$&');
        }
        var RegExStr = params.case_ins ? new RegExp(params.StrToCheck, 'i') : new RegExp(params.StrToCheck);
        var matching = $.map(this.orig_objs, function (o) {
            no_img = o.val.replace(/<img[\w\W]*?>/, '');
            if ( params.chk_key && RegExStr.test(o.ky.toString())) {
                return o;
            }
            if ( RegExStr.test(no_img) ) {
                newval = no_img.replace(RegExStr, '<span style="color:brown;font-size:110%;">' +
                        RegExStr.exec(no_img)[0] + '</span>');
                origImg = o.val.match(/<img[\w\W]*?>/);
                if (origImg) {
                    newval = origImg + newval;
                }
                return { ky: o.ky, val: newval };
            }
        });
        if ( this.options._CurrentFilter.length === 0 ) {
            this.__check_match_results(matching, params.StrToCheck, params.evt);
        }
        return matching;
    },

    __check_match_results : function (matching, StrToCheck, e) {
        if ( matching.length === 0 ) { 
            this._check_whole_input(StrToCheck);
        } else {
            if ( StrToCheck === matching[0].val.replace(/<span[\w\W]*?>|<\/span>/g,'') ) {
                this.__set_help_msg('', 'completed');
            } else if ( matching.length > 1 ) {
                this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
            } else {
                this.__set_help_msg('', 'good');
            }
        }
    },

    __set_help_msg : function (help_msg, err_or_good) {
        switch ( err_or_good ) {
            case 'error':
                $("span#HLP_"+this.options._ID).show()
                        .html('<span style="margin-left:16px">'+help_msg+"</span>")
                        .removeClass('helptext mask_match').addClass('err_text');
                this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
                this.options._mask_status.mask_passed = false;
                break;
            case 'completed': 
                if ( $("span#HLP_"+this.options._ID).hasClass('mask_match')) {
                    $("span#HLP_"+this.options._ID).show();
                    return;
                }
                this.cached['.mo_elem'].removeClass('data_error').addClass('data_good'); 
                $("span#HLP_"+this.options._ID).show().html('&nbsp;').removeClass('helptext err_text').addClass('mask_match');
                var val = this.cached['.mo_elem'].val();
                this.options._mask_status.mask_passed = true;
                this.__exec_trigger({ 'newCode': val, 'newVal' : val, 'type': "Completed" }); 
                this.options._mask_status.mask_passed = true;
                break;
            case 'good':
                help_msg = this.options._mask.hasOwnProperty('Help') ? this.options._mask.Help : '';
                $("span#HLP_"+this.options._ID).show().html(help_msg)
                    .removeClass('err_text mask_match').addClass('helptext');
                break;
        }
        if ( this.cached['.mo_elem'].val().length === 0 ) {
           this.cached['.mo_elem'].removeClass('data_good data_error');
        } else if ( this.cached['.mo_elem'].val().length < this.options._mask.MaxLen ) {
           this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
        }
    },

    _matches : function(StrToCheck, exact) {
        var re = /(\{|\}|\\|\*|\(|\))|\[|\]/g;
        StrToCheck=StrToCheck.replace(re, '\\$&');
        return $.map(this.orig_objs, function (o) { 
            if (exact === 'exact' && StrToCheck === o.val.replace(/<img[\w\W]*?>/, '')) { return o; }
            else if (exact === 'partial' && new RegExp(StrToCheck).test(o.val.replace(/<img[\w\W]*?>/, ''))) { return o; }
        });
    },

    _check_whole_input : function (StrToCheck) {
        var str_len = this.cached['.mo_elem'].val().length;
        for (var x = str_len; str_len > 0; str_len--) {
            if ( this.options.Data !== ""  && this._matches(this.cached['.mo_elem'].val(), 'partial').length === 0 ||
                 this.options.Mask.length > 0 ) {
                    if ( this.options.Mask.length > 0 ) {
                        this._single_char_valid_mask(this.cached['.mo_elem'].val(), str_len);
                    } else {
                        this._cut_last_char('invalid char', this.cached['.mo_elem'].val().length);
                    }
            }
        }
        if ( StrToCheck.length === this.cached['.mo_elem'].val().length && this.options._mask_status.mask_passed) {
            this.__set_help_msg('', 'good');
        }
    },

    _cut_last_char : function (err_msg, str_len) {
        this.cached['.mo_elem'].val(this.cached['.mo_elem'].val().substring(0,str_len-1));
        this.options._mask_status.mask_passed = false;
        this.__set_help_msg(err_msg, 'error');
    },

    _single_char_valid_mask : function ( StrToCheck, str_len) {
        if ( this.options._mask.hasOwnProperty('consts') && this.options._mask.consts[str_len] ) {
            if ( this.cached['.mo_elem'].val().substring(str_len-1,str_len) !== this.options._mask.consts[str_len]) {
                this.cached['.mo_elem'].val(this.cached['.mo_elem'].val().substring(0,str_len-1));
            } 
        } else if ( this.options._mask.hasOwnProperty('valid') && this.options._mask.valid.hasOwnProperty(str_len) || 
                    this.options._mask.hasOwnProperty('valid') && this.options._mask.valid.hasOwnProperty('all')) {
            var valid_tst = this.options._mask.valid.hasOwnProperty('all') ? this.options._mask.valid.all :
                            this.options._mask.valid[str_len];
            if ( $.isFunction(valid_tst)){
               var val_passed = valid_tst(this.cached['.mo_elem'].val(),this);
               this.options._mask_status.mask_passed = this.options._mask_status.mask_passed === false ? false : val_passed[0];
               if ( val_passed[0] === false ) {
                    this._cut_last_char(val_passed[1], str_len);
                    return false;
               }
            } else if (valid_tst.hasOwnProperty('max_val')) {
                var max_val = valid_tst.max_val;
                if ( ! new RegExp('[0-'+max_val+']').test(this.cached['.mo_elem'].val()[str_len-1])) {
                    this._cut_last_char('0 - '+max_val+' only', str_len);
                    return false;
                }
            }
        }
        return true;
    },

    _valid_test : function (StrToCheck) {
        if ( StrToCheck.length > this.options._mask.MaxLen ) {
            this.cached['.mo_elem'].val(StrToCheck.substring(0, this.options._mask.MaxLen));
        }
        this._check_whole_input(this.cached['.mo_elem'].val());
        this._add_const (this.cached['.mo_elem'].val());
        if ( $("span#HLP_"+this.options._ID).hasClass('mask_match')) {
            this.__set_help_msg('', 'good');
        }
        if (this.options._mask.hasOwnProperty('MaxLen') && 
            this.cached['.mo_elem'].val().length > 0 && 
            this.cached['.mo_elem'].val().length < this.options._mask.MaxLen ) {
                this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
        }
        return true; 
    },

    _is_last_mask_char_valid : function (e, StrToCheck) {
        if ( StrToCheck.length > this.options._mask.MaxLen ) {
            this.cached['.mo_elem'].val(StrToCheck.substring(0, this.options._mask.MaxLen));
            return true;
        }
        if ( this.options._mask.hasOwnProperty('hotkey') &&
             this.options._mask.hotkey.hasOwnProperty(StrToCheck.length)) {
               if (this.options._mask.hotkey[StrToCheck.length](StrToCheck,this) === true) {
                    this.__set_help_msg('', 'good');
                    return true;
               }
        }
        if ( this.options.Mask.length > 0 ) {
            this._valid_test(StrToCheck);
        } else {
            this._check_whole_input(this.cached['.mo_elem'].val());
        }
    },

    _process_matches : function (event, StrToCheck) {
        var matching = [];
        if (StrToCheck !== '') {
            matching = this._build_match_ary(event, StrToCheck); 
            this.cached['.dropdownspan'].remove();
        }
        if (matching.length > 0) {
            // re-create drop down select
            this._build_filtered_dropdown(event, matching);
        } else {
            this._build_whole_dropdown(event);
        }
    },

    _check_money : function ( params ) {
        var cur_val = this.cached['.mo_elem'].val(),
            ofs = cur_val.length - this.options._mask.initial.ofs;
        this.element.focus().get(0).setSelectionRange(ofs,ofs);
        return [true, '0 - 9 only'];
    },

    _tab_and_enter_keypress : function (e, curVal) {
        if ( e.keyCode === $.ui.keyCode.ENTER ) {
            e.preventDefault();
            this.__exec_trigger({ 'newCode': $('table.CrEaTeDtAbLeStYlE td:first').attr('menu_opt_key'), 
                        'newVal' : $('table.CrEaTeDtAbLeStYlE td:first').text(), 'type': "ENTERKey" }); 
        } else if (e.keyCode === $.ui.keyCode.TAB ) {
            if ( curVal.length > 0) {
                var matched =  this._build_match_ary(e, curVal);
                if ( matched.length > 0 ) {
                    this.__exec_trigger({ 'newCode': $('table.CrEaTeDtAbLeStYlE td:first').attr('menu_opt_key'), 
                                'newVal' : $('table.CrEaTeDtAbLeStYlE td:first').text(), 'type': "TABKey" }); 
                } else if ( this._match_complete() === true ) {
                    this.__exec_trigger({ 'newCode': curVal, 'newVal' : curVal, 'type': "TABKey" }); 
                }
            } 
        } 
        this.__set_help_msg('', ''); 
    },

    _clear_filter : function (e) {
         this.options._CurrentFilter = '';
    },

    _bind_events: function () {
        var ky = '',
             Sel = {}; 
        // set mouseenter class for table cell
        ky = 'mouseenter span#SP_' + this.options._ID + ' table.CrEaTeDtAbLeStYlE td.dflt'; 
        Sel[ky] = '_hiLiteOnOff'; 
        /*--  header filter logic  --*/
        ky = 'mouseenter span#SP_' + this.options._ID + ' table#HF_' + this._event_ns + ' td.hf_td'; 
        Sel[ky] = '_run_header_filter'; 
        /*--  remove dropdown if navbar-toggle clicked --*/
        ky = 'click button.navbar-toggle'; 
        Sel[ky] = '_remove_dropdown';
        // when user chooses (clicks), insert text into input box
        ky = 'mousedown span#SP_' + this.options._ID + ' table.CrEaTeDtAbLeStYlE td ';
        Sel[ky] = '_choice_selected';
        // when mouse leaves the container, remove it from DOM
        ky = 'mouseleave span#SP_' + this.options._ID;
        Sel[ky] = '_remove_dropdown';
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
            'touchend':  '_build_whole_dropdown',
            'mousedown':  '_build_whole_dropdown',
            'click':  '_build_whole_dropdown',
            'mouseenter':  '_build_whole_dropdown',
            'focus':  '_build_whole_dropdown',
            'keypress': '_build_whole_dropdown',
            'keydown': '_build_whole_dropdown',
            'input': '_build_whole_dropdown',
            'keyup': '_build_whole_dropdown',
            'search':  '_build_whole_dropdown',
            'mouseleave':  '_remove_dropdown',
            'blur': '_remove_dropdown',
        });
    },

    _clearInput : function (e) {
        var $this=this;
        if ( ! $(this.element).prop('disabled') ) {
            $(this.element).attr('menu_opt_key', '');
            $(this.element).val('');
            setTimeout( function() {
                $($this.element).focus(); //chrome needs delay
            }, 80 );
            this._set_initial_mask_value();
            this.cached['.mo_elem'].removeClass('data_good data_error');
        }
    },

    _arrow_keys : function (event) {
        var arr_key_pressed = false,
            row = this.options._currTD[0],
            col = this.options._currTD[1],
            highlited = $('.CrEaTeDtAbLeStYlE tr td.mo');
        if (/keydown|keyup/.test(event.type)) {
            if (/keyup/.test(event.type) && /^(37|38|39|40|8)$/.test(event.keyCode)) {
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
            case $.ui.keyCode.BACKSPACE:
                event.preventDefault();
                this._back_space(this.cached['.mo_elem'].val());
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.ENTER:
                if (/divider/.test($(highlited).prop('class'))) {
                    arr_key_pressed = false;
                } else if (highlited.length > 0) {
                    if (/Select/.test(this.options.MenuOptionsType)) {
                        this.__exec_trigger({ 'newCode': $('.CrEaTeDtAbLeStYlE tr td.mo').attr('menu_opt_key'),
                               'newVal' : $('.CrEaTeDtAbLeStYlE tr td.mo').text(), 'type': "EnterKey" });
                    } else if (/keydown/.test(event.type)) {
                        this._run_menu_item(event);
                    }
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

    _back_space : function (val) {
        var str_len = val.length;
        for (var x = str_len; str_len > 0; str_len--) {
            if ( this.options._mask.hasOwnProperty('consts') &&
                this.options._mask.consts.hasOwnProperty(str_len) ) {
                if ( str_len > 1 ) {
                    $(this.element).val(this.cached['.mo_elem'].val().substring(0, str_len-1));
                }
                continue;
            } else {
                $(this.element).val(this.cached['.mo_elem'].val().substring(0, str_len-1));
                break;
            }
        }
        this.__set_help_msg('', 'good');
    },

    __set_prev : function (e) {
        this.options._prev.event = e.type; 
        this.options._prev.text = $(e.currentTarget).text();
    },

    _hiLiteOnOff : function (e) {
        if (e.type === this.options._prev.event && $(e.currentTarget).text() === this.options._prev.text) { 
             return this.__set_prev(e);
        } 
        this.__set_prev(e);
        if ($(e.target).attr('class')) {
            if ($(e.target).attr('class').match(/clearbtn/)) {
                if (e.type === 'mouseenter') {
                    $(e.target).addClass('ClearButtonMO');
                } else {
                    $(e.target).removeClass('ClearButtonMO');
                }
            }
            else if ($(e.target).attr('class').match(/ *dflt */)) {
                $('span table.CrEaTeDtAbLeStYlE td.dflt').removeClass('mo');
                $(e.target).addClass('mo');
            }
        }
    },

    // called when created, and later when changing options
    _refresh : function () {
        return;
    },

    _cache_elems : function () {
        this.cached['.dropdownspan']=this.dropdownbox;
        this.cached['.dropdowncells']=this.dropdownbox.find('td');
        this.cached['.mo_elem']=this.element;
    },

    _justify : function() {
        $(this.element).css({ 'text-align': this.options.Justify });
        if ( /right/i.test(this.options.Justify) ) {
            var new_rt_pad = parseInt($(this.element).css('padding-right')) + 12;
            new_rt_pad = new_rt_pad + "px";
            $(this.element).css({ 'padding-right': new_rt_pad });
        }
    },
    _recreate_mo : function() {
        var orig_val = $(this.element).val(),
            mo_type = this._test_mask_cfg();
        this._justify();
        if (/^mask_and|^autocomplete$/i.test(mo_type)) {
                this._build_array_of_objs();
        }
        if (/^mask/i.test(mo_type)) {
            this._set_valid_mask ();  
            this._add_clear_btn(); 
        } else { 
            if (/Rocker/i.test(this.options.MenuOptionsType) ) {
                this._rocker_main({ 'val' : orig_val });
            } else {
                if ($('div.rocker[id=RK_' + this._event_ns + ']').length) {
                    $('div.rocker[id=RK_' + this._event_ns + ']').remove();
                    $(this.element).show();
                    $(this.element).next('span.clearbtn').show();
                }
                if ( /Select/.test(this.options.MenuOptionsType) ) {
                    $(this.element).attr('autocomplete', 'off');
                    this._add_clear_btn(); 
                } else if ( /Navigate/.test(this.options.MenuOptionsType)) {
                    this._show_menu_arrs();
                }
                this._build_dropdown(this.orig_objs);
            }
         }
    },

    _setOptions : function ( options ) {
        this._setOption('_ID', this.eventNamespace.replace(/^\./, ''));
        this._event_ns = this.eventNamespace.replace(/^\./, '');
        this.cached={'.mo_elem':this.element}; 
        var $dd_span = this;
        if (/Select|Rocker/.test(this.options.MenuOptionsType) ) { 
            this.add_menuoption_key();
            if ( Object.keys(options).length === 0 ) {
                /*--  MenuOptions with no params will just run add_menuoption_key()   --*/
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
        this._recreate_mo();  
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

    __set_arrow : function ( direction ) {
        var arr_dir = /down/.test(direction) ? 'top' : 'left';
        $('span[id="arr_' + this.options._ID + '"]').remove();
        if ( $(this.element).children('span.ui-button-text').length > 0 ) {
            $(this.element).children('span.ui-button-text').append("<span id=arr_" + this.options._ID + " class=" + direction + "_arrow></span>");
        } else {
            this.element.append("<span id=arr_" + this.options._ID + " class=" + direction + "_arrow></span>");
        }
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
        this._runSort(ary_of_objs);
        this.orig_objs = this.ary_of_objs = ary_of_objs;
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

    _build_array_of_objs_menu : function () {
        var ary_of_objs = [];
        if (!$.isArray(this.options.Data)) { 
            $.each(this.options.Data, function (key, value) {
                // handle single object
                ary_of_objs.push({ ky: value, val: key });
            });
        } else {
            // reverse key value pair 
            ary_of_objs = $.map(this.options.Data, function (k) {
                return { ky: k[Object.keys(k)[0]], val: Object.keys(k)[0]};
            });
        }
        this._runSort(ary_of_objs);
        this.orig_objs = this.ary_of_objs = ary_of_objs;
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
            return this._validation_fail(" Data error: DataKeyNames is invalid "+
                                  " (it only matched "+valid_kys.length+
                                  " keys in the Data parameter)",'fatal');
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

    _set_showat : function () {
        if (this.options.ShowAt.match(/^ *bottom *$/i)) {
            this._setOption('ShowAt', 'left bottom-2' );
        } else if (this.options.ShowAt.match(/^ *right *$/i)) {
            this._setOption('ShowAt', 'right-2 top');
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
            menu_pos = /bottom/.test(this.options.ShowAt) ? 'bot' : 'rt';

        // sort as per default or user specification
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
        buffer = '<table class=CrEaTeDtAbLeStYlE cellpadding=4px>\n' + buffer + '</table>';
        if (this.options.Filters.length && this.cached['.mo_elem'].val().length === 0) {
            buffer = this._createFilterHeader() + buffer;
        }
        if ( $('button.navbar-toggle').length && 
             /block/.test($('button.navbar-toggle').css('display')) && 
             this.cached['.mo_elem'].closest('ul.navbar-nav').length ) {
             menu_pos = "rt";
        }
        html = '<span class=' + this.options.MenuOptionsType + menu_pos + ' id=SP_' + this.options._ID + '>' + buffer + '\n</span>';
        return html;
    },

    _build_filtered_dropdown : function (event, matching) {
        /*--  console.log("filtered cnt = "+matching.length);  --*/
        this._build_dropdown( matching );
        this._show_drop_down(event);
    },

    _build_dropdown: function (ary_of_objs) {
        this.options._currTD = [0, 1];
        var tablehtml = this._create_table(ary_of_objs);
        this.dropdownbox = $(tablehtml);
        this._cache_elems();
        this._calcDropBoxCoordinates();
    },

    _mask_only : function (e) {
        if ( this.options.Mask.length > 0 ) {
            if ( /keyup|input/.test(e.type)) {
                this._check_mask(e, this.cached['.mo_elem'].val());
            }
            if ( /focus/.test(e.type)) {
                this._add_const (this.cached['.mo_elem'].val());
                this.__set_help_msg('', 'good');
            }
        }
    },
    _build_drop_down_test : function (e) {
        if (e.type === this.options._prev.event && $(e.currentTarget).text() === this.options._prev.text) { 
             this.__set_prev(e);
             return false;
        } 
        this.__set_prev(e);
        if (/click/.test(e.type)) {  
            this.cached['.mo_elem'].val(this.cached['.mo_elem'].val());
        }
        this._mask_only(e);
        if (e.type === 'search') { // clear menu_opt_key when input is cleared
            this.cached['.mo_elem'].attr('menu_opt_key', '');
        }
        if (/keydown|keyup/.test(e.type) && this._arrow_keys(e) === true && e.keyCode !== $.ui.keyCode.BACKSPACE) {
            return false;
        }
        if (/keydown/.test(e.type) && e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.TAB) {  
            this._tab_and_enter_keypress(e, this.cached['.mo_elem'].val());
            $("span#HLP_"+this.options._ID).hide();
            return false;
        }  
        if (/keydown|mousedown|click/.test(e.type)) {  
            /*--  only focus and keyup create a dropdown (otherwise multiple calls to dropdown logic)  --*/
            $("span#HLP_"+this.options._ID).show();
            return false;
        }
        if (this.options.Data === "" ) {
            return false;
        }
        return true;
    },

    _build_whole_dropdown : function (e) {
        if ( this._build_drop_down_test(e) === false ) {
            return;
        }
        var curVal = this.cached['.mo_elem'].val();
        /*--  console.log("type = "+e.type+" code = "+e.keyCode);  --*/
         if (/mouseenter|focus|input/.test(e.type) || /keyup/.test(e.type) && e.keyCode === $.ui.keyCode.BACKSPACE) {
            /*--  console.log("building ac");  --*/
            var matched;
            if ( curVal.length === 0 ) {
                matched = this.orig_objs;
            } else {
                matched = this._match_list_hilited({'StrToCheck': curVal, 'chk_key': false, 'case_ins': true, 'evt': e});
            }
            this._build_filtered_dropdown (e, matched );
            return;
         } 
    },

    _run_header_filter : function (e) {
        if (e.type === this.options._prev.event && $(e.currentTarget).text() === this.options._prev.text) { 
             this.__set_prev(e);
             return false;
        } 
        this.__set_prev(e);
        if (this.cached['.mo_elem'].val().length) {
            // disable mouseover filters if user started entering data
            return;
        }
        // get text from header filter <td>
        var SearchStr = $(e.currentTarget).text();
        this.options._CurrentFilter = $(e.currentTarget).text();
        if ($.isPlainObject(this.options.Filters[0])) {
            if ($(e.currentTarget).attr('menuopt_regex')) {
                SearchStr = $(e.currentTarget).attr('menuopt_regex');
                this._process_matches(e,  SearchStr);
            } else if ($(e.currentTarget).text().match(/\(all\)/i)) {
                this._build_dropdown(this.orig_objs);
                this._show_drop_down(e);
            } else {
                this._validation_fail('Filter key ' + $(e.currentTarget).text() +
                    'does not have a matching regular expression','warning');
            }
        } else { // assume array of scalars
            if ($.inArray(SearchStr, this.options.Filters) > -1) {
                this._process_matches(e,  SearchStr);
            } else {
                // if filter is not in list, user passed over ALL
                this._build_whole_dropdown(e);
            }
        }
        this.options._CurrentFilter = '';
    },

    _createFilterHeader : function () {
        var TDary = [],
            p = [];
        if (!$.isPlainObject(this.options.Filters[0])) {
            TDary = $.map(this.options.Filters, function (obj) {
                return '\t<td class=hf_td>' + obj + '</td>\n';
            });
            TDary.unshift('\t<td class=hf_td>(all)</td>\n');
        } else {
            /*jslint unparam: true*/
            $.each(this.options.Filters, function (key, value) {
                p = $.map(value, function (v, i) {
                    return i;
                });
                TDary.push('\t<td class=hf_td id=hdr_fltr' + p[0] +
                        ' menuopt_regex="' + value[p[0]] + '">' + 
                        p[0] + '</td>\n');
            });
            /*jslint unparam: false*/
            TDary.unshift('\t<td class=hf_td id=hdr_fltrAll>(all)</td>\n');
        }
        return '\n<table id=HF_' + this._event_ns + ' class=HdrFilter>\n<tr>\n' + 
            TDary.join('') + '</tr>\n</table>\n';
    },

    __scroll : function (row) {
        var row_top = 0, row_ht = 0, vis_ht = 0, vis_top = 0;
        if ( $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(' + row + ')').length === 0 ) {
            return;
        } else {
            row_top = $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(' + row + ')').offset().top;
            row_ht = $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(' + row + ')').height();
            vis_ht = $('span#SP_' + this.options._ID).height();
            vis_top = $('span#SP_' + this.options._ID).offset().top;
            if (vis_top > row_top) {
                this.options._vert_ofs -= row_ht;
                $('span#SP_' + this.options._ID).scrollTop(this.options._vert_ofs);
            } else if (vis_top + vis_ht < row_top + row_ht) {
                this.options._vert_ofs += row_ht;
                $('span#SP_' + this.options._ID).scrollTop(this.options._vert_ofs);
            }
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

    _didMouseExitDropDown : function (e) {
        // this is where mouse is inside drop down 
        if (e.pageX + 1  > this.options._menu_box.left  &&
                e.pageX  < this.options._menu_box.right - 1 &&
                e.pageY + 1 > this.options._menu_box.top &&
                e.pageY  < this.options._menu_box.bottom) {
            return false;
        }
        return true;
    },

    _remove_dropdown : function (e) {
        this.options._prev.event = e.type;
        // prevent 2 calls in a row (we trigger one by calling .blur() )
        if (e.type === 'blur' && /mouseleave/.test(this.options._prev.event)) {
            return;
        }
        // is the mouse over the drop down? If not, remove it from DOM
        if ($('span#SP_' + this.options._ID).length) {
            if (this._didMouseExitDropDown(e) === true) {
                /*--  console.log("removing a/c type= "+e.type);  --*/
                this.cached['.dropdownspan'].remove();
            }
        }
        $("span#HLP_"+this.options._ID).hide(); 
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
             this.cached['.mo_elem'].closest('ul.navbar-nav').length ) {
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
                this.cached['.mo_elem'].width()) ?  menu_width : this.cached['.mo_elem'].outerWidth();
        if ($dd_span.options.Width !== '' && $dd_span.options.Width !== 0) {
            // if user specified width, use that width
            $dd_span.options._width_adj.width_after_adj = (parseInt($dd_span.options.Width, 10));
        }
        $('span#SP_' + $dd_span.options._ID + ', span#SP_' + $dd_span.options._ID +
                    ' > table').css({  'width': $dd_span.options._width_adj.width_after_adj });
        if (this.options.ShowAt.match(/left[\w\W]*bottom[\w\W]*/i)) {
            $('span#SP_' + $dd_span.options._ID)
                    .offset({left : this.cached['.mo_elem'].offset().left});
        } else {
            $('span#SP_' + $dd_span.options._ID)
                .offset({left : this.cached['.mo_elem'].offset().left + this.cached['.mo_elem'].outerWidth() });
        }
    },

    _day_test : function (val, maxval, offset) {
        if (/\d/.test(val[offset]) && val[offset] <= maxval ) {
            return true;
        } 
        return [false, '0 - '+maxval+' only'];
    },


    _parse_days : function (val,dom_pos, maxdays) {
        if ( val.length === dom_pos ) {
            return this._day_test(val, maxdays[0], val.length-1);
        } else if ( val.length === dom_pos+1 ) {
            if (val[dom_pos-1] === maxdays[0]) {
                return this._day_test(val, maxdays[1], val.length-1);
            } else {
                return this._day_test(val, 9, val.length-1);
            }
        } else if ( val.length === this.options._mask.MaxLen ) {
            return  [val.substring(dom_pos-1, dom_pos+1) <= maxdays, 'error'];
        }
    },

    _get_days : function (val,fmt) {
        var maxdays, ret=true, mon_num=-1;
        var mon_ary=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
        switch (fmt) {
           case 'YMD': 
                mon_num = parseInt(val.substring(4,6),10);
                maxdays = new Date(val.substring(0,4),mon_num,0).getDate().toString();
                if ( val.length === 7 ) {
                    return this._day_test(val, maxdays[0], 6);
                } else if ( val.length === 8 ) {
                    if ( mon_num === 2 && val.substring(6,8) > maxdays ) {
                        return [false, 'not a leap year'];
                    } else {
                        return this._parse_days(val,7, maxdays);
                    }
                } 
                break;
           case 'MdY': // might not know year at this point, so can't use leap year calc
                mon_num = mon_ary.indexOf(val.substring(0,3))+1;
                if ( mon_num === 0 ) {
                    this.cached['.mo_elem'].val('');
                    return [false, 'invalid month'];
                }
                maxdays = /^2$/.test(mon_num) ? '29' : (/^(1|3|5|7|8|10|12)$/.test(mon_num) ? '31' : '30');
                if ( mon_num === 2 && val.length === 12) {
                    if ( val.substring(4,6) > new Date(val.substring(8,12),mon_num,0).getDate() ) {
                        return [false, 'not a leap year'];
                    }
                } else {
                    return this._parse_days(val, 5, maxdays);
                } 
        }
        return ret;
    },

    _is_char_valid : function (val, regex, err_msg, str_flag, offset) {
        var str = str_flag === 'string' ? '^('+regex+')$' : '['+regex+']',
            value = str_flag === 'string' ? val : val[offset];
        if ( new RegExp(str).test(value)){
            return [true, ''];
        }
        return [false, err_msg];
    },

    _date_hotkeys : function (params) {
        var hotkey=params.val.substring(params.ofs-1,params.ofs);
        var ret = false;
        switch (true) {
            case /^t$/.test(params.val): 
                ret = this.__todays_date(params.fmt);
                break;
            case /H:M/.test(params.fmt) && /^n$/i.test(params.val):
                ret = this.__time_now();
                break;
            case /MdY/.test(params.fmt):
                if ( params.val.length === 1 ) {
                    ret = this.__mon_first_ltr(hotkey);
                } else if ( params.val.length === 2 ) {
                    ret = this.__mon_sec_ltr(params.val);
                }
                break;
        }
        return ret;
    },

    __time_now : function (fmt) {
        var d = new Date(), h=d.getHours(), m=d.getMinutes(),
            AMPM = h > 12 ? " PM" : " AM";
        m=m<10 ? "0"+m : m;
        h = ( h + 11 ) % 12 + 1;
        h = ( h < 10 ) ? "0" + h : h;
        $(this.element).val(h+':'+m+''+AMPM);
        this.__match_complete();
        return true;
    },

    __todays_date : function (fmt) {
        var ret = false;
        var mon_ary=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
        var dt = new Date(),
            dd = ("0" + dt.getDate()).slice(-2),
            mm = ("0" + (dt.getMonth()+1)).slice(-2),
            yyyy=dt.getFullYear();
        switch (fmt) {
            case 'YMD': 
                $(this.element).val(yyyy+''+mm+''+dd); ret=true; break;
            case 'MdY': 
                $(this.element).val(mon_ary[dt.getMonth()]+' '+dd+', '+yyyy); ret=true; break;
        }
        return ret;
    },

    __mon_sec_ltr : function (val) {
        var mons = {'Ja':'Jan', 'Ap':'Apr', 'Au':'Aug'};
        if ( /^(Au|Ap|Ja)$/i.test(val) ) {
            $(this.element).val(mons[val]+' ');
            return true;
        }
        return false;
    },

    __mon_first_ltr : function (hotkey) {
        var ret = false;
        if ( /[FOSND]/i.test(hotkey) ) {
            var mons = {'F':'Feb', 'S':'Sep', 'O':'Oct', 'N':'Nov', 'D':'Dec'};
            $(this.element).val(mons[hotkey.toUpperCase()]+' ');
            ret=true;
        } else if ( /[JAM]/i.test(hotkey) ) {
            $(this.element).val(hotkey.toUpperCase());
            ret=true;
        }
        return ret;
    },

});
