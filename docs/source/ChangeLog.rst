Change Log
==========

1.7.1-3
^^^^^^^

Changed RockerControl from an option to a `MenuOptionsType <SelectParams.html#menuoptionstype>`_

The new format is demonstrated below:

.. code-block:: javascript

   $('input#on_off').menuoptions({"Sort": [], 
        "Data": { 1: "On", 2:"Off" }, 
        "MenuOptionsType":"Rocker", // Rocker is now specified here
        "onSelect": function(mo, data) {  console.log(data); }
   }); 


The old format is demonstrated below ( will not work in versions > 1.7.1-2 ):

.. code-block:: javascript

   $('input#on_off').menuoptions({"Sort": [], 
        "Data": { 1: "On", 2:"Off" }, 
        "RockerControl": True, // this won't work after 1.7.1-2
        "onSelect": function(mo, data) {  console.log(data); }
   }); 

1.7.1-7
^^^^^^^

Path to static files has changed:
---------------------------------

.. csv-table:: New path for static files
    :header: Old path, New path
    :widths: 35,35

    media/javascript, media/js
    media/style, media/css
    media/images, media/imgs
        
ShowDownArrow is no longer true or false
----------------------------------------

`ShowDownArrow <MenuParams.html#showdownarrow>`_ defaults to color black and allows that color to be
overridden with any color you pass in.
You can also pass in the "None" 
keyword, indicating that no arrow will be added to the menu header element.

The old format will now default to a black arrow being added to the menu header element.

.. code-block:: javascript

    $('button[id$="menutest"]').menuoptions({ 
        "Data": [ {"javascript": function() { alert('Some javascript was run'); } },
                  {"Google": "http://www.google.com"},
                  {"Yahoo": "http://www.yahoo.com"}],
        "MenuOptionsType": "Navigate", 
        });  


The new format (below), where arrow color is specified

.. code-block:: javascript

    $('button[id$="menutest"]').menuoptions({ 
        "Data": [ {"javascript": function() { alert('Some javascript was run'); } },
                  {"Google": "http://www.google.com"},
                  {"Yahoo": "http://www.yahoo.com"}],
        "MenuOptionsType": "Navigate", 
        "ShowDownArrow": "silver" // color of arrow is now silver, not black
        });  

1.7.3-15
^^^^^^^^
deprecated `refreshData <http://menuoptions.readthedocs.org/en/latest/UserMethods.html#refreshdata-deprecated>`_

Instead, call MenuOptions the same way you would when initializing 
`(code examples here) <http://menuoptions.readthedocs.org/en/latest/UserMethods.html#resetting-menuoptions-data-replaces-refreshdata>`_

1.7.4-7
^^^^^^^

deprecated `add_menuoption_key <UserMethods.html#add-menuoption-key-deprecated>`_

deprecated `set_select_value <UserMethods.html#set-select-value-deprecated-to-be-removed-in-v1-8>`_

Added `DataKeyNames <SelectParams.html#datakeynames>`_

`DataKeyNames <SelectParams.html#datakeynames>`_ allows you to utilize `Data <SelectParams.html#id3>`_ that has extra, unneeded data,
only picking out the key and value fields that you specify.

Added data structure tests for menus

1.8.0
^^^^^^^

refactor source into several js file

add `input masking <Masks.html#masks>`_

enable `input masking <Masks.html#masks>`_ and `autocomplete <SelectParams.html#parameters-specifications-for-select-lists>`_ together

