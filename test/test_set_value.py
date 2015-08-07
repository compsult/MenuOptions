#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class test_set_vals(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(test_set_vals,self).setUp()
        self.driver.implicitly_wait(30) # seconds
        self.url='http://'+self.IP+'/examples/MultiSelect.html'

    def test02_chk_inp(self):
        """
           ckeck that MenuOptions select list set_select_value works
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

    def tearDown(self):
        super(test_set_vals,self).tearDown()
        self.driver.quit()
