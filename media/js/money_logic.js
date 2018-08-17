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
