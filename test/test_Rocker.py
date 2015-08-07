#!/usr/bin/python 

import time, re, sys
from selenium import webdriver
from SeleniumUtils import SeleniumUtils, SetupByLocation


class test_set_vals(SeleniumUtils, SetupByLocation):

    def __init__(self):
        super(test_set_vals,self).setUp()
        self.driver.implicitly_wait(30) # seconds
        self.url='http://'+self.IP+'/examples/MultiSelect.html'

    def test02_chk_inp(self):
        """
           ckeck that the MenuOptions rocker control works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': 'cfg'})
        self.click_menu_item({ 'menu': 'cfg',
                          'xpath': '//td[text()="Programatically set all values"]',
                          'sleep': 3 })
        self.hover_over({ 'menu': 'cfg' })
        self.click_menu_item({ 'menu': 'cfg',
                          'xpath': '//td[text()="Use rocker control for binary choices"]',
                          'sleep': 5 })
        self.check_rocker({ 'xpath': '//*[@id="RK_LT_menuoptions4"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions4"]/span',
                             'classnm': 'ltdown' })
        self.check_rocker({ 'xpath': '//*[@id="RK_RT_menuoptions4"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions4"]/span',
                             'classnm': 'rtup' })
        self.check_rocker({ 'xpath': '//*[@id="RK_LT_menuoptions9"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions9"]/span',
                             'classnm': 'ltup' })
        self.check_rocker({ 'xpath': '//*[@id="RK_RT_menuoptions9"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions9"]/span',
                             'classnm': 'rtdown' })
        self.check_serialize({ 'xpath': '//*[@id="menutest"]',
                          'js_result': 'fake_alert',
                          'sleep': 1,
                          'expected': 'pizzatype=1&toppings=2&crust=3&cheese=3&cooked=2&delivery=2' })

    def tearDown(self):
        super(test_set_vals,self).tearDown()
        self.driver.quit()
