/*-----------------------------------------------------------------------*/
var te = te || {};
$(document).ready(function () {
/*-----------------------------------------------------------------------*/
te.buildMenu = function ( ) {
    var AllExamples =[ {  'Menu examples'  :'divider' }, 
                {  'Quick start menu'  : te.root+'QuickStartMenu.html'}, 
                {  'Drop down menus'  : te.root+'MenusBottom.html' },
                {  'Menu with dividers'  : te.root+'Dividers.html' }, 
                {  'Right side menus'  : te.root+'RightMenu.html' }, 
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
           'Data': AllExamples,
           'Width':170,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "orange",
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
           "ShowDownArrow": "blue",
           'Sort': []
      }); 
      
    var Downloads =[ {  'github'  :'https://github.com/compsult/MenuOptions' }, 
                {  'npm'  :'https://www.npmjs.org/package/menuoptions' } ];

	  $('a.dwnldmenu').menuoptions({ 
           'Data': Downloads,
           'Width':100,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "yellow",
           'Sort': []
      }); 
    var ChangeLog =[ {  '1.7.1-3'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id1' },
                     {  '1.7.1-7'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id2' } ];
	  $('a.changelog').menuoptions({ 
           'Data': ChangeLog,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "white",
           "Window":"new",
           'Sort': []
      }); 
}
/*------------------------------------------------------------------------*/
  te.buildMenu();
});  
