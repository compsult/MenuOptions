    _mask_vars : function() {
        return {
            'HH:MM AM' : { 
                #import 12hr_time_mask.js
            },
            'Mon DD, YYYY' : { 
                #import mon_dd_yyyy_mask.js
            },
            'YYYYMMDD' : { 
                #import yyyymmdd_mask.js
            },
            '(999) 999-9999' : { 
                #import phone_mask.js
            }
        };
    },

    _set_valid_mask : function () {
        var all_masks = this._mask_vars();
        if ( this.options.Mask.length > 0 ) {
            if ( all_masks.hasOwnProperty(this.options.Mask) ) {
                this.options._mask = all_masks[this.options.Mask];
                $(this.element).prop('maxLength', this.options._mask.MaxLen);
            } else {
                return this._validation_fail(this.options.Mask+" is not a valid mask.",'fatal');
            }
        }
    },


