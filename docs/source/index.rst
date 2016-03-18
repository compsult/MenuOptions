.. MenuOptions documentation master file, created by
   sphinx-quickstart on Sat Oct 25 22:36:22 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to MenuOptions
=====================================================

.. image:: https://travis-ci.org/compsult/MenuOptions.svg?branch=1.7.5-2
   :target: https://travis-ci.org/compsult/MenuOptions

.. image:: https://saucelabs.com/buildstatus/compsult
   :target: https://saucelabs.com/u/compsult

.. image:: https://readthedocs.org/projects/menuoptions/badge/?version=latest
   :target: http://menuoptions.readthedocs.org/en/latest/

MenuOptions was created for one reason:
---------------------------------------

To reduce - `to an absolute minimum` - the # of keystrokes and clicks required for data entry & navigation.

What it looks like:
-------------------
.. image:: _static/overview2.gif
   :alt: What it looks like
   :target: http://www.menuoptions.org

Benefits:

- 1 click data entry

- it uses intelligent autocomplete (characters not in any select list item 
  are automatically removed, saving keystrokes)
  can utilize multicolumn select lists.

- mouseover filtering lets user reduce choices by moving their mouse over a filter element

- mulitcolumn display of choices, allowing more data to be presented at one time

- has a rocker control, convenient for binary choices (true/false, yes/no, etc)

- uses scrolling to accomodate large lists

- `auto-configuration <FAQ.html#what-do-you-mean-auto-configure>`_

Other benefits:

- uses color highlighting to show autocomplete matches

- it can utilize data from a variety of JSON types (array, array of arrays, 
  single object, array of objects)

- the value associated with with the label string is saved in the input element 
  automatically (in the `menu_opt_key <FAQ.html#what-is-the-menu-opt-key>`_ - no need to manually update a hidden field)

- since the dropdowns uses similar logic to menus, it has a basic menu system thrown in.


Prerequisites:
--------------

- jQuery version >=1.9
- jQuery ui version >= 1.10
- download `MenuOptions from git <https://github.com/compsult/MenuOptions>`_
- download `MenuOptions from npm <https://www.npmjs.com/package/menuoptions>`_

See the live examples
---------------------
`at MenuOptions.org <http://www.menuoptions.org>`_

Contents:

.. toctree::
   :maxdepth: 3

   QuickStart
   MenuParams
   SelectParams
   UserMethods
   Serialize
   Dividers
   Filters
   FAQ
   ChangeLog

   


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

