#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class test_set_vals(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(test_set_vals,self).setUp()
        self.url='http://'+self.IP+'/examples/MultiSelect_test.html'

    def test02_set_value(self):
        """
           check that MenuOptions select list set_select_value works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': 'cfg'})
        self.click_menu_item({ 'menu': 'cfg',
                          'xpath': '//td[text()="Programatically set all values"]',
                          'sleep': 3 })
        self.check_content({ 'xpath': '//*[@id="pizzatype"]',
                             'inputtext': 'Sicilian'})
        self.check_content({ 'xpath': '//*[@id="toppings"]',
                             'inputtext': 'Green pepper'})
        self.check_content({ 'xpath': '//*[@id="crust"]',
                             'inputtext': 'Thick'})
        self.check_content({ 'xpath': '//*[@id="cheese"]',
                             'inputtext': 'Extra'})
        self.check_content({ 'xpath': '//*[@id="cooked"]',
                             'inputtext': 'Regular'})
        self.check_content({ 'xpath': '//*[@id="delivery"]',
                             'inputtext': 'Pick up'})

    def test03_add_menu_opt_key(self):
        """
           check that MenuOptions add_menu_opt_key works
        """
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_add_menu_opt_key({ 'xpath': '//*[@id="scrolltest"]',
                                      'clr_xpath': '//*[@id="CB_menuoptions1"]',
                                      'inp_text': 'May',
                                      'exp_key': '5',
                                      'id': 'scrolltest' })
        self.check_add_menu_opt_key({ 'xpath': '//*[@id="selecttest"]',
                                      'clr_xpath': '//*[@id="CB_menuoptions0"]',
                                      'inp_text': 'November',
                                      'exp_key': '11',
                                      'id': 'selecttest' })

    
    def tearDown(self):
        super(test_set_vals,self).tearDown()
        self.driver.quit()
