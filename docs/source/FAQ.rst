FAQ
===

.. image:: https://travis-ci.org/compsult/MenuOptions.svg?branch=1.8.1-20
   :target: https://travis-ci.org/compsult/MenuOptions

.. image:: https://saucelabs.com/buildstatus/compsult
   :target: https://saucelabs.com/u/compsult

.. image:: https://readthedocs.org/projects/menuoptions/badge/?version=latest
   :target: http://menuoptions.readthedocs.org/en/latest/

How do I reset the options in MenuOptions
-----------------------------------------

`see the instructions here <UserMethods.html#resetting-menuoptions-data-replaces-refreshdata>`_

What do you mean auto-configuration?
------------------------------------

Auto-configuration means that if you set the input field to either the key or the value,
MenuOptions will automatically set the correct `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_
and the correct value (what is shown to user). The command below will auto-configure all the 
MenuOptions widgets on a page:

.. code-block:: javascript

      $('.ui-menuoptions').menuoptions();


For example:

Assume you are using month name and month code in your `Data <SelectParams.html#id3>`_
and the code 12 represents the month December. 
If you set the input field to "December", MenuOptions will automatically set
`menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_ to the code 12. If you set the input field to 12, MenuOptions
will convert that and display December, while setting the `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_ to the code 12.

What is the menu_opt_key?
-------------------------

`menu_opt_key` is an attribute of the input field that holds the code that corresponds to the 
visible text. So, if you input field shows "December" and the code for December is 12,
the `menu_opt_key` would be set to 12.

.. code-block:: html

    <input type="text" name="month1" id="selecttest" menu_opt_key="12" class="ui-menuoptions">

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
select list, just call MenuOptions again with no parameters

.. code-block:: javascript

      $(YourSelector + ' .ui-menuoptions').menuoptions();

This will populate the attribute `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_ that `re_serialize() <Serialize.html>`_ 
uses to get the value that corresponds with the text the user sees.

The clear button (or 'X') is not aligned correctly
--------------------------------------------------
There are 2 situations where this can happen.

The first is when an input element is added dynamically (using javascript). 
The clear button is positioned using the jQuery UI position() function, which requires 
that the element be present in the DOM and visible.

The second is when the container that surrounds the input element is being resized,
as when a browser draws a table and shrinks the <TD> that contains the input element.

There are 2 workarounds for this. The first is to call MenuOptions again (with no parameters)
immediately after adding the element or after the layout change.

.. code-block:: javascript

      $(YourSelector + ' .ui-menuoptions').menuoptions();


For dynamically added elements, you can wrap the menuoptions call with a setTimeout, like this:

.. code-block:: javascript

    setTimeout(function () {
        $('input#selecttest').menuoptions({ 
             "Data": { 1:"January",2:"February",3:"March",4:"April",5:"May", 6:"June",7:"July",
                       8:"August",9:"September",10:"October",11:"November",12:"December" },
             "Sort": []
        });  
    }, 200 );


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

For more details, see `re_serialize() <Serialize.html>`_ 

When I hit enter in a MenuOptions select, it does not submit the form
---------------------------------------------------------------------
That's correct. MenuOptions uses the Enter key to select the first dropdown 
element. If you want to submit the form when a user presses Enter, you
can do so in the onSelect option,  which returns the MenuOptions instance,
newVal, newCode and type (EnterKey|Click|Rocker).

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

This code is in `quick start select demo <http://menuoptions.org/examples/QuickStartSelect.html>`_

How can I create a vertical scroll bar for large lists?
-------------------------------------------------------
Below is an example. Whenever you specify a `Height <SelectParams.html#height>`_ that is less than
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

This code is in `quick start select demo <http://menuoptions.org/examples/QuickStartSelect.html>`_

When I enter certain characters in a MenuOptions select list they disappear, why?
----------------------------------------------------------------------------------
It only disappears when you enter a character that is not in any of the select list options

Can I use 'special' characters in a MenuOptions select list ( parens, curly braces )?
-------------------------------------------------------------------------------------
Yes

Why do we need another input widget?
------------------------------------
MenuOptions was created for one reason.
    To reduce - `to an absolute minimum` - the # of keystrokes and clicks 
    required for data entry as well as navigation.


Features:
~~~~~~~~~

- Input masking
    - error messages that explain why the input key is invalid
    - hotkeys - a single key can fill a field (e.g., 't' fills in todays date in date fields)
- Multi column autocomplete
    - intelligent autocomplete (characters not in any select list item are automatically removed, saving keystrokes)
    - mouseover filtering lets user reduce choices by moving their mouse over a filter element
    - `auto-configuration <FAQ.html#what-do-you-mean-auto-configuration>`_
- Rocker control
    - Binary options (true/false, yes/no, etc) that never hide a choice
- Menus
    - Built from JSON
    - mouseover filtering

Other benefits:

- offers the ability to combine multi column autocomplete and input mask functionality.
- uses color highlighting to show autocomplete matches 
- the value associated with with the label string is saved in the input element automatically
  (in the `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_ - no need to manually update a hidden field)
- it can utilize `Data <SelectParams.html#id3>`_ from a variety of of JSON types (array, array of arrays, single object, array of objects)


