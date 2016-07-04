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

