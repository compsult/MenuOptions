                'FixedLen' : 14,
                'HelpMsg': '(999) 999-9999', 
                'fmt_initial' : function( val, obj ) { obj._initial_phone({ valid_regex: '\\d', mask: this }); },
                'valid' : { 'all' : { max_val: 9 }},
                'initial' : { 'val' : '(', 'ofs' : 0 },
                'consts' : { 1: '(', 5:')', 6:' ', 10:'-'},
                'Whole' : '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$'
