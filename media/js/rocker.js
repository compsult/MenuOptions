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
