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
 * @version         Version 1.8.2-10
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
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#data
        Data: '',  // pass in your array, object or array of objects here
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#columncount
        ColumnCount: 1, // display data in this number of columns
        // http://menuoptions.readthedocs.io/en/latest/SelectParams.html#datakeynames
        DataKeyNames: {}, // specify object keys that contain desired data
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        DisableHiLiting : false, // set to false to enable autocomplete highlighting
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#filters
        Filters: [], // header filters (pass mouse over them & they filter choices)
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#height
        Height: '', // let user specify the exact height they want
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#help
        Help: 'right', // where help message should display
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#justify
        Justify : 'left', // how to justify input inside input element
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#initialvalue
        InitialValue : {}, // allows initial value to be set
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#menuoptionstype
        MenuOptionsType: 'Select', //or Navigate (run JS,follow href) or Rocker (for binary choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#showat
        ShowAt: 'bottom', // 'bottom' or 'right' are the options
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#selectonly
        SelectOnly: false,  // if true, will not allow user to type input
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#showdownarrow 
        ShowDownArrow : "black", // set to None to hide down arrow on menus, else pass in color of arrow
        // http://menuoptions.readthedocs.io/en/latest/SelectParams.html#usevalueforkey
        UseValueForKey: false, // if user wants value = text()
        // http://menuoptions.readthedocs.io/en/latest/Masks.html#masks
        Mask : '',
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#width
        Width: '', // let user specify the exact width they want
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#window
        Window : "repl", // "repl" means replace current window, new mean open new browser window
        _mask: {},
        _bgcolor: { 'valid': 'data_good', 'invalid': 'data_error' },
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

        // text messages and currency definitions
