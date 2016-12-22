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
