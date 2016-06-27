/*-----------------------------------------------------------------------*/
var te = te || {};
$(document).ready(function () {
/*-----------------------------------------------------------------------*/
te.init = function ( ) {
    var TblObj = { Qry:"Example" };
    $('body').data('SelectedFromList',false);
    te.BuildStaticTables();
    te.BuildDetailSubscreen();
    te.inLineCellEdits (TblObj);
}
/*---------------------------------------------------------------------------------------------*/
/*----          Custom select plug in                                                       ---*/
/*---------------------------------------------------------------------------------------------*/
$.fn.CustSelect = function( TblObj, instructs ) {
   this.each(function() {  
      var optionData = te.settings[this.parentNode.cellIndex].options,
          colName = te.settings[this.parentNode.cellIndex]['name'],
          colCnt = 1,
          width = 120,
          UseValueForKey = false,
          Filters = [];

      if ( colName.match(/StartTime/i) ) {
          optionData = $("body").data("start_times");
          colCnt = 4;
          width = 300,
          Filters = [ {'PM':'PM'}];
          UseValueForKey = true;
      }
      instructs.td = this.parentNode;
	  $(this).menuoptions({ "Data": optionData,
                                "ColumnCount" : colCnt, 
                                'Filters': Filters, 
                                'Width': width, 
                                'Height': 220,  
                                "UseValueForKey": UseValueForKey,
                                "onSelect": function(mo, data) {
                                    te.SaveCustomSelect ( TblObj, mo, data, instructs );
                                },
                                "ClearBtn": true,
                                "Sort": [] }); 
    });
};
/*------------------------------------------------------------------------------------------------------*/
te.get_hh_mm = function ( value, format ) {
     var hh = new Date(value).getHours(),
         ampm = "PM",
         mm = new Date(value).getMinutes();
     if ( hh < 12 ) {
         ampm = "AM";
     } else {
         hh -= 12;
     }
     hh = ( hh === 0 ) ? "12" : hh;
     hh = ( hh < 10 ) ? "0" + hh : hh;
     mm = ( mm < 10 ) ? "0" + mm : mm;
     if ( format == "hh_mm" ) {
         return hh + ":" + mm + " " + ampm;
     }
     if ( format == "hh_mm_ss" ) {
         ss = new Date(value).getSeconds();
         ms = new Date(value).getMilliseconds()
         return hh + ":" + mm + ":" + ss + "." + ms + " "+ ampm;
     }
}
/*-----------------------------------------------------------------------*/
te.AddApptMins = function ( StartTime, Duration ) {
   var epoch_time = new Date("Jan 1, " + new Date().getFullYear() + " " + StartTime).getTime() + Duration * 60000;
   return te.get_hh_mm ( epoch_time, "hh_mm" );
}
/*-----------------------------------------------------------------------*/
te.BuildStaticTables = function () {
    var last_time = ""
        earliest_time = '08:00 AM',
        latest_time = '09:45 PM';
    $("body").data("start_times", [ earliest_time ]);
    for (var t = 0; t <= 80; t += 1) {  
       last_time = te.AddApptMins($("body").data("start_times")[$("body").data("start_times").length-1], 15);
       $("body").data("start_times").push(last_time);   
       if ( last_time === latest_time ) { break; }
    }  
}
/*-----------------------------------------------------------------------*/
$.fn.AutoComp = function( TblObj ) {
    var $this;
    return this.each(function() {  // for every selector that has been associated with autocomplete
	$this = $(this);
        $this.autocomplete({
                source: function(request, response) {   
                       var matches, userdata, options = te.settings[$(this.element).parent().index()].options;
                       if ( request.term.length > 0 ) {
                          matches = $.grep(options, function(obj) { userdata = new RegExp(request.term, "i"); return obj.value.match(userdata); }); 
                          if ( matches.length > 0 ) {
                               response( matches );
                          } else { 
                               response({});
                          }
                       }
                       else {
                          response( options );
                       }
                },   
                open:  function( event, ui ) { 
                          // style the autocomplete
                          $(this).autocomplete('widget').css({'z-index': 15, 'height': '200px', 'overflow-y': 'scroll', 'font-size': '.9em'}); 
                          },
                minLength: 0,
                select: function( event, ui ) {
                        $('body').data('SelectedFromList',true);
                        /*--  console.log("selected flag = "+$('body').data('SelectedFromList')+" time = "+te.get_hh_mm ( Date.now(), "hh_mm_ss" ));  --*/
                        if ( $this.attr('hdnkey') && $this.attr('hdnkey') == "inlineedit" ) { 
                             // check to see if value has changed 
                             if ( $this.attr('value') != ui.item.value ) {
                                $(this).attr('newid',ui.item.value);
                                te.saveInlineEdit( TblObj, $(this).parent() );
                             } else { 
                                $(this).parent().text(ui.item.value); 
                             }
                             if ( event.keyCode == $.ui.keyCode.ENTER) {
                                $(this).trigger('focusout');
                             }
                        }
                     }
         }).focus(function() { $(this).autocomplete("search"); }); /*--  the focus function allows for first click to show all autosuggest options  --*/
    });
};
/*---------------------------------------------------------------------------------------------*/
te.SaveCustomSelect = function ( TblObj, mo, data, instructs ) {
    $('body').data('SelectedFromList',true);
    /*--  console.log("selected flag = "+$('body').data('SelectedFromList')+" time = "+te.get_hh_mm ( Date.now(), "hh_mm_ss" ));  --*/
    if ( instructs.inlineEdit ) {
        $(instructs.td).children('input').attr('newid', data.newVal); 
        $(instructs.td).children('input').attr('origvalue', 
                $(instructs.td).children('input').attr('value'));
        $(instructs.td).children('input').attr('menu_opt_key', data.newCode); 
        te.saveInlineEdit( TblObj, $(instructs.td) ); 
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.FormatMoney = function ( amt ) {
    var disp_val = amt;
    if ( disp_val === "" || disp_val === undefined ) {
        disp_val = 0.00;
    }
    return te.commaSeparateNumber(parseFloat(disp_val).toFixed(2));
}
/*------------------------------------------------------------------------------------------------------*/
te.inlineDatePicker = function ( TblObj, td ) {
    $(td.children).datepicker('destroy')
        .datepicker({ 
            dateFormat: 'M dd, yy', 
            onSelect: function (dateText, inst) { 
                $('body').data('SelectedFromList',true);
                /*--  console.log("selected flag = "+$('body').data('SelectedFromList')+" time = "+te.get_hh_mm ( Date.now(), "hh_mm_ss" ));  --*/
                if ( inst.lastVal != dateText ) {
                    $(td).children('input').attr('newid',dateText); 
                    $(td).children('input').attr('origvalue', inst.lastVal); 
                    te.saveInlineEdit( TblObj, $(td) ); 
                } 
            },
            showAnim: 'slideDown', 
            changeYear:true, 
            changeMonth:true });
    $(td).children('input').focus();
    $('ul.ui-autocomplete').css( 'display', "block" ); 
}
/*------------------------------------------------------------------------------------------------------*/
te.inlineAutoSuggest = function ( TblObj, OriginalContent, td) {
    // set the id of the input element, which is used to get the autocomplete data
    $(td.children).AutoComp( TblObj, "Edit", OriginalContent );
    var inp_width = te.settings[td.cellIndex]['width'];
    $(td).children('input').css('width', inp_width);
    $('ul.ui-autocomplete').css( 'maxWidth', "250px" ); 
    $(td).children('input').focus();
}
/*------------------------------------------------------------------------------------------------------*/
te.validateInput = function ( regex, value, td, errmsg ) {
    var colnm = te.settings[td.cellIndex]['name'];
    var match = value.match(new RegExp(regex));
    var tdtop =  $(td).offset().top, tdleft = $(td).offset().left;
    if ( ! ( match != null && match[0].length == value.length ) ){
        $('#ValidationErr')
            .append("<span id=ErMsgInr>"+colnm+" '"+value+"'<br>"+errmsg+"</span>")
            .css({ 'display':'block', 
                    'top': tdtop+40,
                    'left': tdleft-360,
                    'color': 'red',
                    'border':'2px solid red',
            });
        return false;
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.saveInlineEdit = function ( TblObj, td ) {
    /*-------------------------------------------------------*/
    /*--  ajax update should be inserted in this function  --*/
    /*-------------------------------------------------------*/
    var colnm = te.settings[td.index()]['name'];
    var newVal = td.children('input').attr('menu_opt_key') ? 
                    td.children('input').attr('menu_opt_key') : 
                    td.children('input').attr('newid');
    var OrigVal = td.children('input').attr('value');
    var ShowVal = td.children('input').attr('newid');
    if ( te.settings[td.index()]['type'] == "float" ) {
       ShowVal = te.commaSeparateNumber(parseFloat(ShowVal).toFixed(2));
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.getFloat = function ( TblObj, OriginalContent, td) {
    var inp_elem = $(td).children('input');
    var nocommas = inp_elem.val().replace(/,/, '');
    if ( te.validateInput ('^[-]{0,1}([.]{0,1}[0-9]+|[0-9]+[.]{0,1}[0-9]*)$',
                nocommas, td, "must be a number (like 12.99)" ) == false ) {
        te.closeInlineEdit ( TblObj, td, "restore_orig_val");
    } else {
        var Orig = OriginalContent.replace(/,/, ''); 
        var newVal = parseFloat(nocommas).toFixed(2);
        if ( newVal != Orig ) {
            var fmtVal = parseFloat(newVal).toFixed(2);
            $(td).children('input').attr('newid',fmtVal);
            $(td).children('input').attr('origvalue', fmtVal);
            te.saveInlineEdit( TblObj, $(td), "use_cur_val"  ); 
        } else {
            te.closeInlineEdit ( TblObj, td, "restore_orig_val");
        } 
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.inlineBlurActions = function ( TblObj, td ) {
    var colType = te.settings[td.cellIndex]['type'];
    if ( colType.match(/float/i) ) {
        te.getFloat ( TblObj, $(td).children('input').attr('value'), td); 
        return;   
    }
    if ( $(td).children().length > 0 && ! ( new RegExp(colType).test('date')) ) {
        te.closeInlineEdit ( TblObj, td, "use_cur_val" ); 
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.inLineBlurHandler = function ( TblObj ) {
     $('#'+TblObj.Qry+' tbody').off('focusout', 'td input').on('focusout','td input', function (event) {  
     var $this = this.parentNode ;
     var evt = event;
         setTimeout( function() { 
              te.inlineBlurActions( TblObj, $this );
         }, 100 );
    });
}
/*------------------------------------------------------------------------------------------------------*/
te.inlineCustomSelect = function ( TblObj, OriginalContent, td) {
    // set the id of the input element, which is used to get the autocomplete data
    var inp_elem = $(td).children('input');
    inp_elem.CustSelect( TblObj, { "ClearBtn": false, "inlineEdit": true, "td": td }); 
    $(td).children('input').focus(); 
}
/*------------------------------------------------------------------------------------------------------*/
te.clearInlineEdit = function ( td ) {
    var cellidx = td.cellIndex !== undefined ? td.cellIndex : td.index();
    $(td).parent().removeClass('highlighted');
    $('body').data('LastInlineCellIdx', -1);
    $('body').data('LastInlineRowIdx', -1);
    $('body').data('SelectedFromList',false);
    /*--  $("div#ui-datepicker-div").hide();   --*/
    if ( te.settings[cellidx]['type'].match(/custselect/i) ) {
       $('table#Example .ui-menuoptions').menuoptions('destroy');
    }
}
/*------------------------------------------------------------------------------------------------------*/
te.closeInlineEdit = function ( TblObj, td, flag) {
    if ( flag == "use_cur_val" ) {
        var val = $(td).children('input').val();
        var colType = te.settings[td.cellIndex]['type'];
        if ( colType.match(/autocompl|custselect|date/i) ) {
            if ( $('body').data('SelectedFromList') == true ) {
                 $(td).html( val ); // keep selected value & "close"
            } else { // in widget types, only change if widget is used
                 $(td).html( $(td).children('input').attr('value') ); 
            }
        } else { // non widget, save value as modified by user
            var newval =  $(td).children('input').val(),
                origval = $(td).children('input').attr('value');
            if ( newval != origval ) {
                $(td).children('input').attr('newid',$(td).children('input').val()); 
                $(td).children('input').attr('origvalue',$(td).children('input').val());
                te.saveInlineEdit( TblObj, $(td) ); 
            }
            if ( colType.match(/float/i) ) {
                val = te.commaSeparateNumber(parseFloat(val).toFixed(2));
            }
            $(td).html( val ); // keep user entry & "close" 
        }
    } else if ( flag == "restore_orig_val")  { 
        $(td).html( $(td).children('input').attr('value') );
    }
    te.clearInlineEdit( td ); 
}
/*------------------------------------------------------------------------------------------------------*/
te.inlineEditSetip = function ( ) {
    $('body').data('LastInlineCellIdx', -1);
    $('body').data('LastInlineRowIdx', -1);
    $('#ValidationErr button').off('click').on('click', function(e) {
        $('#ValidationErr span#ErMsgInr').remove();
        $('#ValidationErr').css({ 'display':'none'});
    });
}
/*------------------------------------------------------------------------------------------------------*/
te.inLineCellEdits = function ( TblObj ) {
    te.inlineEditSetip ( );
    te.inLineBlurHandler( TblObj );
    $('#'+TblObj.Qry+' tbody').off('click', 'td').on('click','td', function (event) { 
        if ( te.settings[this.cellIndex]['edit'] != 'read_only' ) {
            $('#ValidationErr span#ErMsgInr').remove();
            $('#ValidationErr').css({ 'display':'none'});
            var inputTxt = '<input type=search hdnkey=inlineedit value="';
            var OriginalContent = $(this).html();
            /*--  catch 2 consecutive clicks on the same 'opened' cell  --*/
            if ( $('body').data('LastInlineCellIdx') == this.cellIndex &&  
                $('body').data('LastInlineRowIdx') == this.parentNode.rowIndex &&
                ! OriginalContent.match(new RegExp(inputTxt)) ) {
                    return; 
            } 
            // only add the input html once
            if ( $(this).children('input').length < 1 ) {
                $(this).html(inputTxt + OriginalContent + '" />');
                var inp_width = te.settings[this.cellIndex]['width'];
                $(this).children('input').css('width', inp_width);
            } 
            if ( te.settings[this.cellIndex]['type'] == 'autocompl' ) {
                te.inlineAutoSuggest ( TblObj, OriginalContent, this);
            } else if ( te.settings[this.cellIndex]['type'] == 'date' ) {
                te.inlineDatePicker ( TblObj, this );
                $(this).children('input').focus();
            } else if ( te.settings[this.cellIndex]['type'] == 'custselect' ) {
                te.inlineCustomSelect ( TblObj, OriginalContent, this);
            } else { 
                $(this).children('input').focus();
            }
            $('body').data('LastInlineCellIdx', this.cellIndex);
            $('body').data('LastInlineRowIdx', this.parentNode.rowIndex);
        } 
    });
}
/*------------------------------------------------------------------------------------------------------*/
te.BuildDetailSubscreen = function ( ) {
        var ScreenData = {};
        ScreenData.Sorting=[[ 1, "asc" ]]
        ScreenData.aoColumnDefs =[ 
                { title: "Name", width: "140px", targets: 0, data:"Name" },
                { title: "Hire <br>Date", width: "110px", targets: 1, data:"HireDate", className: "editable" },  
                { title: "Home <br>Phone", width: "110px", targets: 2, data:"Phone" },
                { title: "Salary", width: "96px", data:"Salary",
                    render: function ( data, type, full, meta ) {  
                      return te.FormatMoney ( data); 
                     },
                    targets: 3, className: "editable"
                },
                { title: "Marital <br>Status", width: "100px", targets: 4, data:"MaritalStatus", className: "editable autocomp" },
                { title: "Employee <br>Type", width: "106px", targets: 5, data:"EmployeeType", className: "editable menuoptions" },
                { title: "Start <br>Time", width: "90px", targets: 6, data:"StartTime", className: "editable menuoptions" } ];
        DrawDetailSubscreen( ScreenData );
}
/*------------------------------------------------------------------------------------------------------*/
function DrawDetailSubscreen( ScreenData ) {
	$('<br /><div class=display style="width: 940px; table-layout:fixed;margin-left:120px; width:100%"><table id="'+
            'Example"></table></div>;')
        .insertAfter($("li:contains('MenuOptions select')"));
    te.oDetailTable = $('#Example').DataTable({                    
                    "dom":'<"H"<"ExtraRowName">>t<"F"iS>',
                    "jQueryUI": true,
                    "aaData":  te.data,
                    'columnDefs': ScreenData.aoColumnDefs,
                    "aaSorting": ScreenData.Sorting,
                    "scrollX": false,
                    "scrollY":$(window).height()-350 + "px",
                    "scrollCollapse": true,
                    oLanguage: {
                                  "emptyTable": "No "+ScreenData.SubTblTitle
                    }
        });
    $("div.ExtraRowName").html('Employee Information');  
}
/*-----------------------------------------------------------------------*/
te.commaSeparateNumber = function (val){
   while (/(\d+)(\d{3})/.test(val.toString())){
         val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
             }
                 return val;
}
/*------------------------------------------------------------------------*/
te.init()
});  
