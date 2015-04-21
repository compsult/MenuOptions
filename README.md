## MenuOptions ##
> New in version 1.6+, arrow key enabled to allow pure keyboard interaction
1. a jQuery widget designed to optimize data entry speed for both keyboard and mouse users

2. Intelligent autocomplete that automatically removes invalid characters and 
   can utilize multicolumn select lists.

3. Menus built from JSON that follow URLs or execute javascript functions and allow dividers    

4. just like the  &lt;select&gt; element, uses visible text and hidden values

5. has a select control that enables 1 click data entry                         

6. has a clear button that wipes the current value and opens the select list       

7. source data can be dynamically reloaded (no destroy-create required)

8. is flexible, configurable and stays in the viewport  

9. tested on Win 8.1 IE10 and Safari 5.17, on Ubuntu Chrome 41.0.2272 and Firefox 37.0

[(See full documentation)](http://menuoptions.readthedocs.org/en/latest/)

[(See live demos)](http://www.menuoptions.org)

### Getting started with a simple select list
[See the demo](http://www.menuoptions.org/examples/QuickStartSelect.html).

```javascript
var Data = [ "January","February","March","April","May","June","July",
"August","September","October","November","December" ];

$('input#selecttest').menuoptions({
"Data": Data
});
```
![alt text](http://www.menuoptions.org/examples/images/SimpleSelect.jpg "select list image")

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
![alt text](http://www.menuoptions.org/examples/images/SimpleMenu.jpg "simple menu image")

### Autocomplete with images
[See the demo](http://www.menuoptions.org/examples/SelectWithImages.html)

![alt text](http://www.menuoptions.org/examples/images/AutoCompWithImgs.jpg "autocomplete with images")

### Using MenuOptions with in line editing of Table cells
[See the demo](http://www.menuoptions.org/examples/InlinEdit.html)

An example of using MenuOptions select lists as part of in line editing for a table

![alt text](http://www.menuoptions.org/examples/images/InlineEditing.png "autocomplete with images")

### Mouseover filtering with dividers
[See the demo](http://www.menuoptions.org/examples/Dividers.html)

![alt text](http://www.menuoptions.org/examples/images/MenuWithMOandDivs.jpg "mouseover filtering with dividers")


### Dynamic reloading of a MenuOptions select list
[See the demo](http://www.menuoptions.org/examples/ReloadMenuOptions.html)

In this case, the user selects a start time and the end time will be modified to only display
the start time plus 1 hour and 30 minutes later

![alt text](http://www.menuoptions.org/examples/images/Reload.png "dynamic reload of MenuOptions select list")

### Using MenuOptions with jQuery's serialize
[See the demo](http://www.menuoptions.org/examples/Serialize.html)

If you load MenuOptions select list using an object, the value will be written into the 'menu_opt_key'
attribute.  jQuery's serialize will not pick up the value of a MenuOptions select list (menu_opt_key)
To account for this, wrap serialize() with re_serialize, like this:

```javascript
$('input[name=maritalstatus]').menuoptions('re_serialize', $('form#form1').serialize());
```

![alt text](http://www.menuoptions.org/examples/images/re_serialize.png "using MenuOptions with serialize() ")
### Multiple select lists on a page demo

[See the demo](http://www.menuoptions.org/examples/MultiSelect.html)

This demo illustrates using the keyboard for rapid data entry.

[![Multiple Selects](http://www.menuoptions.org/examples/images/MultiSelects.png "using MenuOptions with multiple select lists ")](http://www.menuoptions.org/examples/MultiSelect.html)

