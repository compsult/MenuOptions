## MenuOptions [![Build Status](https://travis-ci.org/compsult/MenuOptions.svg?branch=1.8.2-12)](https://travis-ci.org/compsult/MenuOptions) [![Sauce Test Status](https://saucelabs.com/buildstatus/compsult)](https://saucelabs.com/u/compsult) [![Read The docs](https://readthedocs.org/projects/pip/badge/?version=latest)](http://menuoptions.readthedocs.org/en/latest/) ##

#### Input masks and multi-column autocomplete combined


#### What it looks like:

[![alt text](http://www.menuoptions.org/examples/imgs/overview2.gif "input mask and autocomplete example")](http://menuoptions.org/examples/MaskCombos.html "input mask and autocomplete example")

#### Benefits


*  [Input masking](http://www.menuoptions.org/examples/Masks.html)
    *   [user defined masks](http://menuoptions.readthedocs.io/en/latest/Masks.html#id1) (via user supplied RegExp) and [pre-defined masks](http://menuoptions.readthedocs.io/en/latest/Masks.html#id2)
    *   error messages that explain why the input key is invalid
    *   hotkeys - a single key can fill a field (e.g., 't' fills in todays date in date fields)
*  [Multi column autocomplete (select lists)](http://www.menuoptions.org/examples/ReloadMenuOptions.html)
    *   intelligent autocomplete (characters not in any select list item are automatically removed, saving keystrokes)
    *  mouseover filtering lets user reduce choices by moving their mouse over a filter element
    *  [auto-configuration](http://menuoptions.readthedocs.io/en/latest/FAQ.html#what-do-you-mean-auto-configuration)
*  [Rocker control](http://www.menuoptions.org/examples/Rocker.html)
    *   Binary options (true/false, yes/no, etc) that never hide a choice
*  [Menus](http://www.menuoptions.org/examples/MenusBottom.html)
    *  Built from JSON
    *  mouseover filtering

#### Other benefits:

*   it can use data from a variety of JSON types (array, array of arrays, single object, array of objects)
*   uses color highlighting to show autocomplete matches 
*   the value associated with with the label string is saved in the input element automatically (in the menu_opt_key - no need to manually update a hidden field)
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


### Getting started with masks
[See the demo](http://www.menuoptions.org/examples/Masks.html).

```javascript
    $('input#MdYtest').menuoptions({ 
        "ClearBtn": true,
        "Mask": "Mon DD, YYYY"
    });  
```

![alt text](http://www.menuoptions.org/examples/imgs/masks.png "masks image")

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

### Multiple MenuOptions controls, including the rocker control

[See the demo](http://www.menuoptions.org/examples/MultiSelect.html)

This demo illustrates using the using multiple MenuOptions controls, including the rocker control 

![alt text](http://www.menuoptions.org/examples/imgs/MultiSelects.png "using multiple menuoptions on a page ")

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
