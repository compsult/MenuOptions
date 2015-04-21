/******************************************
 * menuoptions.org
 * -> requires jquery ui > 1.9
 *
 * Create menus over any element and 
 *  create select menus under input=text elements.
 *  Uses autocomplete and user configured 
 *  mouseover filtering
 *
 * @author          Mike Etts
 * @copyright       Copyright (c) 2014-2015
 * @license         Menu Options jQuery widget is licensed under the MIT license
 * @link            http://www.menuoptions.org
 * @docs            http://www.menuoptions.org
 * @version         Version 1.5.3-0
 *
 ******************************************/
  //
  //  TODO:
  //  1 - segregate private variables into their own object

$.widget( 'mre.menuoptions', {
  // default options
  options: {
    ClearBtn: true,   // if set, will clear the input field to it's left
    SelectOnly: false,  // if true, will not allow user to type input
    Data: '',  // pass in your array, object or array of objects here
    ColumnCount: 1, // display data in this number of columns
    UseValueForKey: false, // if user wants value = text()
    PlaceHolder: '', // placeholder attribute
    Width: '', // let user specify the exact width they want
    ShowAt: 'bottom', // 'bottom' or 'right' are the options
    Sort: ['alpha', 'asc' ], // options [ 'alpha'|'num', 'asc'|'desc' ]
    Filters: [], // header filters (pass mouse over them & they filter choices)
    MenuOptionsType: 'Select', //other option is Navigate (run JS,follow href)
    DisableHiLiting : false, // set to true to disable autocomplete highlighting
    _ID: 'UnIqDrOpDoWnSeLeCt', // will be substituted later by the eventNamespace
    _prev_event : '',
    _prev_target : '',
    _prevXY : { X : 0, Y : 0 },
    _CurrentFilter: '',
    _orig_bg : '',
    _currTD : [ 0, 1 ],
    _event_ns : '', 
    _curr_img : '', 
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

  // the constructor
  _create: function() {

    var tablehtml='';

    if ( this.options.Data.toString() === '' ) { 
        this._validation_fail ('MenuOptions requires the Data parameter to be populated');
        return;
    }

    if ( this.options.ColumnCount < 1 ) { 
        this._validation_fail ('MenuOptions requires ColumnCount parameter be > 0');
        return;
    }

    this._set_options( );
    
    this._add_clear_btn();

    // make sure incoming data is in required format
    this.orig_objs = this.ary_of_objs = this._build_array_of_objs ();
    if ( this.orig_objs === false ) {
        this._validation_fail ('Invalid Data format supplied to menuoptions');
        return;
    }

    // create the select box
    this._buildDropDown( this.orig_objs ); 

    this._bindUIActions();

    this._detect_destroyed_input();

    this._refresh();

    $(this.element).addClass('ui-menuoptions');
    $(this.element).attr('autocomplete', 'off');
  },

  _validation_fail : function ( err_msg ) {
    alert (err_msg);
    this._destroy();
  },

  refreshData : function ( RefreshCfg ) {
      // re-create drop down select
      // Note: you have to use same option names
      var $dd_span = this;
      $(this.element).val(''); // in case there was text there before refresh
      $.each(RefreshCfg, function(key, value) {
          if ( $dd_span.options.hasOwnProperty(key) ) {
             $dd_span._setOption(key, RefreshCfg[key] ); 
          }
      });
      this._set_options();
      this.orig_objs = this.ary_of_objs = this._build_array_of_objs ();
      this._buildDropDown( this.orig_objs ); 
  },

  add_menuoption_key : function ( ) {
     var input_val = this.element.val();
     matchedRec = $.grep ( this.ary_of_objs, function(rec) { 
         return rec.val === input_val; });
     if ( matchedRec.length > 0 ) {
         $(this.element).attr('menu_opt_key', matchedRec[0].ky);
     }
  },

  _detect_destroyed_input: function ( ) {
      $(this.element).bind('remove', function(e) {
           this._destroy();
      });
  },

  _buildWholeDropDown: function ( e ) {

      if ( e.type === 'search'){ // clear menu_opt_key when input is cleared
         $(this.element).attr('menu_opt_key','');
      }
      if ( /Select/.test($(this.options)[0].MenuOptionsType) &&
           e.type === 'mouseenter' && this.options._prev_event === 'mouseenter' &&
           ! /(all)/.test($(e.target).text()) ) {
         return; // Firefox
      }
      if ( /Navigate/.test($(this.options)[0].MenuOptionsType) &&
             ( /mouseenter/.test(e.type) ) ) {
            $(this.options)[0]._curr_img = $(e.currentTarget);
      }
      /* if wholeDropDown is already visible and this is not 
         a mouseover filtering operation, just return */
      if ( $('table.CrEaTeDtAbLeStYlE').is(':visible') &&
           this.cached['.txtbox'].val().length === 0  && 
           $(this.options)[0]._CurrentFilter.length === 0 &&
            /Navigate/.test($(this.options)[0].MenuOptionsType)) { 
         return;
      }
      // prevents multiple consecutive calls - Firefox in particular
      if ( ( e.type === 'click' && this.options._prev_event === 'mouseenter' ) ||
           ( e.type === 'mousedown' && this.options._prev_event === 'mouseenter' ) ) {
         return;
      };
      this.options._currTD = [0, 1];
      this.options._prev_event = e.type;
      this.ary_of_objs = this.orig_objs;
      // if there is text in input, filter results accordingly
      if ( this.cached['.txtbox'].val().length ) { 
          this._processMatches( e, this.cached['.txtbox'].val(), true ); 
          return; 
      } 
      this._buildDropDown( this.orig_objs ); 
      this._showDropDown(e);
  },

  _buildFilteredDropDown: function ( event ) {
      this._buildDropDown( this.ary_of_objs ); 
      this._showDropDown(event);
  },

  _buildDropDown: function ( ary_of_objs ) {
      this._event_ns = this.eventNamespace.replace(/^\./,'')
      tablehtml=this._createHtmlTable( ary_of_objs );
      this.dropdownbox = $( tablehtml );
      this._cacheElements();
      this._calcDropBoxCoordinates();
  },

  _colorInputBorder : function ( StrToCheck, colorBorder ) {
      var select_str = '';
      if ( this.options.DisableHiLiting ) {
          return; 
      }
      var IsSearchStrValidAnsw = false;
      if ( colorBorder ) {
        IsSearchStrValidAnsw = $.grep(this.ary_of_objs, function(rec){ 
               // the replace is to ignore images user may have used
                select_str = rec.val.replace(/^ *<.*?>/, '');
                return StrToCheck.match( new RegExp(select_str,'i'));
        });
        if ( IsSearchStrValidAnsw.length === 0 ) {
           $(this.element).css({'border-color':'red' });
        } else {
           $(this.element).css({'border-color': this.options._orig_bg });
        }
      }
  },

  __triggerChoice : function ( event ) {
      var firstMenuItem = $('table.CrEaTeDtAbLeStYlE').find('td:first');
      this.element.val(firstMenuItem.text());
      this.element.attr('menu_opt_key', firstMenuItem.attr('menu_opt_key'));
      $(this.element).css({'border-color': this.options._orig_bg });
      this._trigger("onSelect", this, { 
                                       "newCode": $(event.target).attr('menu_opt_key'),
                                       "newVal" : firstMenuItem.text(),
                                       "type": "EnterKey" }); 
      this.cached['.dropdownspan'].remove();
  },

  __buildMatchAry : function ( event, StrToCheck, no_img ) {
      var matching = [],
          tmp = this.orig_objs,
          no_img ="";
      var lastChar = StrToCheck.charAt(StrToCheck.length - 1);
      if ( StrToCheck.match(/\{|\}|\\|\*|\(|\)|\./) && ! 
           ( $(this.options)[0].MenuOptionsType.match(/Navigate/i) ) ) {
        var newStr = [StrToCheck.slice(0,(StrToCheck.length-1)), '\\', lastChar].join('');
        StrToCheck = newStr;
      } 
      var RegExStr = new RegExp(StrToCheck.toLowerCase());
      matching = $.grep(this.orig_objs, function(o) { 
          no_img = o.val.replace(/<img.*>/, ''); 
          return no_img.toLowerCase().match(RegExStr); 
      });
      if ( matching.length === 1 && matching[0].val.toLowerCase() === RegExStr) {
          this.cached['.txtbox'].val(no_img_val);
      } else if ( matching.length === 0 ) { // cut chars not in any of the choices
            this.cached['.txtbox'].val(this.cached['.txtbox'].val().slice(0,-1));
      }
      return matching;
  },

  _processMatches : function ( event, StrToCheck, colorBorder ) {
      var matching = [],
          no_img_val = '';
      if ( StrToCheck !== '' ) {
         matching = this.__buildMatchAry ( event, StrToCheck, false );
         this.cached['.dropdownspan'].remove();
      }
      if (matching.length > 0) {
        // re-create drop down select
        this.ary_of_objs = matching;
        this._buildFilteredDropDown( event );
      } else {
        this._buildWholeDropDown( event); 
      }
      this._colorInputBorder(StrToCheck, colorBorder); 
  },

  _runHeaderFilters : function (event) {
     if ( this.cached['.txtbox'].val().length ) {
         // disable mouseover filters if user started autocomplete
         return;
     }
     // mouseover event continually fires during any move within the <td> cell
     if ( this.options._CurrentFilter === $(event.currentTarget).text() ) { 
          return; 
     } 
     // get text from header filter <td>
     var SearchStr = $(event.currentTarget).text();
     this.options._CurrentFilter=$(event.currentTarget).text();
     
     if ( $.isPlainObject(this.options.Filters[0]) ) { 
         if ( $(event.currentTarget).attr('menuopt_regex') ) {
             SearchStr = $(event.currentTarget).attr('menuopt_regex');
             this._processMatches( event,  SearchStr, false );    
         } else if ( $(event.currentTarget).text().match(/\(all\)/i) ) {
             this._buildWholeDropDown( event );
         } else {
             alert ('Filter key '+$(event.currentTarget).text()
                 +'does not have a matching regular expression');
         }
     } else { // assume array of scalars
          if ( $.inArray(SearchStr, this.options.Filters) > -1 ) {
              this._processMatches( event,  SearchStr, false );    
          } else {
               // if filter is not in list, user passed over ALL
               this._buildWholeDropDown( event );
          }
     }
  },

  _createFilterHeader : function ( ) {
     var TDary = [],
         objKey ='';
     if ( ! $.isPlainObject(this.options.Filters[0])) {   
         TDary=$.map(this.options.Filters, function (obj,idx) {  
                 return  '\t<td class=dflt>'+obj+'</td>\n';  }); 
         TDary.unshift('\t<td class=dflt>(all)</td>\n');
     } else { 
         $.each(this.options.Filters, function(key, value) {
              for (var p in value) { 
                  objKey = p; 
              }
              TDary.push('\t<td class=dflt menuopt_regex="'+value[p]+'">'
                          +objKey+'</td>\n'); 
         });
         TDary.unshift('\t<td class=dflt>(all)</td>\n');
     }
     return '\n<table id=HF_'+this._event_ns+' class=HdrFilter>\n<tr>\n'
             +TDary.join('')+'</tr>\n</table>\n'; 
  },

  _clearHx: function(e) {
    this.options._CurrentFilter = '';
  },

  _bindUIActions: function() {
     var ky = '',
         Sel = {},
         $elem = this;

    // build selector : function() object for table.HdrFilter
    ky = 'mouseenter span#SP_'+this.options._ID+' table#HF_'
         +this._event_ns+' td.dflt'; 
    Sel[ky]='_runHeaderFilters'; 
    ky = 'click span#SP_'+this.options._ID+' table#HF_'+this._event_ns+' td.dflt'; 
    Sel[ky]='_runHeaderFilters'; 
    ky = 'mouseleave  span#SP_'+this.options._ID+' table#HF_'+this._event_ns+' td.dflt'; 
    Sel[ky] = '_clearHx';
    this._on($('body'), Sel );

    // highlight the clear button
    this._on( this.cached['.clearBtn'], {
        'mouseleave': '_hiLiteOnOff',
        'mouseenter': '_hiLiteOnOff',
        'click': function(e) {
            $(this.element).val('');
            $(this.element).attr('menu_opt_key','');
            this._buildWholeDropDown( e );
        }
    });
    // bind events to this.element
    this._on( { 
        'mousedown':  '_buildWholeDropDown',
        'click':  '_buildWholeDropDown',
        'mouseenter':  '_buildWholeDropDown',
        'focus':  '_buildWholeDropDown',
        'search':  '_buildWholeDropDown',
        'mouseleave':  '_removeDropDown',
        'blur': '_removeDropDown',
    });
    // set mouseenter and mouseleave class for table cell
    this._on($('body'), {
        'mouseleave span table.CrEaTeDtAbLeStYlE td.dflt': '_hiLiteOnOff',
        'mouseenter span table.CrEaTeDtAbLeStYlE td.dflt': '_hiLiteOnOff'
    });

    // when user chooses (clicks), insert text into input box
    ky = 'mousedown span#SP_'+this.options._ID+' table.CrEaTeDtAbLeStYlE td ';
    Sel[ky]='_choiceSelected';
    this._on($('body'), Sel );

    // when mouse leaves the container, remove it from DOM
    ky = 'mouseleave span#SP_'+this.options._ID;
    Sel[ky]='_removeDropDown';
    this._on($('body'), Sel );

    // allow user to filter viewable choices
    this._on( this.cached['.txtbox'], {
       keypress: '_autocomplete',
       keydown: '_autocomplete',
       keyup: '_autocomplete',
    });
    
    //catch menu arrow keys
    $(document).keydown(function(e) {
        if ( /Navigate/.test($($elem.options)[0].MenuOptionsType) && 
                e.which == 13 && $($elem.options)[0]._curr_img ) {
            $elem._arrow_keys(e);
        }
    });
  },

  _arrow_keys: function(event) {
      var kc = event.keyCode;
      var $rt=39, $lt=37,$up=38,$dwn=40;
      if ( /keydown|keyup/.test(event.type) ) {
          if ( /keydown/.test(event.type) && 
               ( kc === $rt || kc === $lt || kc === $up || kc === $dwn)) { 
              return true; 
          }
          var arr_key_pressed=false,
              row = this.options._currTD[0],
              col = this.options._currTD[1];
          switch ( event.keyCode ) {
                case $.ui.keyCode.TAB:
                    return false; break;
                case $.ui.keyCode.RIGHT:
                    if ( col < $('.CrEaTeDtAbLeStYlE tbody tr:nth-child(1) td').length ) {
                       col = this.options._currTD[1] = this.options._currTD[1] + 1;
                    }
                    arr_key_pressed=true;
                    break;
                case $.ui.keyCode.LEFT:
                    if ( col > 1 ) {
                       col = this.options._currTD[1] = this.options._currTD[1] - 1;
                    }
                    arr_key_pressed=true;
                    break;
                case $.ui.keyCode.UP:
                    if ( row > 1 ) {
                       row = this.options._currTD[0] = this.options._currTD[0] - 1;
                    }
                    arr_key_pressed=true;
                    break;
                case $.ui.keyCode.DOWN:
                    if ( row < $('.CrEaTeDtAbLeStYlE tbody tr').length ) {
                       row = this.options._currTD[0] += 1;
                    }
                    arr_key_pressed=true;
                    break;
                case $.ui.keyCode.ENTER:
                    var highlited = $('.CrEaTeDtAbLeStYlE tr td.mo');
                    if ( highlited.length > 0 ) {
                        highlited.trigger('mousedown');
                    } 
                    break;
                case $.ui.keyCode.DELETE:
                    if ( $(this.options)[0].MenuOptionsType.match(/Select/i) &&
                         this.cached['.txtbox'].length === 0 ) {
                            /*--  this.cached['.txtbox'].val('');  --*/
                            this.cached['.dropdownspan'].remove();
                            $('.CrEaTeDtAbLeStYlE tr td').removeClass('mo');
                            this._buildWholeDropDown(event);
                    }
                    break; 
          }
          if ( arr_key_pressed==true ) {
            $('.CrEaTeDtAbLeStYlE tr td').removeClass('mo');
            $('.CrEaTeDtAbLeStYlE tr:nth-child('+row+') td:nth-child('+col+')').addClass('mo');
            return arr_key_pressed;
          }
      }
      return false;
  },

  _autocomplete: function(e) {
       if ( /keydown|keyup/.test(e.type) && this._arrow_keys(e) === true ) {  
          return;
      }
      if ( /Navigate/.test($(this.options)[0].MenuOptionsType) ) {
          return;
      }
      if ( e.keyCode === $.ui.keyCode.ENTER ) {
            e.preventDefault();
      }
      if ( /keydown/.test(e.type) ) {
          if ( this.cached['.txtbox'].is(':visible') && 
               e.keyCode === $.ui.keyCode.ENTER ||
               ( e.keyCode === $.ui.keyCode.TAB && 
                 this.cached['.txtbox'].val().length > 0 ) ) {
            this._processMatches( e, this.cached['.txtbox'].val(), true );
            this.__triggerChoice ( e );
            return;
          }
      }
      if ( /keyup/.test(e.type) || e.keyCode == $.ui.keyCode.BACKSPACE) {
        this._processMatches( e, this.cached['.txtbox'].val(), true );
      }
  },

  _hiLiteOnOff : function (event) {
     if ( $(event.target).attr('class').match(/clear_btn/) ) {
         $(event.target).toggleClass('ClearButtonMO');
     } 
     if ( $(event.target).attr('class').match(/ *dflt */) ) {
         if ( event.type === 'mouseenter' ) {
            $(event.target).addClass('mo');
         } else {
            $(event.target).removeClass('mo');
         }
     } 
  },

  // called when created, and later when changing options
  _refresh: function() {
  },

  _cacheElements: function() {
    var $dd_span = this.dropdownbox,
        $dropdowncells = this.dropdownbox.find('td'),
        $txtbox = this.element,
        $clearBtn = $( 'div#CB_'+this._event_ns);

    this.cached = {
      '.dropdownspan': $dd_span,
      '.dropdowncells': $dropdowncells,
      '.clearBtn': $clearBtn,
      '.txtbox': $txtbox
    };  

  },

  // _setOptions is called with a hash of all options that are changing
  // always refresh when changing options
  _setOptions: function() {
    // _super and _superApply handle keeping the right this-context
    this._superApply( arguments );
    this._refresh();
  },

  // _setOption is called for each individual option that is changing
  _setOption: function( key, value ) {
    this._super( key, value );
  },

  _set_options : function ( ) {
      if ( this.options.ShowAt.match(/^ *bottom *$/i) ) {
          this._setOption('ShowAt','left bottom');
      }
      else if ( this.options.ShowAt.match(/^ *right *$/i) ) {
          this._setOption('ShowAt','left top');
      }
      if ( this.options.SelectOnly ) {
          $(this.element).prop('readonly', true);
      }
      if ( this.options.PlaceHolder !== '' ) {
          $(this.element).prop('placeholder', this.options.PlaceHolder);
      }
      this._setOption('Data', this.options.Data); 
      this._setOption('_ID', this.eventNamespace.replace(/^\./,'')); 
      this._setOption('_orig_bg', $(this.element).css('background-color') );
  },

  /* 
    Pass in the results of serialize() to re_serialize and it will replace 
    values with values found in value.
    Sample call to re_serialize :
        $('input#times').menuoptions('re_serialize',$('form').serialize()); 
  */
  re_serialize : function ( serialize_str ) {
      var new_get_str ='';
      $.each(serialize_str.split('&'), function(k,v) {
          $.each(v.split('='), function (k2, v2) {
              if ( $('input[name="'+v2+'"]') && 
                  $('input[name="'+v2+'"]').attr('menu_opt_key') ) {
                  new_get_str += v2+'='
                      +$('input[name="'+v2+'"]').attr('menu_opt_key')+'&';  
              } else {
                  new_get_str += v2+'='+$('input[name="'+v2+'"]').val()+'&'; 
              }
              return false;
          });
      });
      return new_get_str.slice(0, -1);
  },

  _destroy : function () {
      $(this.element).removeClass('ui-menuoptions');
      $('span#SP_'+this.options._ID).remove();  
      this._super();
  },

 _runSort : function ( ary_of_objs ) {
    if ( this.options.Sort.length > 0 ) {
        sortInstruct = this.options.Sort;
        if ( sortInstruct[0].match(/alpha/i) && sortInstruct[1].match(/asc/i)) {
           ary_of_objs.sort( function(a,b) {return ( (a.val) > (b.val) ? 1 : 
                   ((b.val) > (a.val)) ? -1 : 0); });  
        }
        if ( sortInstruct[0].match(/alpha/i) && sortInstruct[1].match(/desc/i)) {
           ary_of_objs.sort( function(a,b) {return ( (a.val) < (b.val) ? 1 : 
                   ((b.val) < (a.val)) ? -1 : 0); });  
        }
        if ( sortInstruct[0].match(/num/i) && sortInstruct[1].match(/asc/i)) {
           ary_of_objs.sort( function(a,b) {return ( a - b ); });  
        }
        if ( sortInstruct[0].match(/num/i) && sortInstruct[1].match(/desc/i)) {
           ary_of_objs.sort( function(a,b) {return ( b - a ); });  
        }
    }
 },
 _createHtmlTable : function ( ary_of_objs ) {
    var buffer= '', 
        TDary = [],
        RowCnt=0,
        start_ofs=0,
        html='',
        $dd_span=this;

    // sort as per default or user specification
    this._runSort( ary_of_objs );
    // set val = key attr
    if ( this.options.UseValueForKey === true ) {
        $.each(ary_of_objs, function(k, v) { v.val = v.ky; });
    } 
    while ( RowCnt * this.options.ColumnCount < ary_of_objs.length ) {
        start_ofs = RowCnt === 0 ? 0 : (RowCnt * this.options.ColumnCount);
        subary=ary_of_objs.slice(start_ofs, start_ofs+this.options.ColumnCount);
        TDary=$.map(subary, function (obj,idx) { 
            if ( ! $.isFunction(obj.ky) && obj.ky.match(/divider/i) && 
                 $dd_span.options.MenuOptionsType === 'Navigate') { 
                // for menu's, a non clickable divider row (for categories, etc)
                return  '\t<td class='+obj.ky +'>'+obj.val+'</td>\n'; 
            } else {
                return  '\t<td class=dflt menu_opt_key="'+obj.ky
                            +'">'+obj.val+'</td>\n'; 
            }
        });
        // pad with empty cells (if necessary) to match TD count of other rows
        for ( i=subary.length+1; i <= this.options.ColumnCount; i += 1) {
            TDary.push('<td class=dflt menu_opt_key="">&nbsp;</td>');
        }
        buffer += '<tr>\n'+TDary.join('')+'</tr>\n';
        RowCnt += 1;
    }
    buffer='<table class=CrEaTeDtAbLeStYlE cellpadding=4px>\n'
            + buffer + '</table>';
    if ( this.options.Filters.length ) {
        buffer=this._createFilterHeader()+buffer;
    }
    html='<span id=SP_'+this.options._ID+'>'+buffer+'\n</span>'; 
    return html;
 },

 _add_clear_btn : function ( ) {
     if (this.options.ClearBtn && this.options.MenuOptionsType === 'Select') {
         ClrBtn = '<div class=clear_btn id=CB_'+this.eventNamespace.replace(/^\./,'')+'></div>';
         $(this.element).after(ClrBtn); 
     }
 },

 _obj_create : function ( ary_of_objs, value ) {
     if ( $.isArray(value) == true ) {
         ary_of_objs.push({ ky: value[0], val: value[1] });
     } else {
        for (var p in value) {
            if (value.hasOwnProperty(p)) {
                ary_of_objs.push({ ky: p, val: value[p] });  
            } else { 
                alert("Data error: Key with no value error"
                +" in incoming Data parameter");
                return false;
            }
        }
     }
     return true;
 },

 _build_array_of_objs : function ( ) {
     var $dd_span = this,
         ary_of_objs=[];
     if ( typeof $dd_span.options.Data[0] === 'string' ) {
        /*--  take 1 dimensional array and make array of objs  --*/
         ary_of_objs=$.map($dd_span.options.Data, function (k,v) { 
             return { ky: k, val: k }; });
     } else {
        $.each($dd_span.options.Data, function(key, value) {
            if ( ! $.isArray($dd_span.options.Data) ) {
                // handle single object
                ary_of_objs.push({ ky: key, val: value });
            } 
            else if ( $.isPlainObject($dd_span.options.Data[0]) ) {
                // handle array of objects
                if ( $dd_span._obj_create(ary_of_objs, value) === false ) {
                    return false;
                }
            }
            else if ( $.isArray($dd_span.options.Data[0]) ) {
                // handle array of arrays
                $dd_span._obj_create(ary_of_objs, value);
            }
            $dd_span.total_rec_cnt += 1;
        });
     }
      if ( $dd_span.options.MenuOptionsType === 'Navigate' ) {  
          // reverse key value pair 
          ary_of_objs=$.map(ary_of_objs, function (k,v) {  
              return { ky: k.val, val: k.ky };  
          }); 
      } 
     return ary_of_objs;
 },

 _runMenuItem : function (e) {
    // the replace below is to strip out images
    var SelectedCellValue = $(e.target).text().replace(/^<.*>/, '');
    var MatchedObjects = $.grep(this.ary_of_objs, function(rec){ 
                        return SelectedCellValue === 
                            rec.val.replace(/^< *img.*?>/, ''); });
    if ( MatchedObjects && MatchedObjects.length > 0 ) {
        if ( $.isFunction(MatchedObjects[0].ky) ) {
            MatchedObjects[0].ky.call();
        } else {
            if ( ! $(e.target).attr('class').match(/divider/i) ) {
               window.open(MatchedObjects[0].ky);
            }
        }
    }
 },

_choiceSelected : function (e) {
    // dup click event sent (???), screen out 2nd
    if ( $(e.currentTarget).text() === this._prev_target && 
        e.pageX === this.options._prevXY.X && 
        e.pageY === this.options._prevXY.Y ) { 
        return; 
    } 
    this._prev_target=$(e.currentTarget).text();
    this.options._prevXY.X=e.pageX;
    this.options._prevXY.Y=e.pageY;
    this.options._prev_event=e.type;
    var $dd_span = this;
    if ( $dd_span.options.MenuOptionsType === 'Select' ) { 
        var newVal = $.trim($(e.target).text());
        $dd_span.element.val(newVal);
        $dd_span._trigger("onSelect", $dd_span, { 
              "newCode" : $(e.target).attr('menu_opt_key'),
              "newVal" : newVal,
              "type": "Click"
        }); 
        $dd_span.element.attr('menu_opt_key',$(e.target).attr('menu_opt_key'));  
        e.target.className=e.target.className.replace(/ mo/,'');
    } else {
        this._runMenuItem (e);
    }
    /*--  reset mouseover class in the cached elements  --*/
    $(this.cached['.dropdowncells']).removeClass('mo');
    // once user clicks their choice, remove dropdown span from DOM
    $dd_span.cached['.dropdownspan'].remove();
    $(this.element).css({'border-color': this.options._orig_bg });
},

_calcDropBoxCoordinates : function () {
    // figure out the coords of the select box
    // ( the top & bottom adjustments provide overlap between 
    // element & drop down||right )
      this.options._menu_box.top = this.cached['.dropdownspan'].position().top;
      this.options._menu_box.bottom = this.options._menu_box.top 
          + this.cached['.dropdownspan'].height();
      this.options._menu_box.left = this.cached['.dropdownspan'].position().left;
      this.options._menu_box.right = this.options._menu_box.left 
          + this.cached['.dropdownspan'].width();
}, 

_didMouseExitDropDown: function (e) {
    // this is where mouse is inside drop down 
    if ( e.pageX + 1 > this.options._menu_box.left  && 
         e.pageX < this.options._menu_box.right && 
         e.pageY + 1 > this.options._menu_box.top && 
         e.pageY < this.options._menu_box.bottom ) {
            return false;
    } else { // mouse is outside drop down
            return true;
    }
},

_removeDropDown : function (e) {
   if ( /Navigate/.test($(this.options)[0].MenuOptionsType) &&
      ( /mouseleave/.test(e.type) ) ) {
        $(this.options)[0]._curr_img = null;
   }
   this.options._prev_event = e.type;
   // prevent 2 calls in a row (we trigger one by calling .blur() )
   if ( e.type === 'blur' && this.options._prev_event === 'mouseleave' ) { 
       return;
   };
    // is the mouse over the drop down? If not, remove it from DOM
  if ( $('span#SP_'+this.options._ID).length ) {  
    if ( this._didMouseExitDropDown(e) === true ) {
         this.cached['.dropdownspan'].remove();
    }
  }
},

_resetOffsetOfDropDown: function () {
    // If the menu width was changed, 
    //    test to see if it changed it's original offsets
    // If it did, re-align menu to parent element
    if ( $dd_span.menu_start_loc.left !== 
            $dd_span.cached['.dropdownspan'].offset().left || 
            $dd_span.menu_start_loc.top !== 
            $dd_span.cached['.dropdownspan'].offset().top ) {
        if ( $dd_span.cached['.dropdownspan'] && 
                $dd_span.cached['.dropdownspan'][0] ) {
                $dd_span.options._width_adj.width_adjustment = 
                    parseInt($dd_span.cached['.dropdownspan'][0].style.left) + 
                    ( ( $dd_span.options._width_adj.width_after_adj - 
                    $dd_span.options._width_adj.width_menu) / 2 );
                $dd_span.cached['.dropdownspan'].css({ 'left': 
                    $dd_span.options._width_adj.width_adjustment }); 
        }
    } 
},

_addDropDownToDOM : function () {
    var $dd_span = this;

    // only one dropdown at a time
    $('body span[id^="SP_menuoption"]').remove()

    this.dropdownbox
            .appendTo('body')  
            .hide(1)  
            .position ({      
                of:  this.element,
                my: 'left top',  
                at : $dd_span.options.ShowAt,
                collision: 'flipfit'  
            });  
},

_showDropDown : function (event) {
    var $dd_span = this;

    this._addDropDownToDOM(); 
    $('span#SP_'+$dd_span.options._ID).css({  zIndex: 9999 });  
    this._getAndSetDropDownWidth();
    // show the menu
    $dd_span.cached['.dropdownspan']
        .stop(true,false)
        .show();
    $('table.CrEaTeDtAbLeStYlE').find('tr:even').addClass('even');
    $('table.CrEaTeDtAbLeStYlE').find('tr:odd').addClass('odd');
    this._refresh(); 
    this._calcDropBoxCoordinates();
 },

_getAndSetDropDownWidth : function () {
    var $dd_span = this,
        menu_width = parseInt($('span#SP_'+$dd_span.options._ID).css('width'),10);
    $dd_span.menu_start_loc = $dd_span.cached['.dropdownspan'].offset();
    $dd_span.options._width_adj.width_menu = menu_width;
    $dd_span.options._width_adj.width_after_adj = ( menu_width >  
            $(this.element).width()) ?  menu_width : $(this.element).outerWidth();  
    if ( $dd_span.options.Width !== '' && $dd_span.options.Width !== 0) {  
        // if user specified width, use that width
        $dd_span.options._width_adj.width_after_adj = (parseInt($dd_span.options.Width));  
    }  
    // set the width
   $('span#SP_'+$dd_span.options._ID+', span#SP_'+$dd_span.options._ID+ 
             ' > table').css({  'width': $dd_span.options._width_adj.width_after_adj });   
   if ( this.options.ShowAt.match(/left.*bottom.*/i) ) {
       $('span#SP_'+$dd_span.options._ID)
           .offset({left:$(this.element).offset().left});
   } else {
       $('span#SP_'+$dd_span.options._ID)
           .offset({left:$(this.element).offset().left+$(this.element).outerWidth() });
   }
},

});
