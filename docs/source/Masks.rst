Masks
=====

How pre-defined masks work
--------------------------

Note : `User defined masks <http://menuoptions/docs/build/html/Masks.html#id1>`_ work slightly differently than 
`pre-defined masks <http://menuoptions/docs/build/html/Masks.html#id2>`_ masks
    

1. Each key stroke is evaluated.
2. If the key stroke is valid, the standard mask will be shown.
3. If the key stroke is invalid, allowable values will be shown.
4. For fixed length masks, a green check will appear when the input is both valid and complete.

`See masks demo here <http://menuoptions.org/examples/Masks.html>`_

Mask key specifications
-----------------------

Help
~~~~
You can specify one of three positions to show help (and error) messages

Notes: 

1. the default is 'right' (the other options are 'top' and 'bottom')

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

User defined Masks
------------------

Requirements for user defined masks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    1. "Mask" must be an object 
           (not a string, as in pre-defined masks)
    2. "Mask" object must contain the `'Whole' <http://menuoptions/docs/build/html/Masks.html#whole-required>`_ key
           which specifies the use defined RegExp

Notes: 
    1. You do not get the character by character validation (and therefore, the character specific error messages) with user defined masks.
    2. If you use FixedLen with a user defined masks, it is helpful to make the `'HelpMsg' <http://menuoptions/docs/build/html/Masks.html#helpmsg-optional>`_  massage be that exact length. This will make the progress highlighting behave as intended (i.e., showing the user how many valid characters were entered and how many need to be entered to fufill the `'FixedLen' <http://menuoptions/docs/build/html/Masks.html#fixedlen-optional>`_  requirement).


Example
~~~~~~~

.. code-block:: javascript
    :emphasize-lines: 4-7

    $('input#DrName2').menuoptions({ 
        "ClearBtn": true, 
        "Help": 'bottom', 
        "Mask": {
                Whole : '^[ A-Za-z0-9\-.,]*$', 
                HelpMsg : "Doctor Name"
                }, 
        "Justify": 'left' 
    });

Whole (required)
~~~~~~~~~~~~~~~~
This is the RegExp that matches the input and signifies that the input is completed (the one exception is if the FixedLen is defined - in that case, the input is not complete until the FixedLen character count is reached)

HelpMsg (optional)
~~~~~~~~~~~~~~~~~~
When using a User Defined masks, you can specify the Help message text to display while user is inputting data into the input element.


FixedLen (optional)
~~~~~~~~~~~~~~~~~~~
When using a User Defined masks, you can specify a FixedLen. To pass validation, the input string must be this exact length.

Pre-defined masks
-----------------

    
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



