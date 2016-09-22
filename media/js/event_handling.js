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
