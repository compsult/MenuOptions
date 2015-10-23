FAQ
===

.. image:: https://travis-ci.org/compsult/MenuOptions.svg?branch=1.7.2-0
   :target: https://travis-ci.org/compsult/MenuOptions

.. image:: https://saucelabs.com/buildstatus/compsult
   :target: https://saucelabs.com/u/compsult

.. image:: https://readthedocs.org/projects/menuoptions/badge/?version=latest
   :target: http://menuoptions.readthedocs.org/en/latest/

Why do we need another input widget?
------------------------------------
MenuOptions was created for one reason.
    To reduce - `to an absolute minimum` - the # of keystrokes and clicks 
    required for data entry as well as navigation.


It enables:

- 1 click data entry
- if an item is at the top of the list, only one key needs to be pressed (the enter key)
- it uses intelligent autocomplete 
  (characters not in any select list item are automatically removed, saving keystrokes)
- mouseover filtering lets user reduce choices by moving their mouse over a filter element
- mulitcolumn display of choices, allowing more data to be presented at one time
- convenient binary choices (true/false, yes/no, etc) using the Rocker control
- scrolling to accomodate large lists

Other benefits:

- can use data from a variety of JSON types (array, array of arrays, single object, array of objects)
- uses color highlighting to show autocomplete matches 
- the value associated with with the label string is saved in the input element automatically
  (in the menu_opt_key - no need to manually update a hidden field)
- since the dropdowns uses similar logic to menus, it has a basic menu system thrown in.


When I use jQuery.empty(), the widget does not get removed. How do I fix this?
------------------------------------------------------------------------------

The MenuOptions widget will detect the removal of the element it is applied to.
However, calling jQuery.empty() does not appear to trigger the remove event `*** <http://forum.jquery.com/topic/jquery-empty-does-not-destroy-ui-widgets-whereas-jquery-remove-does-using-ui-1-8-4>`_
so you will likely have to call the destroy () method, for example:

.. code-block:: javascript

      $(YourSelector + ' .ui-menuoptions').menuoptions('destroy');

I pasted data into a MenuOptions select list and now have errors when saving
----------------------------------------------------------------------------

MenuOptions expects that you have either clicked a selection or 
typed one in and pressed enter.  When you paste data into a MenuOptions 
select list, you need to run the `add_menuoption_key` method

.. code-block:: javascript

      $(YourSelector + ' .ui-menuoptions').menuoptions('add_menuoption_key' );

This will populate the attribute menu_opt_key that `re_serialize() <http://menuoptions.readthedocs.org/en/latest/Serialize.html>`_ 
uses to get the value that corresponds with the text the user sees.

How do I display text and have a hidden value, like the HTML select control?
----------------------------------------------------------------------------
When creating your MenuOptions select control, pass it an object, like the code below:

.. code-block:: javascript

     PayMethod   = { 1: "American Express", 2: "Visa", 3: "Mastercard", 4:"Discover", 5:"Check", 
                     6:"PayPal", 7:"Cash", 8:"Money Order"}

     $('input[name="t"]').menuoptions({  "Data": PayMethod, 
                                            "SelectOnly": true, 
                                            "ClearBtn": true, 
                                            "PlaceHolder": "Pay Method", 
                                            "ColumnCount": 2,
                                            'Width': 225 });

For more details, see `re_serialize() <http://menuoptions.readthedocs.org/en/latest/Serialize.html>`_ 

When I hit enter in a MenuOptions select, it does not submit the form
---------------------------------------------------------------------
That's correct. MenuOptions uses the Enter key to select the first dropdown 
element. If you want to submit the form when a user presses Enter, you
can do so in the onSelect option,  which returns the MenuOptions instance,
newVal, newCode and type (EnterKey|Click|RockerClick).

For more detals on onSelect `see the docs <SelectParams.html#onselect>`_

.. code-block:: javascript

    $('input#selecttest').menuoptions({ 
        "Data": { 1:"January",2:"February",3:"March",4:"April",5:"May", 6:"June",7:"July",
                  8:"August",9:"September",10:"October",11:"November",12:"December" },
        "onSelect": function(mo, data) { 
            if ( data.type == "EnterKey" ) {
                $("form#tst").submit();
            }
        }, 
        "Sort": [] // don't sort
    });  

This code is in `quick start select demo <http://www.menuoptions.org/examples/QuickStartSelect.html>`_

How can I create a vertical scroll bar for large lists?
-------------------------------------------------------
Below is an example. Whenever you specify a Height that is less than
the height of the select list dropdown, a vertical scroll bar will be created.

.. code-block:: javascript

    $('input#scrolltest').menuoptions({ 
        "Data": { 1:"January",2:"February",3:"March",4:"April",5:"May", 6:"June",7:"July",
                  8:"August",9:"September",10:"October",11:"November",12:"December" },
        "onSelect": function(mo, data) { 
            console.log(mo, data.newVal, data.newCode, data.type );  
        }, 
        "InitialValue": { 'val': 'December'},
        "Height": 200,
        "Sort": []
    });  

This code is in `quick start select demo <http://www.menuoptions.org/examples/QuickStartSelect.html>`_

When I enter certain characters in a MenuOptions select list they disappear, why?
----------------------------------------------------------------------------------
It only disappears when you enter a character that is not in any of the select list options

Can I use 'special' characters in a MenuOptions select list ( parens, curly braces )?
-------------------------------------------------------------------------------------
Yes
