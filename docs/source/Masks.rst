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

(999) 999-9999
~~~~~~~~~~~~~~

.. code-block:: javascript

    "Mask": "(999) 999-9999"


HH:MM AM
~~~~~~~~

.. code-block:: javascript

    "Mask": "HH:MM AM"


$0,000.00
~~~~~~~~~

.. code-block:: javascript

    "Mask": "$0,000.00"



`See masks demo <http://menuoptions.org/examples/Masks.html>`_



