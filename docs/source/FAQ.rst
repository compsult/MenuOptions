FAQ
===


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
