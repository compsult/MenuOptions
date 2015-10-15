/*-----------------------------------------------------------------------*/
var te = te || {};
$(document).ready(function () {
/*-----------------------------------------------------------------------*/
te.buildMenu = function ( ) {
    var menu =  '<p class=menu_left>Menu Examples</p>'+
        '<a class=underl_sm href='+te.root+'QuickStartMenu.html>Quick start menu</a><br>'+
        '<a class=underl_sm href='+te.root+'MenusBottom.html>Drop down menus</a></br>'+
        '<a class=underl_sm href='+te.root+'Dividers.html>Menu with dividers</a><br>'+
        '<a class=underl_sm href='+te.root+'RightMenu.html>Right side menus</a><br>'+
         '<a class=underl_sm href='+te.root+'bootstrap_ex.html>Bootstrap example</a>'+ 
        '<p class=menu_left>Select Examples</p>'+
        '<a class=underl_sm href='+te.root+'QuickStartSelect.html>Quick start select</a><br>'+
        '<a class=underl_sm href='+te.root+'InlinEdit.html>Inline edit</a></br>'+
        '<a class=underl_sm href='+te.root+'SelectWithImages.html>Select with images</a><br>'+
        '<a class=underl_sm href='+te.root+'Serialize.html>Serialize (re_serialize)</a><br>'+
        '<a class=underl_sm href='+te.root+'MultiSelect.html>Multiple select lists</a><br>'+
        '<a class=underl_sm href='+te.root+'ReloadMenuOptions.html>Dynamically reloading</a><br>'+
        '<p class=menu_left>Rocker Examples</p>'+
        '<a class=underl_sm href='+te.root+'RockerControl.html>Rocker switch</a><br>'+
        '<p class=menu_left>Download</p>'+
        '<a class=underl_sm href="https://github.com/compsult/MenuOptions">github</a><br>'+
        '<a class=underl_sm href="https://www.npmjs.com/package/menuoptions">npm</a><br><br>';
    if ( /^MenuOptions$/.test($('body div#rightcolumn > h1').text()) ) { 
         menu += '<a href="https://travis-ci.org/compsult/MenuOptions"><img src="https://travis-ci.org/compsult/MenuOptions.svg?branch=1.7.1-2"></a><br>';
         menu += '<a href="https://saucelabs.com/u/compsult"><img src="https://saucelabs.com/buildstatus/compsult" alt="Sauce Test Status"/></a><br>';
         menu += '<a href="http://menuoptions.readthedocs.org/en/latest/"><img src="https://readthedocs.org/projects/menuoptions/badge/?version=latest" alt="ReadTheDocs Status"/></a>';
    }
    return menu;
}
te.examplelist = function ( ) {
    if ( te.scroll == true ) {
        $('body').css({ "background":"white", "margin": "0px auto", "height":"100%", "padding": "0px", "width": "1200px", "height":"1700px"}); 
        $('html').css({ "text-align":"center"}); 
    }
    $('h1:first').after("<table style='margin-left:auto;margin-right:auto;font-size:18px;margin-top:-10px;'>"+
        "<tr>"+
           "<td><a class='underl examplemenu' href='#'>All examples</a></td>"+
            "<td><a class='underl docmenu' style='margin-left:20px;' href='http://menuoptions.readthedocs.org/en/latest/'>Documentation</a></td>"+
            "<td><a class='underl dwnldmenu' style='margin-left:20px;' href='https://www.npmjs.org/package/menuoptions'>Download</a></td>"+
            "<td><a class='underl chglog' style='margin-left:20px;' href='#'>Change log</a></td>"+
        "</tr>"+
    "</table><br />");
    $('div#leftcolumn').prepend( te.buildMenu() );
    var Menu_w_Dividers =[ {  'Menu examples'  :'divider' }, 
                {  'Quick start menu'  : te.root+'QuickStartMenu.html'}, 
                {  'Drop down menus'  : te.root+'MenusBottom.html' },
                {  'Menu with dividers'  : te.root+'Dividers.html' }, 
                {  'Right side menus'  : te.root+'RightMenu.html' }, 
                 {  'Bootstrap menu example' : te.root+'bootstrap_ex.html' }, 
                {  'Select list examples'  : 'divider' }, 
                {  'Quick Start select' : te.root+'QuickStartSelect.html'}, 
                {  'Inline edit'  : te.root+'InlinEdit.html' }, 
                {  'Select with images' : te.root+'SelectWithImages.html' },
                {  'Serialize (re_serialize)':  te.root+'Serialize.html' },
                {  'Multiple select lists':  te.root+'MultiSelect.html' },
                {  'Dynamically reloading':  te.root+'ReloadMenuOptions.html' },
                {  'Rocker examples'  : 'divider' }, 
                {  'Rocker switch':  te.root+'RockerControl.html' } ];

	  $('a.examplemenu').menuoptions({ 
           'Data': Menu_w_Dividers,
           'Width':170,
           'MenuOptionsType': 'Navigate', 
           'Sort': []
      }); 
    var Docs =[ {  'Another input widget, really?'  :'http://menuoptions.readthedocs.org/en/latest/FAQ.html#why-do-we-need-another-input-widget' }, 
                {  'All documentation'  :'http://menuoptions.readthedocs.org/en/latest/index.html' }, 
                {  'Quick start instructions'  :'http://menuoptions.readthedocs.org/en/latest/QuickStart.html' },
                {  'Menu reference'  :'http://menuoptions.readthedocs.org/en/latest/MenuParams.html' },
                {  'Select list  reference'  :'http://menuoptions.readthedocs.org/en/latest/SelectParams.html' },
                {  'Re-serialize reference'  :'http://menuoptions.readthedocs.org/en/latest/Serialize.html' },
                {  'User methods': 'http://menuoptions.readthedocs.org/en/latest/UserMethods.html' },
                {  'I want to use scrolling': 'http://menuoptions.readthedocs.org/en/latest/FAQ.html/#how-can-i-create-a-vertical-scroll-bar-for-large-lists' },
                {  'FAQ': 'http://menuoptions.readthedocs.org/en/latest/FAQ.html' },
                {  'change log': 'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html' } ];

	  $('a.docmenu').menuoptions({ 
           'Data': Docs,
           'Width':206,
           'MenuOptionsType': 'Navigate', 
           'Sort': []
      }); 
      
    var Downloads =[ {  'github'  :'https://github.com/compsult/MenuOptions' }, 
                {  'npm'  :'https://www.npmjs.org/package/menuoptions' } ];

	  $('a.dwnldmenu').menuoptions({ 
           'Data': Downloads,
           'MenuOptionsType': 'Navigate', 
           'Sort': []
      }); 
    var ChangeLog =[ {  '1.7.1-3'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id1' },
                     {  '1.7.1-7'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id2' } ];
	  $('a.chglog').menuoptions({ 
           'Data': ChangeLog,
           'MenuOptionsType': 'Navigate', 
           'Sort': []
      }); 
      $('body').append("<div id=page_loaded></div");
}
/*------------------------------------------------------------------------*/
  te.examplelist();
});  