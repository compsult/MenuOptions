    _arrow_keys : function (event) {
        var arr_key_pressed = false,
            row = this.options._currTD[0],
            col = this.options._currTD[1],
            highlited = $('.CrEaTeDtAbLeStYlE tr td.mo');
        if (/keydown|keyup/.test(event.type)) {
            if (/keyup/.test(event.type) && /^(37|38|39|40|8)$/.test(event.keyCode)) {
                event.preventDefault();
                return true;
            }
            switch (event.keyCode) {
            case $.ui.keyCode.TAB:
                return false;
            case $.ui.keyCode.RIGHT:
                if (col < $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(1) td').length) {
                    col = this.options._currTD[1] = this.options._currTD[1] + 1;
                }
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.LEFT:
                if (col > 1) {
                    col = this.options._currTD[1] = this.options._currTD[1] - 1;
                }
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.UP:
                if (row > 1) {
                    row = this.options._currTD[0] = this.options._currTD[0] - 1;
                }
                this.__scroll(row);
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.DOWN:
                if (row < $('.CrEaTeDtAbLeStYlE tbody tr').length) {
                    this.options._currTD[0] += 1;
                    row = this.options._currTD[0];
                }
                this.__scroll(row);
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.BACKSPACE:
                event.preventDefault();
                this._back_space(this.cached['.mo_elem'].val());
                arr_key_pressed = true;
                break;
            case $.ui.keyCode.ENTER:
                if (/divider/.test($(highlited).prop('class'))) {
                    arr_key_pressed = false;
                } else if (highlited.length > 0) {
                    if (/Select/.test(this.options.MenuOptionsType)) {
                        this.__exec_trigger({ 'newCode': $('.CrEaTeDtAbLeStYlE tr td.mo').attr('menu_opt_key'),
                               'newVal' : $('.CrEaTeDtAbLeStYlE tr td.mo').text(), 'type': "EnterKey" });
                    } else if (/keydown/.test(event.type)) {
                        this._run_menu_item(event);
                    }
                }
                break;
            }
            if (arr_key_pressed === true) {
                $('.CrEaTeDtAbLeStYlE tr td').removeClass('mo');
                $('.CrEaTeDtAbLeStYlE tr:nth-child(' + row + ') td:nth-child(' + col + ')').addClass('mo');
                return arr_key_pressed;
            }
        }
        return false;
    },

    _back_space : function (val) {
        /*--  var str_len = val.length;  --*/
        var str_len = $(this.element).get(0).selectionStart,
            new_str = '';
        for (var x = str_len; str_len > 0; str_len--) {
            new_str = val.substring(0,str_len-1) + val.substring(str_len);
            if ( this.options._mask.hasOwnProperty('consts') &&
                this.options._mask.consts.hasOwnProperty(str_len) ) {
                if ( str_len > 1 ) {
                    $(this.element).val(new_str);
                    val = new_str;
                }
                continue;
            } else {
                $(this.element).val(new_str);
                break;
            }
        }
        $(this.element).get(0).setSelectionRange(str_len-1,str_len-1);
        this.__set_help_msg('', 'good');
    },
