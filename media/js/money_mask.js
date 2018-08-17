                'HelpMsg': this._cfg.curcy+'0,000.00', 
                'fmt_initial' : function( val, obj ) { obj._initial_money({ valid_regex: '\\d\\.', mask: this }); },
                'valid' : { 'all' : function( val,obj ) {return obj._check_money({ value: val, ofs : 3 }); } },
                'initial' : { 'val' : this._cfg.curcy+'0.00', 'ofs' : 3 },
                'sep' : ',',
                'Whole' : '^\\'+this._cfg.curcy+'\\d{1,3}\\.\\d{2}$|^\\'+this._cfg.curcy+'(\\d{1,3},)+\\d{3}\\.[0-9]{2}$'
