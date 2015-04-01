## MenuOptions ##

1. a jQuery widget designed to optimize data entry speed for both keyboard and mouse users

2. uses autocomplete and mouseover filtering                                       

3. just like the  &lt;select&gt; element, uses visible text and hidden values

4. can create menus (with dividers) that follow URLs or execute javascript functions            

5. has a select control that enables 1 click data entry                         

6. has a clear button that wipes the current value and opens the select list       

7. source data can be dynamically reloaded (no destroy-create required)

8. is flexible, configurable and stays in the viewport  

[(See full documentation)](http://menuoptions.readthedocs.org/en/latest/)

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


### Mouseover filtering with dividers
[See the demo](http://www.menuoptions.org/examples/Dividers.html)

![alt text](http://www.menuoptions.org/examples/images/MenuWithMOandDivs.jpg "mouseover filtering with dividers")


### Dynamic reloading of a MenuOptions select list
[See the demo](http://www.menuoptions.org/examples/ReloadMenuOptions.html)

In this case, the user selects a start time and the end time will be modified to only display<br />
the start time plus 1 hour and 30 minutes later<br />

![alt text](http://www.menuoptions.org/examples/images/Reload.png "dynamic reload of MenuOptions select list")

### Using MenuOptions with jQuery's serialize
[See the demo](http://www.menuoptions.org/examples/Serialize.html)

If you load MenuOptions select list using an object, the value will be written into the 'menu_opt_key'
attribute.  jQuery's serialize will not pick up the value of a MenuOptions select list (menu_opt_key)<br />
To account for this, wrap serialize() with re_serialize, like this:<br />

```javascript
$('input[name=maritalstatus]').menuoptions('re_serialize', $('form#form1').serialize());
```

![alt text](http://www.menuoptions.org/examples/images/re_serialize.png "using MenuOptions with serialize() ")
### Multiple select lists on a page demo

[See the demo](http://www.menuoptions.org/examples/MultiSelect.html)

This demo illustrates using the keyboard for rapid data entry  
In this demo, type the first letter of your selection and hit tab  
(a good test for how long it takes to fill out all 5 options):  

[![Multiple Selects](http://www.menuoptions.org/examples/images/MultiSelects.png "using MenuOptions with multiple select lists ")](http://www.menuoptions.org/examples/MultiSelect.html)

