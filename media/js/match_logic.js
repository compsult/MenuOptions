    _check_mask : function (e) {
        var val = this.cached['.mo_elem'].val();
        if (/keydown/.test(e.type) ) {
            if ( e.keyCode === $.ui.keyCode.BACKSPACE) {
                e.preventDefault();
                this._back_space (val);
            }
            return;
        }
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
        if ( matching.length === 0 && this.options.Mask.length === 0) { 
            this._check_whole_input(StrToCheck);
        } else if ( matching.length > 0 && this.options.Mask.length > 0) {
            if ( StrToCheck === matching[0].val.replace(/<span[\w\W]*?>|<\/span>/g,'') ) {
                this.__set_help_msg('', 'completed');
            } else if ( matching.length > 1 ) {
                this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
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
        } else if ( this.options._mask.hasOwnProperty('MaxLen') && this.cached['.mo_elem'].val().length < this.options._mask.MaxLen){
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
        this.options._mask_status.mask_passed=true;
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
        if ( this.options.Mask.length > 0 ) {
            this.options._mask_status.mask_passed = false;
            this.__set_help_msg(err_msg, 'error');
        } else {
            this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
        }
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

