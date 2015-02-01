Using MenuOptions select with serialize
=======================================


Pass output of serialize() to re_serialize()
--------------------------------------------

`See re_serialize demo with documention <http://www.menuoptions.org/examples/Serialize.html>`_

in a call like the one below:

.. code-block:: javascript

    $('input#selecttest').menuoptions('re_serialize',$('form').serialize()); 

`Rules`
    1 - The selector must be an element that has been initialized with MenuOptions.
        So in the example above, $('input#selecttest') had to have been used initialized
        with a MenuOptions call (initialization example below).

    2 - The data passed in with the `Data <http://menuoptions.readthedocs.org/en/latest/SelectParams.html>`_
        parameter must be an object

.. code-block:: javascript

     PayMethod   = { 1: "American Express", 2: "Visa", 3: "Mastercard", 4:"Discover", 5:"Check", 
                     6:"PayPal", 7:"Cash", 8:"Money Order"}

    $('input#selecttest').menuoptions({ 
        "Data": PayMethod
    });  



