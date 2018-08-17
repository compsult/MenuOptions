                'FixedLen' : 5,
                'Help': 'MM/YY',
                'valid' : { 
                            /*--  1: { max_val: 1 },  --*/
                            1: function( val,obj ) { return obj._cc_exp_mon(val); },
                            2: function( val,obj ) { return /1/.test(val[0]) ? obj._max_val_test(val,2,1) : obj._max_val_test(val,9,1); },
                            4: { max_val: 9 },
                            5 : function(val,obj) {  return obj._future_test(val); }
                },
                'consts' : { 3: '/' },
                'Whole' : function(val,obj) {  return obj._future_test(val); }
