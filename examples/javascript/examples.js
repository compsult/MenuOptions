/*-----------------------------------------------------------------------*/
var te = te || {};
$(document).ready(function () {
/*-----------------------------------------------------------------------*/
te.examplelist = function ( ) {
    $('h1:first').after("<table style='margin-left:auto;margin-right:auto;font-size:18px;margin-top:-10px;'>"+
        "<tr>"+
           "<td><a target=_blank class='underl examplemenu' href='/index.html#menuoptions_examples'>all examples</a></td>"+
            "<td><a target=_blank class='underl docmenu' style='margin-left:20px;' href='http://menuoptions.readthedocs.org/en/latest/'>documentation</a></td>"+
            "<td><a target=_blank class='underl dwnldmenu' style='margin-left:20px;' href='https://www.npmjs.org/package/menuoptions'>download</a></td>"+
        "</tr>"+
    "</table><br />");
    var Menu_w_Dividers =[ {  'Menu examples'  :'divider' }, 
                {  'Quick start menu'  : te.root+'QuickStartMenu.html'}, 
                {  'Drop down menus'  : te.root+'MenusBottom.html' },
                {  'Menu with dividers'  : te.root+'Dividers.html' }, 
                {  'Select list examples'  : 'divider' }, 
                {  'Quick Start select' : te.root+'QuickStartSelect.html'}, 
                {  'Inline edit'  : te.root+'InlinEdit.html' }, 
                {  'Select with images' : te.root+'SelectWithImages.html' },
                {  'Serialize (re_serialize)':  te.root+'Serialize.html' },
                {  'Multiple select lists':  te.root+'MultiSelect.html' },
                {  'Dynamically reloading':  te.root+'ReloadMenuOptions.html' },
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
                {  'FAQ': 'http://menuoptions.readthedocs.org/en/latest/FAQ.html' } ];

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
}
/*------------------------------------------------------------------------*/
  te.examplelist();
});  
