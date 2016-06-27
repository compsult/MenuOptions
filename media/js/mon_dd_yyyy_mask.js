                'MaxLen' : 12,
                'Help': 'Mon DD, YYYY',     
                'hotkey' : { 1: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':1, 'fmt': 'MdY'}); },
                             2: function( val, obj ) { return obj._date_hotkeys({'val': val,'ofs':2, 'fmt': 'MdY'}); } },
                'valid' : { 1: function( val, obj ) { return obj._is_char_valid(val,'JFMASOND','invalid month', 'one_char',0); },
                            2: function( val, obj ) { return obj._is_char_valid(val.substring(0,2),'Ja|Fe|Ma|Ap|Ju|Au|Se|Oc|No|De','invalid month', 'string', 0); },
                            3: function( val, obj ) { return obj._is_char_valid(val.substring(0,3),'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec','invalid month', 'string', 0); },
                            5: function( val, obj ) { return obj._get_days(val,'MdY'); },
                            6: function( val, obj ) { return obj._get_days(val,'MdY'); },
                            9: { max_val: 9 },
                            10: { max_val: 9 },
                            11: { max_val: 9 },
                            12: { max_val: 9 } },
                'consts' : { 4: ' ', 7:',', 8:' '},
                'Whole' : function( val, obj ) { return obj._get_days(val,'MdY'); }