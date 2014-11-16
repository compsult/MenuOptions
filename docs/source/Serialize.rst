Using MenuOptions select with serialize
=======================================


Pass output of serialize() to re_serialize()
--------------------------------------------

`See re_serialize demo with documention <http://www.menuoptions.org/examples/Serialize.html>`_

in a call like the one below:

.. code-block:: javascript

    $('input#testSelect').menuoptions('re_serialize',$('form').serialize()); 

`Note`
    The selector must be an element that has been initialized with MenuOptions.
    So in the example above, $('input#testSelect') had to have been used initialized
    with a MenuOptions call (initialization example below).

.. code-block:: javascript

    var Data = [ "January","February","March","April","May","June","July",
                  "August","September","October","November","December" ];

    $('input#selecttest').menuoptions({ 
        "Data": Data
    });  



