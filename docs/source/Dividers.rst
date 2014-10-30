Using dividers in a menu or select list
=======================================


Rules to use a divider
----------------------

1. You can only use dividers in a single column menu or select list. In other words, the ColumnCount must be set to 1
#. The Data must be an object or array of objects
#. The value must be set to 'divider'

::

    {  'Search'  :'divider' }
                   ^^^^^^^

in a call like the one below:

.. code-block:: javascript

    var Menu_w_Dividers =[ {  'Search'  : 'divider' }, 
                {  'Google'  :'http://www.google.com' }, 
                {  'Yahoo'  :'http://www.yahoo.com' }, 
                {  'Business'  : 'divider' }, 
                {  'CNBC'  :'http://www.cnbc.com' }, 
                {  'MarketWatch' :'http://www.MarketWatch.com' } ];

    $('button[id="menu_divs_filts"]').menuoptions({ 
        'MenuOptionsType': 'Navigate', // this is a menu
        'Data': Menu_w_Dividers, // Data is array of objects
        // 2 mouseover filters using RegExps
        'Filters': [{ 'Biz' : '^(CNBC|MarketWatch)'}, {'Search' :'^(Google|Yahoo)'} ], 
        'Sort': [], // don't sort, display in the original order
    }); 


`See this code in a demo <http://www.menuoptions.org/examples/Dividers.html>`_



