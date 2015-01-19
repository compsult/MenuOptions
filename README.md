## MenuOptions ##

1. a jQuery widget designed to optimize data entry speed for both keyboard and mouse users
                                                                                
2. uses autocomplete and mouseover filtering                                       
                                                                                
3. just like the  &lt;select&gt; element, uses visible text and hidden values

4. can create menus (with dividers) that follow URLs or execute javascript functions            
                                                                                
5. has a select control that enables 1 click data entry                         
                                                                                
6. has a clear button that wipes the current value and opens the select list       
                                                                                   
7. can optionally trigger an event (useful when updating another part of the page
   based on user selection)                               
                                                                                   
8. source data can be dynamically reloaded (no destroy-create required)

9. is flexible, configurable and stays in the viewport  

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

###Autocomplete with images###
[See the demo](http://www.menuoptions.org/examples/SelectWithImages.html)

![alt text](http://www.menuoptions.org/examples/images/AutoCompWithImgs.jpg "autocomplete with images")


###Mouseover filtering with dividers###
[See the demo](http://www.menuoptions.org/examples/Dividers.html)

![alt text](http://www.menuoptions.org/examples/images/MenuWithMOandDivs.jpg "mouseover filtering with dividers")


###Dynamic reloading of a MenuOptions select list###
[See the demo](http://www.menuoptions.org/examples/ReloadMenuOptions.html)

In this case, the user selects a start time and the end time will be modified to only display<br />
the start time plus 1 hour and 30 minutes later<br />

![alt text](http://www.menuoptions.org/examples/images/Reload.png "dynamic reload of MenuOptions select list")

