/*-----------------------------------------------------------------------*/
var te = te || {};
$(document).ready(function () {
/*-----------------------------------------------------------------------*/
te.buildMenu = function ( ) {
    var AllExamples =[ {  'Menu examples'  :'divider' }, 
                {  'Quick start menu'  : te.root+'QuickStartMenu.html'}, 
                {  'Drop down menus'  : te.root+'MenusBottom.html' },
                {  'Right side menus'  : te.root+'RightMenu.html' }, 
                {  'Select list examples'  : 'divider' }, 
                {  'Quick Start select' : te.root+'QuickStartSelect.html'}, 
                {  'Select with bad data' : te.root+'QuickStartSelect.html?bad_data'}, 
                /*--  {  'Inline edit'  : te.root+'InlinEdit.html' },   --*/
                {  'Select with images' : te.root+'SelectWithImages.html' },
                {  'Serialize (re_serialize)':  te.root+'Serialize.html' },
                {  'Multiple select lists':  te.root+'MultiSelect.html' },
                {  'Dynamically reloading':  te.root+'ReloadMenuOptions.html' },
                {  'Rocker examples'  : 'divider' }, 
                {  'Rocker switch':  te.root+'Rocker.html' },
                {  'Mask examples'  : 'divider' }, 
                {  'Mask and select list':  te.root+'MaskCombos.html' },
                {  'Mask types':  te.root+'Masks.html' },
                {  'All widgets'  : 'divider' }, 
                {  'All options':  te.root+'combined.html' },
        ];

	  $('a.examplemenu').menuoptions({ 
           'Data': AllExamples,
           'Width':190,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "orange",
           'Sort': []
      }); 
    var Docs =[ {  'Another input widget, really?'  :'http://menuoptions.readthedocs.io/en/latest/FAQ.html#why-do-we-need-another-input-widget' }, 
                {  'All documentation'  :'http://menuoptions.readthedocs.io/en/latest/index.html' }, 
                {  'Quick start instructions'  :'http://menuoptions.readthedocs.io/en/latest/QuickStart.html' },
                {  'Mask reference'  :'http://menuoptions.readthedocs.io/en/latest/Masks.html' },
                {  'Menu reference'  :'http://menuoptions.readthedocs.io/en/latest/MenuParams.html' },
                {  'Select list  reference'  :'http://menuoptions.readthedocs.io/en/latest/SelectParams.html' },
                {  'Re-serialize reference'  :'http://menuoptions.readthedocs.io/en/latest/Serialize.html' },
                {  'User methods': 'http://menuoptions.readthedocs.io/en/latest/UserMethods.html' },
                {  'I want to use scrolling': 'http://menuoptions.readthedocs.io/en/latest/FAQ.html/#how-can-i-create-a-vertical-scroll-bar-for-large-lists' },
                {  'FAQ': 'http://menuoptions.readthedocs.io/en/latest/FAQ.html' },
                {  'change log': 'http://menuoptions.readthedocs.io/en/latest/ChangeLog.html' } ];

	  $('a.docmenu').menuoptions({ 
           'Data': Docs,
           'Width':190,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "blue",
           'Sort': []
      }); 
      
    var Downloads =[ {  'github'  :'https://github.com/compsult/MenuOptions' }, 
                {  'npm'  :'https://www.npmjs.org/package/menuoptions' },
                {  'atmosphere'  :'https://atmospherejs.com/compsult/menuoptions' } ];

	  $('a.dwnldmenu').menuoptions({ 
           'Data': Downloads,
           'Width':190,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "yellow",
           'Sort': []
      }); 
    var ChangeLog =[ {  '1.7.1-3'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id1' },
                     {  '1.7.1-7'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id2' },
                     {  '1.7.3-15' :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id3' },
                     {  '1.7.4-7'  :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id4' },
                     {  '1.8.0'    :'http://menuoptions.readthedocs.org/en/latest/ChangeLog.html#id6' } ];
	  $('a.changelog').menuoptions({ 
           'Data': ChangeLog,
           'MenuOptionsType': 'Navigate', 
           "ShowDownArrow": "white",
           "Window":"new",
           'Width':190,
           'Sort': []
      }); 
      $('body').append("<div id=page_loaded></div");
}
/*------------------------------------------------------------------------*/
  te.buildMenu();
});  
