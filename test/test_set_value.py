#!/usr/bin/python 

import time, re, sys
from selenium import webdriver
from SeleniumUtils import MO_Test_Utils


class test_set_vals(MO_Test_Utils):

    def setUp(self):
        #--- self.browser = webdriver.Firefox() ---#
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://127.0.0.1/examples/MultiSelect.html'

    def test02_chk_inp(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': '//*[@id="cfg"]/span'})
        self.click_menu_item({ 'menu': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
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
        self.browser.quit()
