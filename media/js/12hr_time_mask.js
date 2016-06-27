                'MaxLen' : 8,
                'Help': 'HH:MM AM',     
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'H:M'}); } },
                'valid' : { 1: { max_val: 1}, 
                            2: function( val,obj ) { return /1/.test(val[0]) ? obj._day_test(val,2,'cut',1) : obj._day_test(val,9,'cut',1); },
                            4: { max_val : 5}, 5: { max_val : 9}, 
                            7: function( val,obj ) {return obj._is_char_valid(val,'AP','A or P only', 'one_char', 6);},
                            8: function( val,obj ) {return obj._is_char_valid(val,'M','M only', 'one_char', 7); }
                            },
                'consts' : { 3: ':', 6: ' ', 8:'M'},
                'Whole' : function( val, obj ) { return /^[01][0-9]:[0-5][0-9] [AP]M$/.test(val); }