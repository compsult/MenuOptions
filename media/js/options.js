    options: {
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#bootmenuofs
        BootMenuOfs: 140,   // how far to left of expanded menu should dropdown appear
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#clearbtn
        ClearBtn: false,   // if set, will clear the input field to it's left
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#selectonly
        Data: '',  // pass in your array, object or array of objects here
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#columncount
        ColumnCount: 1, // display data in this number of columns
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        DataKeyNames: {}, // specify object keys that contain desired data
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        DisableHiLiting : false, // set to false to enable autocomplete highlighting
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#filters
        Filters: [], // header filters (pass mouse over them & they filter choices)
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#height
        Height: '', // let user specify the exact height they want
        Help: 'right',
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#initialvalue
        Justify : 'left', // allows initial value ot be set
        InitialValue : {}, // allows initial value ot be set
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#menuoptionstype
        MenuOptionsType: 'Select', //or Navigate (run JS,follow href) or Rocker (for binary choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#showat
        ShowAt: 'bottom', // 'bottom' or 'right' are the options
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        SelectOnly: false,  // if true, will not allow user to type input
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#data
        ShowDownArrow : "black", // set to None to hide down arrow on menus, else pass in color of arrow
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#showdownarrow 
        UseValueForKey: false, // if user wants value = text()
        Mask : '',
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#width
        Width: '', // let user specify the exact width they want
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#window
        Window : "repl", // "repl" means replace current window, new mean open new browser window
        _mask: {},
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
