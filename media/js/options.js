    options: {
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#bootmenuofs
        BootMenuOfs: 140,   // how far to left of expanded menu should dropdown appear
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#clearbtn
        ClearBtn: true,   // if set, will clear the input field to it's left
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#data
        Data: '',  // pass in your array, object or array of objects here
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disabled
        Disabled: false,  // disable or enable MenuOptions control
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#columncount
        ColumnCount: 1, // display data in this number of columns
        // http://menuoptions.readthedocs.io/en/latest/SelectParams.html#datakeynamesmk
        DataKeyNames: {}, // specify object keys that contain desired data
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#disablehiliting
        DisableHiLiting : false, // set to false to enable autocomplete highlighting
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#filters
        Filters: [], // header filters (pass mouse over them & they filter choices)
        //  http://menuoptions.readthedocs.org/en/latest/SelectParams.html#height
        Height: '', // let user specify the exact height they want
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#help
        Help: 'right', // where help message should display
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#justify
        Justify : 'left', // how to justify input inside input element
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#initialvalue
        InitialValue : {}, // allows initial value to be set
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#menuoptionstype
        MenuOptionsType: 'Select', //or Navigate (run JS,follow href) or Rocker (for binary choices)
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#showat
        ShowAt: 'bottom', // 'bottom' or 'right' are the options
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#sort
        Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#selectonly
        SelectOnly: false,  // if true, will not allow user to type input
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#showdownarrow 
        ShowDownArrow : "black", // set to None to hide down arrow on menus, else pass in color of arrow
        // https://menuoptions.readthedocs.io/en/latest/SelectParams.html#userinputallowed
        UserInputAllowed: false, // if user can enter any value, even if it is not is autocomplete list
        // http://menuoptions.readthedocs.io/en/latest/SelectParams.html#usevalueforkey
        UseValueForKey: false, // if user wants value = text()
        // http://menuoptions.readthedocs.io/en/latest/Masks.html#masks
        Mask : '',
        // http://menuoptions.readthedocs.org/en/latest/SelectParams.html#width
        Width: '', // let user specify the exact width they want
        // http://menuoptions.readthedocs.org/en/latest/MenuParams.html#window
        Window : "repl", // "repl" means replace current window, new mean open new browser window
        _mask: {},
        _bgcolor: { 'valid': 'data_good', 'invalid': 'data_error' },
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
