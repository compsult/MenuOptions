Using MenuOptions select with serialize
=======================================


Pass output of serialize() to re_serialize()
--------------------------------------------

in a call like the one below:

.. code-block:: javascript

    $('input#testSelect').menuoptions('re_serialize',$('form').serialize()); 

`Note`
    The selector must be an element that has been initialized with MenuOptions
    So in the example above, $('input#testSelect') had to have been used to a
    MenuOptions call.

`See re_serialize demo with documention <http://www.menuoptions.org/examples/Serialize.html>`_


