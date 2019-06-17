    _set_showat : function () {
        if (this.options.ShowAt.match(/^ *bottom *$/i)) {
            this._setOption('ShowAt', 'left bottom-2' );
        } else if (this.options.ShowAt.match(/^ *right *$/i)) {
            this._setOption('ShowAt', 'right-2 top');
        }
    },

    _build_row : function (dd_span, subary) {
        return $.map(subary, function (obj) {
            if (!$.isFunction(obj.ky) && 
                dd_span.options.MenuOptionsType === 'Navigate' && 
                obj.ky.match(/^ *divider *$/i)) {
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
             var curVal = this.cached['.mo_elem'].val();
             if ( curVal.length > 0 && this.options._mask.hasOwnProperty('Whole') === true &&
                  e.keyCode === $.ui.keyCode.ENTER && /keydown/.test(e.type)) {
                 this.__exec_trigger({'newCode': -1, 'noGreenChk': true, 'newVal': curVal, 'type': 'ENTERKey'});
             }
            return false;
        }
        if (/keydown|keyup/.test(e.type) &&  e.keyCode !== $.ui.keyCode.BACKSPACE && this._arrow_keys(e) === true ){
            return false;
        }
        if (/keydown/.test(e.type) && (e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.TAB)) {
            this._tab_and_enter_keypress(e, this.cached['.mo_elem'].val());
            /*--  $("span#HLP_"+this.options._ID).hide();  --*/
            return false;
        }  
        if (/keydown|mousedown|click/.test(e.type)) {  
            /*--  only focus and keyup create a dropdown (otherwise multiple calls to dropdown logic)  --*/
            if (! /None/i.test(this.options.Help) ) {
                $("span#HLP_"+this.options._ID).show();
            }
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
            var matched = [];
            if ( curVal.length === 0 ) {
                matched = this.orig_objs;
            } else {
                matched = this._match_list_hilited({'StrToCheck': curVal, 'chk_key': false, 'case_ins': true, 'evt': e});
            }
            if ( matched.length === 0 && this.options.UserInputAllowed === true ) {
                this._build_filtered_dropdown (e, matched );
                return;
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
                if (! /None/i.test(this.options.Help) ) {
                    $("span#HLP_"+this.options._ID).show().html('&nbsp;').removeClass('helptext err_text').addClass('mask_match');
                }
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
            this.cached['.dropdownspan'].find('table.CrEaTeDtAbLeStYlE').height();
        this.options._menu_box.left = this.cached['.dropdownspan'].position().left;
        this.options._menu_box.right = this.options._menu_box.left + 
            this.cached['.dropdownspan'].width();
    },

    _didMouseExitDropDown : function (e) {
        // this is where mouse is inside drop down 
        if (  e.pageX + 1  > this.options._menu_box.left  &&
              e.pageX + 1 < this.options._menu_box.right &&
              e.pageY + 3 > this.options._menu_box.top &&
              e.pageY + 1 < this.options._menu_box.bottom) {
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
            showAt = this.options.ShowAt,
            dropdown_ht = 0;

        this._addDropDownToDOM();
        this._get_n_set_width();
        if ( $('button.navbar-toggle').length && 
             /block/.test($('button.navbar-toggle').css('display')) && 
             this.cached['.mo_elem'].closest('ul.navbar-nav').length ) {
             showAt = 'left+' + this.options.BootMenuOfs + ' top';
        }
        dropdown_ht = $dd_span.cached['.dropdownspan'].height();
        /*--  console.log("Drop down height = "+dropdown_ht+" Window height = "+$(window).height());  --*/
        final_width = parseInt($('span#SP_' + this.options._ID).css('width'), 10);
        $dd_span.cached['.dropdownspan'].css({'height' : dropdown_ht,
                                              'width'  : final_width,
                                              'display': 'inline-block'});
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
        $('span#SP_' + $dd_span.options._ID).css({ zIndex: 9999});
        if (this._use_scroller()) {
            dropdown_ht = parseInt($dd_span.options.Height, 10);
            $dd_span.cached['.dropdownspan'].css({'height': dropdown_ht,
                                                  'overflow-y': 'scroll',
                                                  'overflow-x': 'hidden',
                                                  'width': final_width+18,
                                                  'display': 'inline-block'});
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
        var final_ht = parseInt($('span#SP_' + this.options._ID).find('table.CrEaTeDtAbLeStYlE').css('height'), 10);
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
