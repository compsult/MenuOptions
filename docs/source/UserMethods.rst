User methods
========================

`(Click here to see demo that resets MenuOptions options & resets a MenuOptions input field  ) </examples/MultiSelect.html>`_

add_menuoption_key *[ deprecated ]*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Alternative to add_menuoption_key

    A call to MenuOptions with no parameters will `auto-configure  <FAQ.html#what-do-you-mean-auto-configuration>`_

Explanation: 

    if there is a **key** (a code repesenting the value) in the input field
    it will be replaced with the **value** (the text the user should see)
    and the menu_opt_key will be set to the **key**
    Alternatively, if there is a **value** in the input field
    it will be left as is and the menu_opt_key will be set to the key 

.. code-block:: javascript

    $('input#delivery').menuoptions();


Useful for when a **value** is pasted into a select list field,
`add_menuoption_key`  will set the menu_opt_key, based on the text
visible in the input field. So, for example, the user pasted "January"
inot the month field, calling `add_menuoption_key` will cause the month code
to be placed in the menu_opt_key field.

Usage:
::

    $(<selector>).menuoptions('add_menuoption_key');

Thise example shows using `add_menuoption_key`

.. code-block:: javascript

    $('input#delivery').menuoptions('add_menuoption_key');


set_select_value *[ deprecated, to be removed in v1.8 ]*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

allows the select list field to be set programmatically.
Pass in an object with either 'ky' or 'val' as the key
and the actual value.

Usage:
::

    $(<selector>).menuoptions('set_select_value', { 'ky'|'val': <value>});

These examples show using both forms of `set_select_value`

.. code-block:: javascript

    $('input#delivery').menuoptions('set_select_value', {'val': 'Delivered'});
    $('input#crust').menuoptions('set_select_value', {'ky': '3'}); // Thick
 
`Note:` to clear out a Rocker control (reset), set the 'val' to '' (empty string).


.. code-block:: javascript

    $('input#delivery').menuoptions('set_select_value', {'val': ''});

[call MenuOptions with no parameters] *(replaces set_select_value)*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    // set the input contents using the value 
    $('input#delivery').val('pickup'); 
    //        -- OR --
    // set the input contents using the key 
    $('input#delivery').val('1');
    // call to MenuOptions with no parameters will auto-configure
    $('input#delivery').menuoptions();


refreshData *[ deprecated ]*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
refreshData allows all parameters to be dynamically reset

Usage:
::

    $(<selector>).menuoptions('refreshData', { 'option': 'option value', ...});

`Using refreshData is no longer required to reset MenuOptions parameters.`

[resetting MenuOptions data] *(replaces refreshData)*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    $(<selector>).menuoptions({ 'option': 'option value', ...});

This example shows resetting a select list from input type to Rocker
type and removing any previous Sort instructions

.. code-block:: javascript

        $('input#pizzatype').menuoptions({"MenuOptionsType":"Rocker", "Sort": []});

This example shows resetting a select list's Data

.. code-block:: javascript

        $('input#delivery').menuoptions({"Data": { 1: "Deliver", 2:"Pick up" } });

This example shows resetting a select list's Width

.. code-block:: javascript

        $('input#delivery').menuoptions({'Width' : 100 });

This example shows making a select list display to the right (instead of at bottom)

.. code-block:: javascript

        $('input#delivery').menuoptions({"ShowAt" : "right"});;

This example shows resetting a select list's ColumnCount

.. code-block:: javascript

        $('input#pizzatype').menuoptions({'ColumnCount' : 2 });
