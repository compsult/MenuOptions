Quick start instructions
========================

see `Quick start menu  demno <http://www.menuoptions.org/examples/QuickStartMenu.html>`_

Quick start to create menu
--------------------------

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

see `Quick start select demo <http://www.menuoptions.org/examples/QuickStartSelect.html>`_

You can create a select drop down with a simple array:

.. code-block:: javascript

    var Data = [ "January","February","March","April","May","June","July",
                  "August","September","October","November","December" ];

    $('input#selecttest').menuoptions({ 
        "Data": Data
    });  


