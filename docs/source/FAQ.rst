FAQ
===


When I use jQuery.empty(), the widget does not get removed. How do I fix this?
------------------------------------------------------------------------------

The MenuOptions widget will detect the removal of the element it is applied to.
However, calling jQuery.empty() does not appear to trigger the remove event `*** <http://forum.jquery.com/topic/jquery-empty-does-not-destroy-ui-widgets-whereas-jquery-remove-does-using-ui-1-8-4>`_
so you will likely have to call the destroy () method, for example:

      $(YourSelector + ' .ui-menuoptions').menuoptions('destroy');

