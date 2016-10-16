Masks
=====

How masks work
----------------

1. Each key stroke is evaluated.
2. If the key stroke is valid, the standard mask will be shown.
3. If the key stroke is invalid, allowable values will be shown.
4. For fixed length masks, a green check will appear when the input is both valid and complete.

`See masks demo here <http://menuoptions.org/examples/Masks.html>`_

Mask position options
---------------------

Help
~~~~
You can specify one of three positions to show help (and error) messages

Notes: 

1. this options is only available for mask only (disbaled for multi-column autocomplete)
2. the default is 'right' (the other options are 'top' and 'bottom')

.. code-block:: javascript
    :emphasize-lines: 6

    $('input#YMDtest').menuoptions({ 
        "onSelect": function(mo, data) {  
             console.log(mo, data.newVal, data.newCode, data.type );   
         },  
        "ClearBtn": true,
        "Help": 'bottom', // or 'top' or 'right'
        "Mask": "YYYYMMDD"
    });  


Available masks
---------------

    
YYYYMMDD
~~~~~~~~

.. code-block:: javascript

    "Mask": "YYYYMMDD"

Mon DD, YYYY
~~~~~~~~~~~~

.. code-block:: javascript

    "Mask": "Mon DD, YYYY"

USphone
~~~~~~~

Note: the "Phone" mask saves the phone number as numbers (formatting is stripped) in the `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_

.. code-block:: javascript

    "Mask": "USphone"


HH:MM AM
~~~~~~~~

.. code-block:: javascript

    "Mask": "HH:MM AM"


Money
~~~~~

Note: the "Money" mask saves the amount as a float in the `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_

.. code-block:: javascript

    "Mask": "Money"



`See masks demo <http://menuoptions.org/examples/Masks.html>`_



