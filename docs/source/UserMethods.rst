User methods
========================

`(Cleick here to see demo that uses methods set_select_value & refreshData) <http://www.menuoptions.org/examples/SelectWithImages.html>`_

add_menuoption_key
^^^^^^^^^^^^^^^^^^

Useful for when a value is pasted into a select list field,
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


set_select_value
^^^^^^^^^^^^^^^^

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
 
refreshData
^^^^^^^^^^^

allows all parameters to be dynamically reset

Usage:
::

    $(<selector>).menuoptions('refreshData', { 'option': 'option value', ...});

This example shows resetting a select list from input type to RockerControl 
type and removing any previous Sort instructions

.. code-block:: javascript

        $('input#pizzatype').menuoptions('refreshData', {"RockerControl": true, "Sort": []});

This example shows resetting a select list's Data

.. code-block:: javascript

        $('input#delivery').menuoptions('refreshData', {"Data": { 1: "Deliver", 2:"Pick up" } });

This example shows resetting a select list's Width

.. code-block:: javascript

        $('input#delivery').menuoptions('refreshData', {'Width' : 100 });

This example shows making a select list display to the right (instead of at bottom)

.. code-block:: javascript

        $('input#delivery').menuoptions('refreshData', {"ShowAt" : "right"});;

This example shows resetting a select list's ColumnCount

.. code-block:: javascript

        $('input#pizzatype').menuoptions('refreshData', {'ColumnCount' : 2 });