this._cfg={
            curcy:'$',
            no_dt : 'MenuOptions requires the Data parameter to be populated', 
            col_cnt : 'MenuOptions requires ColumnCount parameter be > 0',
            inv_data : 'Invalid Data format supplied to menuoptions',
            rkr_err : 'When using the rocker control, exactly 2 elements need to be supplied to menuoptions',
            only : ' only',
            inv_mon : 'invalid month',
            inv_day : 'invalid day',
            inv_tm : 'invalid time',
            inv_feb : 'not a leap year',
            dm_err : 'day of mon error',
            mon_ary : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            mon_hotkeys : {'F':'Feb', 'S':'Sep', 'O':'Oct', 'N':'Nov', 'D':'Dec'},
            dt_keys_err : "Data error: DataKeyNames is invalid (there must be 2 matching keys)",
            missing_val : "Data error: Key with no value error in incoming Data parameter",
            card_expired : "Card expired",
            missing_regex: "When specifying a user defined RegExp, you must define that RegExp using the 'Whole' key"
         };

        this._handleRegExpMasks();

        if ( /invalid/i.test(this._test_mask_cfg()) ) {
            return this._validation_fail(this._cfg.no_dt,'fatal');
        }
        if (this.options.ColumnCount < 1) {
            return this._validation_fail(this._cfg.col_cnt,'fatal');
        }
        this._check_for_bootstrap();
        if ( this.options._mask_status.mask_only === false ) {
            // make sure incoming data is in required format
            this._build_array_of_objs();
            if (this.orig_objs === false) {
                return this._validation_fail(this._cfg.inv_data,'fatal');
            }
            if (/Rocker/i.test(this.options.MenuOptionsType) && this.orig_objs.length !== 2) {
                    return this._validation_fail(this._cfg.rkr_err,'fatal');
            }
        }

        this._setOptions( this.options );  

        this._detect_destroyed_input();

        this._bind_events();

        this._refresh(); 

        $(this.element).addClass('ui-menuoptions');
    },

    _handleRegExpMasks : function() {
        if ( typeof this.options.Mask === "object" ) {
            if ( ! this.options.Mask.hasOwnProperty('Whole') ) {
                return this._validation_fail(this._cfg.missing_regex,'fatal');
            }
            this.options._mask = this.options.Mask;
            this.options.Mask = "RegExp";
        }
    },

    _set_bg_color : function(instruct) {
        if ( /err/.test(instruct) ) {
           $(this.element).removeClass(this.options._bgcolor.valid).addClass(this.options._bgcolor.invalid);
        } else if ( /good/.test(instruct) ) {
           $(this.element).removeClass(this.options._bgcolor.invalid).addClass(this.options._bgcolor.valid); 
        } else if ( /clear/.test(instruct) ) {
           $(this.element).removeClass(this.options._bgcolor.valid).removeClass(this.options._bgcolor.invalid); 
        }
    },

    _test_mask_cfg : function () {
        if (this.options.Data.toString() === '' && this.options.Mask === '' && 
            typeof this.options.Mask !== "object" ) {
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
            help_msg = this.options._mask.hasOwnProperty('Help') ? this.options._mask.HelpMsg : '';
        if ( $('span#'+id).length === 0 ) {
            var HelpTxt = '<span class=helptext id=' + id +'>'+help_msg+'</span>'; 
            if ( $('#CB_'+this.options._ID).length > 0) {
                $('#CB_'+this.options._ID).after(HelpTxt);
            } else {
                $(this.element).after(HelpTxt);
            }
            this._set_valid_mask ();  
            this._set_help_position(id);
        }
        $('span#'+'HLP_'+this.options._ID).hide(); 
    },

    _set_help_position : function (id) {
         var my_left = 'left';
         if ( this.options._bootstrap && /form-control/.test(this.element.attr('class'))){
             my_left = 'left+10 ';
         }
         if (/Select/i.test(this.options.MenuOptionsType) ) {
            if ( /right/.test(this.options.Help) ) {
                $("span#"+id).position({ of: $(this.element), my:'left center-8', at:'right+10 center'});
            }  else if ( /bottom/.test(this.options.Help) ) {  
                $("span#"+id).position({ of: $(this.element), my: my_left+' top', at:'left bottom+10' });
            }  else if ( /top/.test(this.options.Help) ) {  
                $("span#"+id).position({ of: $(this.element), my: my_left+' top-12', at:'left top-12'});
            }
         } 
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
                'FixedLen' : 8,
                'HelpMsg': 'HH:MM AM', 
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'H:M'}); } },
                'valid' : { 1: { max_val: 1}, 
                            2: function( val,obj ) { return /1/.test(val[0]) ? obj._max_val_test(val,2,1) : obj._max_val_test(val,9,1); },
                            4: { max_val : 5}, 5: { max_val : 9}, 
                            7: function( val,obj ) {return obj._is_char_valid(val,'AP','A or P'+obj._cfg.only, 'one_char', 6);},
                            8: function( val,obj ) {return obj._is_char_valid(val,'M','M'+obj._cfg.only, 'one_char', 7); }
                            },
                'consts' : { 3: ':', 6: ' ', 8:'M'},
                'Whole' : function( val, obj ) { if (/^[01][0-9]:[0-5][0-9] [AP]M$/.test(val)) {return [true,''];} else {return [false,obj._cfg.inv_tm];} }
            },
            'Mon DD, YYYY' : { 
                'FixedLen' : 12,
                'fmt_initial' : function( val, obj ) { obj._initial_MdY({ mask: this }); }, 
                'HelpMsg': 'Mon DD, YYYY',
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'MdY'}); },
                             2: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':2, 'fmt': 'MdY'}); } },
                'valid' : { 1: function( val, obj ) { return obj._is_char_valid(val,'JFMASOND',obj._cfg.inv_mon, 'one_char',0); },
                            2: function( val, obj ) { return obj._is_char_valid(val.substring(0,2),
                                                      $.map(obj._cfg.mon_ary, function(obj) { return obj.substring(0,2); }).join('|'),obj._cfg.inv_mon, 'string', 0); },
                            3: function( val, obj ) { return obj._is_char_valid(val.substring(0,3),obj._cfg.mon_ary.join('|'),obj._cfg.inv_mon, 'string', 0); },
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
                'FixedLen' : 8,
                'HelpMsg': 'YYYYMMDD',
                'hotkey' : { 1: function( val,obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'YMD'}); } }, 
                'valid' : { 1: { max_val: 9 },
                            2: { max_val: 9 },
                            3: { max_val: 9 },
                            4: { max_val: 9 },
                            5: { max_val: 1 },
                            6: function( val,obj ) { return /1/.test(val[4]) ? obj._max_val_test(val,2,5) : obj._max_val_test(val,9,5); },
                            7: function( val, obj ) { return obj._get_days(val,'YMD'); },
                            8: function( val, obj ) { return obj._get_days(val,'YMD'); } }, 
                'Whole' : function( val, obj ) { return obj._get_days(val,'YMD'); }
            },
            'USphone' : { 
                'FixedLen' : 14,
                'HelpMsg': '(999) 999-9999', 
                'fmt_initial' : function( val, obj ) { obj._initial_phone({ valid_regex: '\\d', mask: this }); },
                'valid' : { 'all' : { max_val: 9 }},
                'initial' : { 'val' : '(', 'ofs' : 0 },
                'consts' : { 1: '(', 5:')', 6:' ', 10:'-'},
                'Whole' : '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$'
            },
            'Money' : { 
                'HelpMsg': this._cfg.curcy+'0,000.00', 
                'fmt_initial' : function( val, obj ) { obj._initial_money({ valid_regex: '\\d\\.', mask: this }); },
                'valid' : { 'all' : function( val,obj ) {return obj._check_money({ value: val, ofs : 3 }); } },
                'initial' : { 'val' : this._cfg.curcy+'0.00', 'ofs' : 3 },
                'sep' : ',',
                'Whole' : '^\\'+this._cfg.curcy+'\\d{1,3}\\.\\d{2}$|^\\'+this._cfg.curcy+'(\\d{1,3},)+\\d{3}\\.[0-9]{2}$'
            },
            'CredCdExp' : {
                'FixedLen' : 5,
                'Help': 'MM/YY',
                'valid' : { 
                            /*--  1: { max_val: 1 },  --*/
                            1: function( val,obj ) { return obj._cc_exp_mon(val); },
                            2: function( val,obj ) { return /1/.test(val[0]) ? obj._max_val_test(val,2,1) : obj._max_val_test(val,9,1); },
                            4: { max_val: 9 },
                            5 : function(val,obj) {  return obj._future_test(val); }
                },
                'consts' : { 3: '/' },
                'Whole' : function(val,obj) {  return obj._future_test(val); }
            }
        };
    },

    _set_initial_mask_value : function ( flag ) {
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
                    if ( /blur/i.test(flag) ) {
                        this.element.blur();
                    }
                }
            }
        }
    },

    _set_valid_mask : function () {
        if ( /RegExp/.test(this.options.Mask) ) {
            return; // user defined regexp skips this setup logic
        }
        var mo_type = this._test_mask_cfg();
        if ( ! /^mask/i.test(mo_type)) {
            return;
        }
        var all_masks = this._mask_vars();
        if ( this.options.Mask.length > 0 ) {
            if ( all_masks.hasOwnProperty(this.options.Mask) ) {
                this.options._mask = all_masks[this.options.Mask];
                $(this.element).prop('FixedLength', this.options._mask.FixedLen);
            } else {
                return this._validation_fail(this.options.Mask+" is not a valid mask.",'fatal');
            }
        }
    },

    _initial_bg : function ( params ) {
        if ( new RegExp(params.mask.Whole).test(this.element.val()) === true ) {
           this._set_bg_color('good');
        } else {
           this._set_bg_color('err');
        }
    },

     _initial_MdY : function ( params ) { 
         var val = this.element.val();
         if ( params.mask.FixedLen === val.length && this._get_days(val,'MdY') === true ) {
            this._set_bg_color('good');
            $(this.element).attr('menu_opt_key', val);
         }
     }, 

    _initial_money : function ( params ){
        var raw_data=this.element.val().replace(new RegExp('[^'+params.valid_regex+']', 'g'), '');
        var mony = this._money_init();
        this._money_output(mony);
        this._initial_bg( params );
    },

    _initial_phone : function ( params ){
        var raw_data=this.element.val().replace(new RegExp('[^'+params.valid_regex+']', 'g'), ''),
            consts = params.mask.consts,
            len = params.mask.FixedLen,
            fmted_str = '',
            nums_only = raw_data;
        if ( this.cached['.mo_elem'].val().length === 0 ) {
            fmted_str = consts[1];
        } else {
            for ( var x = 1; x <= len; x++) {
                if ( consts.hasOwnProperty(x) ) {
                    fmted_str = fmted_str + consts[x];
                } else {
                    fmted_str = fmted_str + raw_data.charAt(0);
                    raw_data = raw_data.substring(1);
                }
            }
        }
        this.element.val(fmted_str);
        this.element.attr('menu_opt_key', nums_only);
        this._initial_bg( params );
    },


    _money_start : function (mony,e) {
        this.__set_help_msg('', 'good');
        if ( mony.cur_val.length === 0) {
            this._set_initial_mask_value('focus');
            $(this.element).attr('menu_opt_key', '0.00');
        } else {
            var ofs = this.cached['.mo_elem'].val().length-3;
            /*--  if text has been selected, leave it selected  --*/
            if ( window.getSelection().toString().length === 0 || /focus/.test(e.type) ) { 
                $(this.element).get(0).setSelectionRange(ofs,ofs);
            }
        }
    },

    _money_invalid_key : function (mony, e) {
        this._set_bg_color('clear');
        /*--  console.log("val = "+this.cached['.mo_elem'].val());  --*/
        if ( ! new RegExp('\\d|,|\\'+this._cfg.curcy+'|^'+this._cfg.curcy).test(mony.cur_char) && 
             ! new RegExp('/^\\'+this._cfg.curcy+'[^\\.]+\\.\\d$').test(mony.cur_val)) {
            if ( ! /\.\d$/.test(this.cached['.mo_elem'].val())) {
               this.cached['.mo_elem'].val(mony.cur_val.substring(0,mony.cur_pos-1)+mony.cur_val.substring(mony.cur_pos));
            } 
            /*--  console.log("val = "+this.cached['.mo_elem'].val());  --*/
            if ( mony.cur_char === '.' ) { // && mony.from_left === 3 ) {
                mony.ofs = mony.cur_val.length - 3;
                $(this.element).get(0).setSelectionRange(mony.ofs,mony.ofs);
                return 'valid';
            } else {
                this.__set_help_msg('0 - 9'+ this._cfg.only, 'error');
            }
        }
        return 'invalid';
    },

    _money_to_float : function () {
        var regx = new RegExp('^\\'+this._cfg.curcy+'|[^\\d\\.]+', 'g');
        return parseFloat(this.cached['.mo_elem'].val().replace(regx,''),10).toFixed(2);
    },

    _money_output : function (mony) {
         /*--  console.log("1 - cur_val = "+mony.cur_val);    --*/
        if ( new RegExp('^[^\\'+this._cfg.curcy+']+\\'+this._cfg.curcy+'.*$').test(mony.cur_val)) {
            mony.cur_val = this._money_to_float();
        } else {
            mony.cur_val = parseFloat(this.cached['.mo_elem'].val().replace(/[^\d.]/g,''),10).toFixed(2);
        }
        /*--  console.log("2 - cur_val = "+mony.cur_val);    --*/
        $(this.element).attr('menu_opt_key', mony.cur_val);
        mony.cur_val = this._cfg.curcy + mony.cur_val.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        /*--  console.log("cur_val = "+mony.cur_val.length+" cur_pos = "+mony.cur_pos);    --*/
        this.cached['.mo_elem'].val(mony.cur_val);
        if ( mony.cur_val.length - mony.cur_pos <= 1 ) {
            $(this.element).get(0).setSelectionRange(mony.cur_pos,mony.cur_pos);
        } else {
            mony.ofs = mony.cur_val.length - 3;
            $(this.element).get(0).setSelectionRange(mony.ofs,mony.ofs);
        }
    },

    _money_init : function (mony) {
        if ( this.cached['.mo_elem'].val().length === 0 ) {
            this.cached['.mo_elem'].val('0.00');
        }
        var val = this.cached['.mo_elem'].val(),
            cur_pos = $(this.element).get(0).selectionStart;
        return {
            cur_val : val,
            ofs : val.length - this.options._mask.initial.ofs,
            cur_pos : cur_pos,
            cur_char : val.substring(cur_pos-1, cur_pos),
            from_left : this.cached['.mo_elem'].val().length-cur_pos
        };
    },

    _check_money : function (e) {
        /*--  console.log(" key code = "+e.keyCode);    --*/
        var mony = this._money_init();
        if (/focus|click/.test(e.type) ) {
            this._money_start(mony,e);
            return;
        }
        if (/keydown/.test(e.type) ) {
            /*--  console.log("_check_money keydown - cur_val = "+mony.cur_val+" key code = "+e.keyCode);    --*/
            if ( window.getSelection().toString().length > 0 && ! /^37$|^38$/.test(e.keyCode) ) {
                this.cached['.mo_elem'].val(this.cached['.mo_elem'].val().substring(1,this.cached['.mo_elem'][0].selectionStart)+
                    String.fromCharCode(e.keyCode)+
                    this.cached['.mo_elem'].val().substring(this.cached['.mo_elem'][0].selectionEnd));
                mony.cur_val = this._money_to_float();
                e.preventDefault();
                this._money_output(mony);
            }
        }
        if (/input/.test(e.type) ) {
            /*--  console.log("_check_money input - cur_val = "+mony.cur_val);    --*/
            this.__set_help_msg('', 'good');
            if ( /\.\d$/.test(this.cached['.mo_elem'].val())) {
                mony.cur_val = this._money_to_float();
                this._money_output(mony);
                return;
            }
            if ( /^valid$/i.test(this._money_invalid_key(mony,e))) {
                return;
            }
            /*--  console.log("_check_money input 2 - cur_val = "+mony.cur_val);    --*/
            if ( mony.from_left <= 2 ) {
                if ( new RegExp('^\\'+this._cfg.curcy+'[^\\.]+\\.\\d{3}$').test(mony.cur_val)) {
                    this.cached['.mo_elem'].val(mony.cur_val.substring(0,mony.cur_pos)+mony.cur_val.substring(mony.cur_pos+1));
                    mony.from_left--;
                } else {
                    mony.from_left = mony.from_left === 0 ? 1 : 3;
                }
            }
            this._money_output(mony);
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
                $(this.element).removeClass('data_error').addClass(this.options._bgcolor.valid);
            }
        } else if ( $(this.element).val().length > 0 ) { 
              $(this.element).removeClass(this.options._bgcolor.valid).addClass('data_error');  
         } 
        if (/Select/i.test(this.options.MenuOptionsType) ) {
            this._add_clear_btn();
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
                this._set_bg_color('clear');
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
        if (currval.length > 0 && currval === this.orig_objs[0].val) {
            ltclass = "ltdown";
        }
        if (currval.length > 0 && currval === this.orig_objs[1].val) {
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
        if (this._initval_exists()) {
            this.set_select_value(this.options.InitialValue);
        }
    },

    _rocker_click : function (event) {
        var tgt = $(event.target).is('[menu_opt_key]') ? $(event.target) : $(event.target.parentElement);
        this._change_rocker(tgt);
        this.__exec_trigger({ 'newCode': tgt.attr('menu_opt_key'),
                            'newVal' :  tgt.children().text(), 'type': "RockerClick" });
    },

    _set_rocker : function ( matchedRec, raw_val ) {
        matchedRec=$.map(matchedRec, function(i,v) { if ( raw_val === i.val.replace(/<.*?>/g, '')) return i;});
        this.cached['.mo_elem'].attr('menu_opt_key', matchedRec[0].ky);
        this.cached['.mo_elem'].val(raw_val);
        if ( raw_val === $('div#RK_RT_' + this.options._ID + " span").text())  {
            $('div#RK_RT_' + this.options._ID).attr('class', 'rtdown');
            $('div#RK_LT_' + this.options._ID).attr('class', 'ltup');
        } else if ( raw_val === $('div#RK_LT_' + this.options._ID + " span").text()) {
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
        var newVal = $.trim(params.newVal),
            key = /phone/i.test(this.options.Mask) ? params.newCode.replace(new RegExp('[^\\d]', 'g'), '') : params.newCode;
        this.cached['.mo_elem'].val(newVal);
        this.cached['.mo_elem'].attr('menu_opt_key',key);
        this._trigger("onSelect", this, {
            "newCode": key,
            "newVal" : newVal,
            "type": params.type
        });
        if ( ! /Rocker/i.test(this.options.MenuOptionsType) ) {
            this._set_bg_color('good');
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
        if (/keydown/.test(e.type) ) {
            if ( e.keyCode === $.ui.keyCode.BACKSPACE) {
                e.preventDefault();
                this._back_space (val);
            }
        } else if ( val.length === this.options._mask.FixedLen ) {
            this._match_complete();
        } else if (/input/.test(e.type)) {
             this._is_last_mask_char_valid(e, val);
        }
    },

    _match_complete : function () {
        if ( this.options._mask.hasOwnProperty('Whole') === false ||
             this.options._mask.hasOwnProperty('FixedLen') === false ) {
            return false;
        }
        var val = this.cached['.mo_elem'].val();
        if ( val.length === this.options._mask.FixedLen ) {
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
            for (var x = str_len; str_len < this.options._mask.FixedLen; str_len++) {
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
            newval = "";
        if ( !/Navigate/i.test(this.options.MenuOptionsType) ) {
            params.StrToCheck=this._esc_spec_chars(params.StrToCheck);
        }
        var RegExStr = params.case_ins ? new RegExp(params.StrToCheck, 'i') : new RegExp(params.StrToCheck);
        var matching = $.map(this.orig_objs, function (o) {
            no_img = o.val.replace(/<img[\w\W]*?>/, '');
            if ( params.chk_key && RegExStr.test(o.ky.toString())) {
                return o;
            }
            if ( RegExStr.test(no_img) ) {
                newval = no_img.replace(RegExStr, '<span class=match>' +
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
        if ( matching.length === 0 && this.options.Mask.length === 0) { 
            this._check_whole_input(StrToCheck); 
        } else if ( matching.length > 0 && this.options.Mask.length > 0) {
            if ( StrToCheck === matching[0].val.replace(/<span[\w\W]*?>|<\/span>/g,'') ) {
                this.__set_help_msg('', 'completed');
            } else if ( matching.length > 1 ) {
                this._set_bg_color('err');
            } else if ( this.options._mask_status.mask_passed === true) {
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
                this._set_bg_color('err');
                this.options._mask_status.mask_passed = false;
                break;
            case 'completed': 
                if ( $("span#HLP_"+this.options._ID).hasClass('mask_match')) {
                    $("span#HLP_"+this.options._ID).show();
                    return;
                }
                this._set_bg_color('good');
                $("span#HLP_"+this.options._ID).show().html('&nbsp;').removeClass('helptext err_text').addClass('mask_match');
                var val = this.cached['.mo_elem'].val();
                this.options._mask_status.mask_passed = true;
                this.__exec_trigger({ 'newCode': val, 'newVal' : val, 'type': "Completed" }); 
                this.options._mask_status.mask_passed = true;
                break;
            case 'good':
                help_msg = this.options._mask.hasOwnProperty('HelpMsg') ? this.options._mask.HelpMsg : '';
                 if (this.options._mask.hasOwnProperty('HelpMsg') && this.options._mask.hasOwnProperty('FixedLen')) {
                    if (! /Money/.test(this.options.Mask)) {  
                        var match_len = this.cached['.mo_elem'].val().length; 
                        help_msg = '<span class=match>'+help_msg.substring(0,match_len)+'</span>'+ 
                                    help_msg.substring(match_len);
                    }
                 } 
                $("span#HLP_"+this.options._ID).show().html(help_msg)
                    .removeClass('err_text mask_match').addClass('helptext'); 
                break;
        }
        if ( this.cached['.mo_elem'].val().length === 0 ) {
           this._set_bg_color('clear');
        } else if ( this.options._mask.hasOwnProperty('FixedLen') && this.cached['.mo_elem'].val().length < this.options._mask.FixedLen){
           this._set_bg_color('err');
        }
    },

    _esc_spec_chars  : function(StrToCheck) {
        return StrToCheck.replace(/(\{|\}|\\|\*|\(|\))|\[|\]/g, '\\$&');
    },

    _matches : function(StrToCheck, exact) {
        StrToCheck=this._esc_spec_chars(StrToCheck);
        return $.map(this.orig_objs, function (o) { 
            if (exact === 'exact' && StrToCheck.toUpperCase() === o.val.replace(/<img[\w\W]*?>/, '').toUpperCase()) { return o; }
            else if (exact === 'partial' && new RegExp(StrToCheck, 'i').test(o.val.replace(/<img[\w\W]*?>/, ''))) { return o; }
        });
    },

    _check_whole_input : function (StrToCheck) {
        var str_len = this.cached['.mo_elem'].val().length;
        this.options._mask_status.mask_passed=true;
        for (var x = str_len; str_len > 0; str_len--) {
            if ( this.options.Data !== ""  && this._matches(this.cached['.mo_elem'].val(), 'partial').length === 0 ||
                 this.options.Mask.length > 0 ) {
                    if ( this.options.Mask.length > 0 ) {
                         if ( /RegExp/.test(this.options.Mask) ) {
                             if ( ! new RegExp(this.options._mask.Whole).test(this._esc_spec_chars(this.cached['.mo_elem'].val())) ) {
                                this._cut_last_char('Invalid char', str_len);
                             } else {
                                this.cached['.mo_elem'].attr('menu_opt_key', this.cached['.mo_elem'].val());
                                this.__set_help_msg('', 'good'); 
                                return;
                             }
                         } else { 
                            this._single_char_valid_mask(this.cached['.mo_elem'].val(), str_len);
                         } 
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
        if ( this.options.Mask.length > 0 ) {
            this.options._mask_status.mask_passed = false;
        } else {
            this._set_bg_color('err');
        }
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
                    this._cut_last_char('0 - '+max_val+this._cfg.only, str_len);
                    return false;
                }
            }
        }
        return true;
    },

    _valid_test : function (StrToCheck) {
        if ( this.options._mask.hasOwnProperty('FixedLen') && StrToCheck.length > this.options._mask.FixedLen ) {
            this.cached['.mo_elem'].val(StrToCheck.substring(0, this.options._mask.FixedLen));
        }
        this._check_whole_input(this.cached['.mo_elem'].val());
        this._add_const (this.cached['.mo_elem'].val());
        if ( $("span#HLP_"+this.options._ID).hasClass('mask_match')) {
            this.__set_help_msg('', 'good');
        }
        if (this.options._mask.hasOwnProperty('FixedLen') && 
            this.cached['.mo_elem'].val().length > 0 && 
            this.cached['.mo_elem'].val().length < this.options._mask.FixedLen ) {
                this._set_bg_color('err');
        }
        return true; 
    },

    _is_last_mask_char_valid : function (e, StrToCheck) {
        if ( this.options._mask.hasOwnProperty('FixedLen') && StrToCheck.length > this.options._mask.FixedLen ) {
            this.cached['.mo_elem'].val(StrToCheck.substring(0, this.options._mask.FixedLen));
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
            'mousedown': '_clearInput'
            /*--  'click': '_clearInput'  --*/
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
        $(this.element).attr('menu_opt_key', '');
        $(this.element).val('');
        setTimeout( function() {
            $($this.element).focus(); //chrome needs delay
        }, 80 );
        this._set_initial_mask_value('blur');
        this._set_bg_color('clear');
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
        var str_len = $(this.element).get(0).selectionStart,
            new_str = '';
        for (var x = str_len; str_len > 0; str_len--) {
            new_str = val.substring(0,str_len-1) + val.substring(str_len);
            if ( this.options._mask.hasOwnProperty('consts') &&
                this.options._mask.consts.hasOwnProperty(str_len) ) {
                if ( str_len > 1 ) {
                    $(this.element).val(new_str);
                    val = new_str;
                }
                continue;
            } else {
                $(this.element).val(new_str);
                break;
            }
        }
        $(this.element).get(0).setSelectionRange(str_len-1,str_len-1);
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
        var left_pad=18;
        $(this.element).css({ 'text-align': this.options.Justify });
        if ( /right/i.test(this.options.Justify) ) {
            var orig_width = parseInt($(this.element).css('width'));
            $(this.element).css({ 'padding-right': left_pad + 'px'});
            /*--  this.element.removeAttr('width');  --*/
            if ( this.options._bootstrap && /form-control/.test(this.element.attr('class'))){
                 $(this.element).css({ 'width': (orig_width-left_pad) + 'px !important' }); 
            } else {
                this.element.width(orig_width-left_pad);
            }
        }
    },

    _recreate_mo : function() {
        var orig_val = $(this.element).val(),
            mo_type = this._test_mask_cfg();
        if ( /Select/i.test(this.options.MenuOptionsType)) {
            this._justify();
        }
        if (/^mask_and|^autocomplete$/i.test(mo_type)) {
                this._build_array_of_objs();
        }
        if (/^mask/i.test(mo_type) && /Select/i.test(this.options.MenuOptionsType)) {
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
                    this._add_clear_btn(); 
                } else if ( /Navigate/.test(this.options.MenuOptionsType)) {
                    this._show_menu_arrs();
                }
                this._build_dropdown(this.orig_objs);
            }
         }
    },

    _setup_mask_mo_key : function () {
        if ( /money/i.test(this.options.Mask)) {
            /*--  console.log("Calling _money_output from _setup_mask_mo_key()");  --*/
            this._money_output(this._money_init());  
        } else if ( /phone/i.test(this.options.Mask)) {
            this._initial_phone({ valid_regex: '\\d', mask: this.options._mask });
        } else {
            $(this.element).attr('menu_opt_key',this.cached['.mo_elem'].val());
        }
    },

    _setOptions : function ( options ) {
        this._setOption('_ID', this.eventNamespace.replace(/^\./, ''));
        this._event_ns = this.eventNamespace.replace(/^\./, '');
        this.cached={'.mo_elem':this.element}; 
        $(this.element).attr('autocomplete', 'off');
        if ( this.options.DisableHiLiting === true) {
            this.options._bgcolor = { 'valid': 'data_neutral', 'invalid': 'data_neutral' };
        }
        this._set_valid_mask();
        var $dd_span = this;
        if (/Select|Rocker/.test(this.options.MenuOptionsType)) {
            if ( this.options.Data !== '') {
                this.add_menuoption_key();
            } else {
                this._setup_mask_mo_key();
            }
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
            $dd_span.options.Data = $.unique($dd_span.options.Data);
            ary_of_objs = $.map($dd_span.options.Data, function (k, v) {
                return { ky: k, val: k };
            });
            /*jslint unparam: false*/
        } else {
            $.each($dd_span.options.Data, function (key, value) {
                if ($.isPlainObject($dd_span.options.Data[0])) { 
                    /*--  make sure objects follow {ky: "key", val:"value"} pattern --*/
                    if ($dd_span._obj_create(ary_of_objs, value) === false) { 
                             return false; 
                    } 
                } else if (!$.isArray($dd_span.options.Data)) { 
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
            return this._validation_fail(this._cfg.dt_keys_err, 'fatal');
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
                        return this._validation_fail(this._cfg.missing_val, 'fatal');
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
            if ( /keyup|keydown|input|click|focus/.test(e.type)) {
                if (/^Money$/i.test( this.options.Mask)) {
                    /*--  if ( /keyup/.test(e.type)) {  --*/
                        this._check_money(e);
                    /*--  }  --*/
                } else if (/keyup|keydown|input/.test(e.type)) {
                    this._check_mask(e, this.cached['.mo_elem'].val());
                } else if ( /focus/.test(e.type)) {
                    this._add_const (this.cached['.mo_elem'].val());
                    this.__set_help_msg('', 'good');
                }
            }
        }
    },
    _build_drop_down_test : function (e) {
        if (e.type === this.options._prev.event && $(e.currentTarget).text() === this.options._prev.text) { 
             this.__set_prev(e);
             return false;
        } 
        this.__set_prev(e);
        this._mask_only(e);
        if (e.type === 'search') { // clear menu_opt_key when input is cleared
            this.cached['.mo_elem'].attr('menu_opt_key', '');
        }
        if (this.options.Data === "") { // short circuit autocomplete logic here (if no Data)
            return false;
        }
        if (/keydown|keyup/.test(e.type) &&  e.keyCode !== $.ui.keyCode.BACKSPACE && this._arrow_keys(e) === true ){
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
        return true;
    },

    _build_whole_dropdown : function (e) {
        if ( this._build_drop_down_test(e) === false ) {
            return;
        }
        var curVal = this.cached['.mo_elem'].val();
         if (/mouseenter|focus|input/.test(e.type) || /keyup/.test(e.type) && e.keyCode === $.ui.keyCode.BACKSPACE) {
            var matched;
            if ( curVal.length === 0 ) {
                matched = this.orig_objs;
            } else {
                matched = this._match_list_hilited({'StrToCheck': curVal, 'chk_key': false, 'case_ins': true, 'evt': e});
            }
            if ( curVal.length > this.cached['.mo_elem'].val().length ) {
                matched = this._matches(this.cached['.mo_elem'].val(), 'partial');
            } else if ( this.options.Mask === '' ) {
                $("span#HLP_"+this.options._ID).hide(); 
            }
            matched = matched.length === 0 && this.options.Mask === '' ?  this.orig_objs : matched;
            this._build_filtered_dropdown (e, matched );
            this._set_ac_bg_color (e, matched );
            return;
         } 
    },

    _set_ac_bg_color : function (e, matched) {
        if ( /input/.test(e.type) && this.options.Mask === '') {
            this._set_bg_color('err');
            if ( this._matches(this.cached['.mo_elem'].val(), 'exact').length === 1) {
                this._set_bg_color('good');
                this.cached['.mo_elem'].val($('table.CrEaTeDtAbLeStYlE td:first').text());
                $("span#HLP_"+this.options._ID).show().html('&nbsp;').removeClass('helptext err_text').addClass('mask_match');
            }
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
        if (/phone/i.test(this.options.Mask) && this.cached['.mo_elem'].val() === '(') {
            this.cached['.mo_elem'].val('');
        }
        this.options._prev.event = e.type;
        // prevent 2 calls in a row (we trigger one by calling .blur() )
        if (e.type === 'blur' && /mouseleave/.test(this.options._prev.event)) {
            return;
        }
        // is the mouse over the drop down? If not, remove it from DOM
        if ($('span#SP_' + this.options._ID).length) {
            if (this._didMouseExitDropDown(e) === true) {
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

    _max_val_test : function (val, maxval, offset) {
        if (/\d/.test(val[offset]) && val[offset] <= maxval ) {
            return [true, ''];
        } 
        return [false, '0 - '+maxval+this._cfg.only];
    },


    _parse_days : function (val,dom_pos, maxdays) {
        if ( val.length === dom_pos ) {
            return this._max_val_test(val, maxdays[0], val.length-1);
        } else if ( val.length === dom_pos+1 ) {
            if (val[dom_pos-1] === maxdays[0]) {
                return this._max_val_test(val, maxdays[1], val.length-1);
            } else {
                return this._max_val_test(val, 9, val.length-1);
            }
        } else if ( val.length === this.options._mask.FixedLen ) {
            return  [val.substring(dom_pos-1, dom_pos+1) <= maxdays, this._cfg.dm_err];
        }
        return [true,''];
    },

    _get_days : function (val,fmt) {
        var maxdays, ret=true, mon_num=-1;
        switch (fmt) {
           case 'YMD': 
                mon_num = parseInt(val.substring(4,6),10);
                maxdays = new Date(val.substring(0,4),mon_num,0).getDate().toString();
                if ( val.length === 7 ) {
                    return this._max_val_test(val, maxdays[0], 6);
                } else if ( val.length === 8 ) {
                    if ( mon_num === 2 && val.substring(6,8) > maxdays ) {
                        return [false, this._cfg.inv_feb];
                    } else {
                        return this._parse_days(val,7, maxdays);
                    }
                } 
                break;
           case 'MdY': // might not know year at this point, so can't use leap year calc
                mon_num = this._cfg.mon_ary.indexOf(val.substring(0,3))+1;
                if ( mon_num === 0 ) {
                    this.cached['.mo_elem'].val('');
                    return [false, this._cfg.inv_mon];
                }
                maxdays = /^2$/.test(mon_num) ? '29' : (/^(1|3|5|7|8|10|12)$/.test(mon_num) ? '31' : '30');
                if ( val.length === 12) {
                    if ( val.substring(4,6) > new Date(val.substring(8,12),mon_num,0).getDate() ) {
                        return (mon_num === 2) ? [false, this._cfg.inv_feb] : [false, this._cfg.inv_day];
                    }
                } else { 
                     return this._parse_days(val, 5, maxdays); 
                 }  
        }
        return ret;
    },

    _future_test : function (val) {
        if ( ! /\d/.test(val[val.length-1]) ) {
            return [false, '0 - 9'+this._cfg.only];
        }
        var mmyy = val.substring(3)+val.substring(0,2),
           curr_mmyy = new Date().getFullYear().toString().substring(2)+("0" + (new Date().getMonth() + 1)).slice(-2);
        return mmyy > curr_mmyy ? [true,''] : [false,this._cfg.card_expired];
    },

    _cc_exp_mon : function (val) {
        if ( /\D/.test(val[0]) ) {
            return [false, '0 - 9'+this._cfg.only];
        } else if ( val.length === 1 && val > 1 ) {
            this.cached['.mo_elem'].val("0"+val[0].toString());
            return [true,''];
        } else {
            return [true,''];
        }
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
        var dt = new Date(),
            dd = ("0" + dt.getDate()).slice(-2),
            mm = ("0" + (dt.getMonth()+1)).slice(-2),
            yyyy=dt.getFullYear();
        switch (fmt) {
            case 'YMD': 
                $(this.element).val(yyyy+''+mm+''+dd); ret=true; break;
            case 'MdY': 
                $(this.element).val(this._cfg.mon_ary[dt.getMonth()]+' '+dd+', '+yyyy); ret=true; break;
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
            $(this.element).val(this._cfg.mon_hotkeys[hotkey.toUpperCase()]+' ');
            ret=true;
        } else if ( /[JAM]/i.test(hotkey) ) {
            $(this.element).val(hotkey.toUpperCase());
            ret=true;
        }
        return ret;
    },

});
