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

    #import options.js


  // the constructor
    _create: function () {

        // text messages and currency definitions
        #import english_dollar.js

        this._handleRegExpMasks();

        if ( /invalid/i.test(this._test_mask_cfg()) ) {
            return this._validation_fail(this._cfg.no_dt,'fatal');
        }
        if (this.options.ColumnCount < 1) {
            return this._validation_fail(this._cfg.col_cnt,'fatal');
        }
        if (this.options.UserInputAllowed === true && this.options.Mask.length > 0) {
            return this._validation_fail(this._cfg.bad_combo,'fatal');
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

    #import masks.js

    #import money_logic.js

    _check_for_bootstrap : function (err_msg) {
        if ( $('script[src*=bootstrap]').length > 0 ) {
            this.options._bootstrap = true;
        }
    },

    refreshData : function (RefreshCfg) {
        this._setOptions( RefreshCfg );
    },

    add_menuoption_key : function () {
        if ( /Rocker/i.test(this.options.MenuOptionsType) && $(this.element).val() === '' )
        { // reset rocker b/c there is no match
            this._reset_rockers();
            return;
        }
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
                this._reset_rockers();
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

    #import rocker.js

    _initval_exists : function () {
        var retval = false;
        if ((this.options.InitialValue.hasOwnProperty('val') &&
                this.options.InitialValue.val.length >= 0) ||
                (this.options.InitialValue.hasOwnProperty('ky') &&
                this.options.InitialValue.ky.toString().length > 0)) {
            retval = true;
        }
        return retval;
    },

    _detect_destroyed_input: function () {
        $(this.element).bind('remove', function () {
            this._destroy();
        });
    },

    #import exec_choice.js

    #import match_logic.js

    #import event_handling.js

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

    #import arrow_keys.js

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
        this._disable_enable( );
    },

    _disable_enable: function ( ) {
        if (this.options.Disabled) {
            $(this.element).parent().css({'pointer-events': 'none', 'opacity':'0.4'});
            $(this.element).prop('disabled',true);
            this._bind_events('off');
        }
        else { 
            $(this.element).parent().css({'pointer-events': 'auto', 'opacity':'1.0'});
            $(this.element).prop('disabled',false);
            this._bind_events('on');
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
        $('span[id$=' + this.options._ID + ']').remove();
        this._super();
    },

    #import menu_arrow.js

    #import incoming_data.js

    #import dropdown.js

    #import utils.js
});
