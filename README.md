## MenuOptions [![Build Status](https://travis-ci.org/compsult/MenuOptions.svg?branch=1.7.2-2)](https://travis-ci.org/compsult/MenuOptions) [![Sauce Test Status](https://saucelabs.com/buildstatus/compsult)](https://saucelabs.com/u/compsult) [![Read The docs](https://readthedocs.org/projects/pip/badge/?version=latest)](http://menuoptions.readthedocs.org/en/latest/) ##

#### What it looks like (shown with Bootstrap 3):

[![alt text](http://www.menuoptions.org/examples/imgs/overview2.gif "menu, select lists and rocker control")](http://menuoptions.org/examples/bootstrap_ex.html "Bootstrap example")

| [Menu ( with dividers and filters )](http://www.menuoptions.org/examples/Dividers.html)       | [Select list ( multi-column with mouse over filters )](http://www.menuoptions.org/examples/ReloadMenuOptions.html) |  [Rocker control](http://www.menuoptions.org/examples/RockerControl.html)     |

#### Benefits


*   1 click data entry
*   if an item is at the top of the list, only one key needs to be pressed (the enter key)
*   it uses intelligent autocomplete (characters not in any select list item are automatically removed, saving keystrokes)
*   mouseover filtering lets user reduce choices by moving their mouse over a filter element
*   mulitcolumn display of choices, allowing more data to be presented at one time
*   has a clear button that wipes the current value and opens the select list (this saves keystrokes in browsers that don't support clear button in input=search e.g., FireFox) 
*   has a rocker control, convenient for binary choices (true/false, yes/no, etc)
*   can scroll to accomodate large lists (using the Height parameter)

#### Other benefits:

*   it can use data from a variety of JSON types (array, array of arrays, single object, array of objects)
*   uses color highlighting to show autocomplete matches 
*   the value associated with with the label string is saved in the input element automatically (in the menu_opt_key - no need to manually update a hidden field)
*   since the dropdowns uses similar logic to menus, it has a basic menu system thrown in.
*   source data can be dynamically reloaded (no destroy-create required)
*   is flexible, configurable and stays in the viewport  

[(See full documentation)](http://menuoptions.readthedocs.org/en/latest/)

[(See live demos)](http://www.menuoptions.org)

### Installation

```bash
npm install menuoptions
   or
git clone https://github.com/compsult/MenuOptions.git
```

[(more detailed install instructions)](http://menuoptions.readthedocs.org/en/latest/QuickStart.html)

### Getting started with a simple select list
[See the demo](http://www.menuoptions.org/examples/QuickStartSelect.html).

```javascript
$('input#selecttest').menuoptions({                                         
        "Data": { 1:"January",2:"February",3:"March",4:"April",5:"May", 6:"June",7:"July",
                  8:"August",9:"September",10:"October",11:"November",12:"December" },
        "onSelect": function(mo, data) {                                        
             console.log(mo, data.newVal, data.type );                          
        },                                                                                                               
        "Sort": [] // don't sort                                                            
    });           
```
![alt text](http://www.menuoptions.org/examples/imgs/SimpleSelect.jpg "select list image")

### Getting started with a simple menu

[See the demo](http://www.menuoptions.org/examples/QuickStartMenu.html)

```javascript
var Data =  [ {"javascript": function() { alert('Run some javascript'); }},
{"Google": "http://www.google.com"},
{"Yahoo": "http://www.yahoo.com"}];

$('button[id$="menutest"]').menuoptions({
"Data": Data;
"MenuOptionsType": "Navigate", // Navigate is for menus
});
```
![alt text](http://www.menuoptions.org/examples/imgs/SimpleMenu.jpg "simple menu image")

### Autocomplete with images
[See the demo](http://www.menuoptions.org/examples/SelectWithImages.html)

![alt text](http://www.menuoptions.org/examples/imgs/AutoCompWithImgs.jpg "autocomplete with images")

### Using MenuOptions with in line editing of Table cells
[See the demo](http://www.menuoptions.org/examples/InlinEdit.html)

An example of using MenuOptions select lists as part of in line editing for a table

![alt text](http://www.menuoptions.org/examples/imgs/InlineEditing.png "autocomplete with images")

### Mouseover filtering with dividers
[See the demo](http://www.menuoptions.org/examples/Dividers.html)

![alt text](http://www.menuoptions.org/examples/imgs/MenuWithMOandDivs.jpg "mouseover filtering with dividers")


### Dynamic reloading of a MenuOptions select list
[See the demo](http://www.menuoptions.org/examples/ReloadMenuOptions.html)

In this case, the user selects a start time and the end time will be modified to only display
the start time plus 1 hour and 30 minutes later

![alt text](http://www.menuoptions.org/examples/imgs/Reload.png "dynamic reload of MenuOptions select list")

### Using MenuOptions with jQuery's serialize
[See the demo](http://www.menuoptions.org/examples/Serialize.html)

If you load MenuOptions select list using an object, the value will be written into the 'menu_opt_key'
attribute.  jQuery's serialize will not pick up the value of a MenuOptions select list (menu_opt_key)
To account for this, wrap serialize() with re_serialize, like this:

```javascript
$('input[name=maritalstatus]').menuoptions('re_serialize', $('form#form1').serialize());
```

![alt text](http://www.menuoptions.org/examples/imgs/re_serialize.png "using MenuOptions with serialize() ")
### Multiple select lists on a page demo

[See the demo](http://www.menuoptions.org/examples/MultiSelect.html)

This demo illustrates using the using multiple MenuOptions controls, including the rocker control 

![alt text](http://www.menuoptions.org/examples/imgs/MultiSelects.png "using multiple menuoptions on a page ")

