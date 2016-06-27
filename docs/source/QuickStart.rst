Quick start instructions
========================

Installation
------------

.. code-block:: bash

    npm install menuoptions
            -- or --
    git clone https://github.com/compsult/MenuOptions.git

The important part of the installation is under `dist`

Here are the 6 files needed for MenuOptions.  Note: this is a subset of the directory tree

.. code-block:: bash

    ├── css
    │   └── menuoptions.min.css
    ├── imgs
    │   ├── greencheck.png
    │   ├── red_x.png
    │   ├── rocker.png
    │   └── ui-bg_glass_75_dadada_1x400.png
    └── js
        └── jquery.menuoptions.min.js


You can use any directory name for the javascript and css files but the 
images directory needs to be called `imgs` (it's referenced in the menuoptions.css file).
You can get around this restriction by editing menuoptions.css to use your directory name.

Quick start to create an input mask
-----------------------------------

Below are examples of using the currently available input masks

.. code-block:: javascript

    $('input#MdYtest').menuoptions({ 
        "ClearBtn": true,
        "Mask": "Mon DD, YYYY"
    });  
    $('input#YMDtest').menuoptions({ 
        "ClearBtn": true,
        "Mask": "YYYYMMDD"
    });  
    $('input#Phonetest').menuoptions({ 
        "ClearBtn": true,
        "Mask": "(999) 999-9999"
    });  
    $('input#Timetest').menuoptions({
        "ClearBtn": true,
        "Mask" : 'HH:MM AM'
    });  

Quick start to create menu
--------------------------

see `Quick start menu demo <http://menuoptions.org/examples/QuickStartMenu.html>`_

Pass in a array of objects in the format:

::

    { <textToDisplay> : <href link|javascript> }

to MenuOptions to create a simple drop down menu. 

The example below has 2 URLs and a javascript command.

.. code-block:: javascript

    var Data =  [ {"javascript": function() { alert('Run some javascript'); }},
                  {"Google": "http://www.google.com"},
                  {"Yahoo": "http://www.yahoo.com"}];

    $('button[id$="menutest"]').menuoptions({ 
        "Data": Data;
        "MenuOptionsType": "Navigate", // Navigate is for menus
    });  


Quick start to create select drop down
--------------------------------------

see `Quick start select demo <http://menuoptions.org/examples/QuickStartSelect.html>`_

You can create a select drop down with a simple array:

.. code-block:: javascript

    var Data = [ "January","February","March","April","May","June","July",
                  "August","September","October","November","December" ];

    $('input#selecttest').menuoptions({ 
        "Data": Data
    });  

