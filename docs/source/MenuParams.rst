Parameters specifications for menus
===================================

`Show me the menu demo </examples/MenusBottom.html>`_

.. image:: _static/Menu.jpg
   :alt: Menu example
   :target: http://www.menuoptions.org/examples/MenusBottom.html


Parameter list for menus
------------------------

.. csv-table:: Paramters for Menus
    :header: "Parameter","Type","Allowable Values","Default","Required"
    :widths: 22,22,35,35,25

    `BootMenuOfs`_,integer,positive integer,125,false
    `ColumnCount`_,integer,positive integer,1,false
    `Data <MenuParams.html#id3>`_,JSON object,"array, object or array of objects",none,true
    `Filters`_, array of objects,"{'str':'str'} or {'str':'RegExp'}", none, false
    `MenuOptionsType`_,string,'Select' or 'Navigate','Select',false
    `ShowAt <MenuParams.html#id7>`_,string,'Bottom' or 'Right','Bottom',false
    `ShowDownArrow`_,string, 'None or <color>','black',false 
    `Sort`_,array of strings,"['alpha'|'num', 'desc'|'asc']","['alpha','asc']",false
    `Width`_,integer,positive integer,width of parent,false
    `Window`_,string,'repl'or 'new',"repl",false

Parameters explained for menus
------------------------------

.. _BootMenuOfs:

BootMenuOfs
~~~~~~~~~~~

   options: **positive integer**

    BootMenuOfs is useful to control where the menu appears when
    you have a 
    `Bootstrap navbar menu <http://getbootstrap.com/components/#navbar>`_ 
    that has been expanded from a collapsed state.
    This allows control of how far from the left that the menu will appear

.. code-block:: javascript

    'BootMenuOfs': 150,

.. _ColumnCount:

ColumnCount
~~~~~~~~~~~
   options: **positive integer**

   MenuOptions defaults to a single column. To show have more than one 
   column, use the `ColumnCount` parameter. 

.. _Data:

Data
~~~~
    options: **{}, or [ {}, {}, ... ]** 

    MenuOptions menus accept the following in `Data`

    1. a single multikey object
           { 1:"Jan", 2:"Feb",...}
    2. an array of single key objects 
           single key [{1:"Jan"},{2:"Feb"}...]

.. _Filters:

Filters
~~~~~~~
    options: **[ { 'text : 'text' }, ...] or [ {'text': 'RegExp'}, ...]**

    Filters enable mouseover filering of menu items
    You can filter by plain text or by regular expression
    Here is an example of using Filters with a RegExp
    (`Filters demo </examples/Dividers.html>`_ )

.. code-block:: javascript

    'Filters': [{ 'Biz' : '^(CNBC|MarketWatch)'}, {'Search' :'^(Google|Yahoo)'} ],

.. _MenuOptionsType:

MenuOptionsType
~~~~~~~~~~~~~~~
    options: **'Select' or 'Navigate'**

    MenuOptions defaults to "Select". To create a menu drop down, call 
    menuoptions with MenuOptionsType = "Navigate"

.. code-block:: javascript

    'MenuOptionsType': 'Navigate'

.. _ShowAt:

ShowAt
~~~~~~
    options: **'bottom' or 'right'**  

    MenuOptions accepts a string to tell it where to display the menu ::

    "Bottom" means that the menu will appear underneath
    "Right" means that the menu will appear to the right

.. _ShowDownArrow:

ShowDownArrow
~~~~~~~~~~~~~
     options: **None or <color>**

     ShowDownArrow defaults to "black", meaning a down arrow will automatically 
     be appended to the end of a menu drop down in the color black. 
     Set ShowDownArrow to "None" if you would rather not see this arrow.
     Set ShowDownArrow to "silver" if you would like the arrow color to be silver.


.. code-block:: javascript

    'ShowDownArrow': 'silver'


.. _Sort:

Sort
~~~~
    options: **['alpha' or 'num', 'desc' or 'asc']**

     Setting the property to an empty array will cause a Data array 
     (or array of objects) to be displayed in the original order.
     With no sort, a single object will be displayed in random order.

.. _Width:

Width
~~~~~
   options: **positive integer**

   MenuOptions will try to match the width of the parent element (it may be
   wider if the contents cannot fit). The Width parameter allows the user to 
   override the default width. 

.. _Window:

Window
~~~~~~
   options: **"repl" or "new"**

   When a menu itme is clicked, you can opt to have a new browser window open by
   using the "new" option. The default will be to replace the current URL with
   the one that was just clicked.

.. code-block:: javascript

    'Window': 'new'

