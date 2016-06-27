    _tab_and_enter_keypress : function (e, curVal) {
        if ( e.keyCode === $.ui.keyCode.ENTER ) {
            e.preventDefault();
            this.__exec_trigger({ 'newCode': $('table.CrEaTeDtAbLeStYlE td:first').attr('menu_opt_key'), 
                        'newVal' : $('table.CrEaTeDtAbLeStYlE td:first').text(), 'type': "ENTERKey" }); 
        } else if (e.keyCode === $.ui.keyCode.TAB ) {
            if ( curVal.length > 0) {
                var matched =  this.__build_match_ary(e, curVal);
                if ( matched.length > 0 ) {
                    this.__exec_trigger({ 'newCode': $('table.CrEaTeDtAbLeStYlE td:first').attr('menu_opt_key'), 
                                'newVal' : $('table.CrEaTeDtAbLeStYlE td:first').text(), 'type': "TABKey" }); 
                } else if ( this.__match_complete() === true ) {
                    this.__exec_trigger({ 'newCode': curVal, 'newVal' : curVal, 'type': "TABKey" }); 
                }
            } else if ( curVal.length > 0 ) {
                this.cached['.mo_elem'].removeClass('data_good').addClass('data_error'); 
            }
        } 
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
        Sel[ky] = '_removeDropDown';
        // when user chooses (clicks), insert text into input box
        ky = 'mousedown span#SP_' + this.options._ID + ' table.CrEaTeDtAbLeStYlE td ';
        Sel[ky] = '_choice_selected';
        // when mouse leaves the container, remove it from DOM
        ky = 'mouseleave span#SP_' + this.options._ID;
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
            'keypress': '_buildWholeDropDown',
            'keydown': '_buildWholeDropDown',
            'input': '_buildWholeDropDown',
            'keyup': '_buildWholeDropDown',
            'search':  '_buildWholeDropDown',
            'mouseleave':  '_removeDropDown', 
            'blur': '_removeDropDown',
        });
    },
