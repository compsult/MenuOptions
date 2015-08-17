Change Log
==========

1.7.1-3
^^^^^^^

Changed RockerControl from an option to a MenuSelectType

The new format is demonstrated below:

.. code-block:: javascript

   $('input#on_off').menuoptions({"Sort": [], 
        "Data": { 1: "On", 2:"Off" }, 
        "MenuOptionsType":"Rocker", // Rocker is now specified here
        "onSelect": function(mo, data) {  console.log(data); }
   }); 


The old format is demonstrated below ( will not work in versions > 1.7.1-2 ):

.. code-block:: javascript

   $('input#on_off').menuoptions({"Sort": [], 
        "Data": { 1: "On", 2:"Off" }, 
        "RockerControl": True, // this won't work after 1.7.1-2
        "onSelect": function(mo, data) {  console.log(data); }
   }); 

