## MenuOptions ##

1. a jQuery widget designed to optimize data entry speed for both keyboard and mouse users
                                                                                
2. uses autocomplete and mouseover filtering                                       
                                                                                
3. can create menus that follow URLs or execute javascript functions            
                                                                                
4. has a select control that enables 1 click data entry                         
                                                                                
5. has a clear button that wipes the current value and opens the select list       
                                                                                   
6. can optionally trigger an event (useful when updating another part of the page
   based on user selection)                               
                                                                                   
7. is flexible, configurable and stays in the viewport  

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

![alt text](http://www.menuoptions.org/examples/images/MenuWithMOandDivs.jpg "mouseover with images")
