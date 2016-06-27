    __set_arrow : function ( direction ) {
        var arr_dir = /down/.test(direction) ? 'top' : 'left';
        $('span[id="arr_' + this.options._ID + '"]').remove();
        if ( $(this.element).children('span.ui-button-text').length > 0 ) {
            $(this.element).children('span.ui-button-text').append("<span id=arr_" + this.options._ID + " class=" + direction + "_arrow></span>");
        } else {
            this.element.append("<span id=arr_" + this.options._ID + " class=" + direction + "_arrow></span>");
        }
        $('#arr_' + this.options._ID + '.' + direction + '_arrow').css('border-' + arr_dir, '4px solid ' + this.options.ShowDownArrow);
    },

    _show_menu_arrs : function () {
        if (/Navigate/.test(this.options.MenuOptionsType) && ! /None/i.test(this.options.ShowDownArrow)) {
            if ( $('button.navbar-toggle').length && 
                 /block/.test($('button.navbar-toggle').css('display')) && 
                $(this.element).closest('ul.navbar-nav').length ) {
                this.__set_arrow( "right" );
            } else if (/^right/i.test(this.options.ShowAt) ) {
                this.__set_arrow( "right" );
            } else {
                this.__set_arrow( "down" );
            }
        }
    },
