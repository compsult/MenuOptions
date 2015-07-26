#!/usr/bin/python 

import time, re, sys
from selenium import webdriver
from SeleniumUtils import MO_Test_Utils
from selenium.webdriver.common.keys import Keys


class test_scrolling(MO_Test_Utils):

    def __init__(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://127.0.0.1/examples/QuickStartSelect.html'

    def test02_chk_inp(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions4"]',
                         'input': '//*[@id="scrolltest"]' })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_DOWN,
                               'repeat': 9 })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_UP,
                               'repeat': 9 })

    def tearDown(self):
        self.browser.quit()
