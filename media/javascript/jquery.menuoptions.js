/******************************************
 * menuoptions.org
 *
 * Create menus over any element and create select menus under input=text elements
 *
 * @author          Mike Etts
 * @copyright       Copyright (c) 2013 
 * @license         Menu Options jQuery plug-in is licensed under the MIT license
 * @link            http://www.menuoptions.org
 * @docs            http://www.menuoptions.org
 * @version         Version 1.0
 *
 ******************************************/
;(function ( $, window, document, undefined ) {

    var defaults = {
	   "ClearBtn": false,   // if set, will clear the input field to it's left
	   "SelectOnly": false,  // if true, will not allow user to type input, only values from the select box will be allowed
	   "ID": "UnIqDrOpDoWnSeLeCt",
	   "Data": "",  // pass in your array, object or array of objects here
	   "ColumnCount" : 1,
	   "UseValueForKey": false,
	   "PlaceHolder": "",
	   "Width": "",
	   "ShowAt": "bottom",
	   "Sort": true,
	   "MenuOptionsType": "Select" // the other option is Navigate, to run JS or follow an href
        };

    // constructor
    function MenuOptions( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this.total_rec_cnt = 0;
        this.menu_start_loc = {};
        this.menu_box = { 
                          top : 0,
                          bottom : 0,
                          left : 0,
                          right : 0,
                          overlap : 1
                        };
        this.width_adj = { 
                            width_menu : 0, 
                            width_adjustment : 0, 
                            width_after_adj : 0
                        };
        this.original_width = 0;
        this.ary_of_objs = [];
	this.html = "";
        this.init();
    }

    MenuOptions.prototype = {
       re_serialize : function ( get_string ) {
            var new_get_str ="";
            $.each(get_string.split('&'), function(k,v) {
                 $.each(v.split('='), function (k2, v2) {
                  if ( $('input[name="'+v2+'"]') && $('input[name="'+v2+'"]').attr('key') ) {
                      new_get_str += v2+"="+$('input[name="'+v2+'"]').attr('key')+"&";  
                    } else {
                      new_get_str += v2+"="+$('input[name="'+v2+'"]').val()+"&"; 
                    }
                    return false;
                  });
               });
              return new_get_str.slice(0, -1);
       },

       build_html : function ( base ) {
           var TDcnt=1, 
           Row=1,
           buffer= "<table class=CrEaTeDtAbLeStYlE cellpadding=4px >";
           base.build_array_of_objs ( base );
           if (!( base.options.Data instanceof Array ) || base.options.Data[0] instanceof Object ) { // handle single object or an array of objects
              /*--  this.ary_of_objs.sort(function(a,b) {return (parseInt(a.ky,10) > parseInt(b.ky,10)) ? 1 : ((parseInt(b.ky,10) > parseInt(a.ky,10)) ? -1 : 0);} );  --*/
              if ( base.options.Sort === true ) { 
                  this.ary_of_objs.sort(function(a,b) {return ((a.val) > (b.val) ? 1 : ((b.val) > (a.val)) ? -1 : 0);} );
              }
              if ( base.options.UseValueForKey === true ) {
                  $.each(this.ary_of_objs, function(k, v) { v.val = v.ky; });
              }
              if ( base.options.ColumnCount === 1 ) {
                  $.each(this.ary_of_objs, function(k, v) { 
                     buffer+=(( Row % 2 === 0 ) ? "<tr class=even><td class=dflt key='"+v.ky+"'>"+v.val+"</td></tr>" : "<tr class=odd><td class=dflt key='"+v.ky+"'>"+v.val+"</td></tr>");
                     Row += 1;
                  });
              } else {
                  buffer += "<tr class=odd>";
                  $.each(this.ary_of_objs, function(k, v) { 
                      TDcnt += 1;
                      buffer += "<td class=dflt key='"+v.ky+"'>"+v.val+"</td>";
                      if ( TDcnt > 1  && ((TDcnt-1) % base.options.ColumnCount) === 0 ) { 
                          if ( Row*base.options.ColumnCount < base.total_rec_cnt ) {  
                            Row += 1; 
                            buffer+="</tr>"; 
                            buffer+=(( Row % 2 === 0 ) ? "<tr class=even>" : "<tr class=odd>"); 
                          }  
                         TDcnt=1; 
                      } 
                  });
              }
           } else {
              if ( base.options.ColumnCount === 1 ) {
                 $.each(base.options.Data, function(key, value) {
                     if ( base.options.UseValueForKey === true ) {
                         buffer+=(( Row % 2 === 0 ) ? "<tr class=even><td class=dflt key='"+value+"'>"+value+"</td></tr>" : "<tr class=odd><td class=dflt key="+value+">"+value+"</td></tr>");
                     } else { 
                         buffer+=(( Row % 2 === 0 ) ? "<tr class=even><td class=dflt key='"+key+"'>"+value+"</td></tr>" : "<tr class=odd><td class=dflt key="+key+">"+value+"</td></tr>");
                     }
                     Row += 1;
                 });
              } else {
                  buffer+="<tr class=odd>";
                  $.each(base.options.Data, function(key, value) {
                      TDcnt += 1;
                      if ( base.options.UseValueForKey === true ) { 
                         buffer+="<td class=dflt key='"+value+"'>"+value+"</td>";
                      } else {
                         buffer+="<td class=dflt key='"+key+"'>"+value+"</td>";
                      }
                      if ( key && (key+1) % base.options.ColumnCount === 0 ) {
                         if ( Row*base.options.ColumnCount < base.total_rec_cnt ) {
                            Row += 1;
                            buffer+="</tr>";
                            buffer+=(( Row % 2 === 0 ) ? "<tr class=even>" : "<tr class=odd>");
                         }
                         TDcnt=1;
                      }
                  });
              }
           }
           if ( TDcnt > 1 ) { 
              for ( pad=TDcnt; pad <= base.options.ColumnCount; pad += 1) {
                  buffer+="<td class=dflt key=''>&nbsp;</td>";
              }
           } 
           if ( base.options.ColumnCount > 1 ) {
              buffer+="</tr>";
           }
           buffer+="</table>";
            if ( base.options.MenuOptionsType === "Navigate" ) { // delete all the key props or attr 
                base.html=buffer.replace(/ key='.*?>/ig, '>') 
            } else { // keep the key props or attr 
               base.html=buffer; 
            } 
    },

    add_clear_btn : function ( base ) {
        if (base.options.ClearBtn && base.options.MenuOptionsType === "Select") {
            var ClrBtn = "<div class=clear_btn onclick=\"$(this).prev('input').val('');$(this).prev('input').prop('key','');\"></div>";
            $(this.element).after(ClrBtn); 
            $('div.clear_btn').on ('mouseenter mouseleave', function() {
                $(this).toggleClass('ClearButtonMO');
            });
        }
    },

    build_array_of_objs : function ( base ) {
        $.each(base.options.Data, function(key, value) {
           if (!( base.options.Data instanceof Array )) {
              base.ary_of_objs.push({ ky: key, val: value });
           } 
           else if ( base.options.Data[0] instanceof Object ) { 
              base.ary_of_objs.push({ ky : value.id , val: value.value });
           }
           base.total_rec_cnt += 1;
        });
        if ( base.options.MenuOptionsType === "Navigate" ) { // reverse key value pair
           base.ary_of_objs=$.map(base.ary_of_objs, function (k,v) { 
                     return { ky: k.val, val: k.ky }; 
           });
        }
    },

    set_options : function ( base ) {
         if ( base.options.ShowAt.match(/^ *bottom *$/i) ) {
	     base.options.ShowAt= "left bottom";
         }
         else if ( base.options.ShowAt.match(/^ *right *$/i) ) {
             base.options.ShowAt="right top";
         }
         if ( base.options.SelectOnly ) {
             $(this.element).prop("readonly", true);
         }
         if ( base.options.PlaceHolder !== "" ) {
             $(this.element).prop("placeholder", base.options.PlaceHolder);
         }
         if ( base.options.Data.toString() !== "" ) { 
             base.build_html ( base );
         }
    },

    init : function () {
         var base = this,
             SelectedCellValue = "",
             MatchedObjects;
             base.set_options( base );
         base.add_clear_btn( base );
        $(this.element).on('mouseenter', function(e) {
             $('span#'+base.options.ID).remove(); /*-- remove any stragglers --*/
             // create the select or menu and hide it.
             $("<span id="+base.options.ID+">" + base.html + "</span>")   
                        .appendTo('body')  
                        .hide(1)  
                        .position ({      
                          of:  this,  
                          my: 'left top',  
                          at : base.options.ShowAt,
                          collision: 'flipfit'  
                        });  
             // set mouseenter and mouseleave class for table cell
             $('span#' + base.options.ID + ' tbody td').on('mouseenter', function(e) {
                      this.className=this.className.replace(/$/,' mo');
              });
             $('span#' + base.options.ID + ' tbody td').on('mouseleave', function(e) {
                      this.className=this.className.replace(/ mo/,'');
             });
             // for input select, insert text into input box
             $('span#' + base.options.ID + ' tbody td').on('click', function() { 
                  if ( base.options.MenuOptionsType === "Select" ) { 
                     $(base.element).val($.trim($(this).text())); 
                     $(base.element).attr('key',$(this).attr('key'));  
                  } else {
                     SelectedCellValue = $(this).html().replace(/^<.*>/, "");
                     MatchedObjects = $.grep(base.ary_of_objs, function(rec){ 
                                         return SelectedCellValue === rec.val.replace(/^<.*>/, ""); });
                     if ( MatchedObjects && MatchedObjects.length > 0 ) {
                        if ( $.isFunction(MatchedObjects[0].ky) ) {
                           MatchedObjects[0].ky.call();
                        } else {
                           window.open(MatchedObjects[0].ky);
                        }
                     }
                  }
                  $('span#'+base.options.ID).remove(); 
             });
             // when mouse leaves the container, remove it from DOM
             $('span#'+base.options.ID).on('mouseleave', function(e) {
                     $('span#'+base.options.ID).remove();  
             });
             $("span#"+base.options.ID+", span#"+base.options.ID+" > table").css({  zIndex: 9999 });  
             base.menu_start_loc = $('span#'+base.options.ID).offset();
             base.width_adj.width_menu = parseInt($("span#"+base.options.ID+" > table").css('width'),10); 
             base.width_adj.width_after_adj = (parseInt($("span#"+base.options.ID+" > table").css('width'),10) > $(this).width()) ? parseInt($("span#"+base.options.ID+" > table").css('width'),10) : $(this).width(); 
             if ( base.options.Width !== "" ) {  // if user specified width, it trumps all
                 base.width_adj.width_after_adj = (parseInt(base.options.Width));  
             }  
             $("span#"+base.options.ID+", span#"+base.options.ID+" > table").css({  "width": base.width_adj.width_after_adj });  
             // show the menu
             $('span#'+base.options.ID) 
                    .stop(true,false)
                    .show();
             // if the menu width was changed, test to see if it changed it's original offsets
             // If it did, re-align menu to parent element
             if ( base.menu_start_loc.left !== $('span#'+base.options.ID).offset().left || base.menu_start_loc.top !== $('span#'+base.options.ID).offset().top ) {
                if ( $("span#"+base.options.ID) && $("span#"+base.options.ID)[0] ) {
                    base.width_adj.width_adjustment = parseInt($("span#"+base.options.ID)[0].style.left) + ( ( base.width_adj.width_after_adj - base.width_adj.width_menu) / 2 );
                    $('span#'+base.options.ID).css({ "left": base.width_adj.width_adjustment }); 
                }
              } 
         });  
         $(this.element).on('mouseleave', function(e) {
               // the top & bottom adjustments provide overlap between element & drop down||right
               base.menu_box.top = $('span#'+base.options.ID).position().top - base.menu_box.overlap;
               base.menu_box.bottom = base.menu_box.top + $('span#'+base.options.ID).height() + base.menu_box.overlap;
               base.menu_box.left = $('span#'+base.options.ID).position().left - base.menu_box.overlap;
               base.menu_box.right = base.menu_box.left + $('span#'+base.options.ID).width();
               // is the mouse over the drop down? If not, remove it from DOM
               if ( ! ( e.pageX >= base.menu_box.left && e.pageX <= base.menu_box.right && e.pageY >= base.menu_box.top && e.pageY <= base.menu_box.bottom ) ) {
                      $('span#'+base.options.ID).remove();  
               }
         });
       }
   };

    $.fn['menuoptions'] = function ( options ) {
        if ( options.Utility !== "" && $.isFunction(MenuOptions.prototype[options.Utility]) ) {
            return MenuOptions.prototype[options.Utility].call(this,options.data);
        } else {
            return this.each(function () {
                if (!$.data(this, 'plugin_menuoptions')) {
                    $.data(this, 'plugin_menuoptions', new MenuOptions( this, options ));
                }
            });
        }
    };

})( jQuery, window, document );
