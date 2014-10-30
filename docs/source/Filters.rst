Using Filters in a menu or select list
=======================================

How Filters work
----------------

Filters are specified using an array of objects. Each key show what the user will 
see, each value will be the actual filter that MenuOptions uses to filter out
data.

::

    { 'Biz' : '^(CNBC|MarketWatch)'}
      ^^^^    ^^^^^^^^^^^^^^^^^^^^^
      user     MenuOptions searches
      sees     using this RegExp
      this

Using a plain text filter
-------------------------

If your Data is conforms to a pattern (e.g., times with AM PM), you can create
a simple Filter like the one below

.. code-block:: javascript

    "Filters": [{'AM':'AM'},{'PM':'PM'}],

`See simple filter demo <http://www.menuoptions.org/examples/ReloadMenuOptions.html>`_

Using a regular expression (RegExp) filter
------------------------------------------

If your data is more varied, you can use RegExp Filters, like the one below:

.. code-block:: javascript

    'Filters': [{ 'Biz' : '^(CNBC|MarketWatch)'}, {'Search' :'^(Google|Yahoo)'} ],


`See RegExp demo <http://www.menuoptions.org/examples/Dividers.html>`_



