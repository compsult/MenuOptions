#!/usr/bin/python 
# -*- coding: utf-8 -*-

import time, re, sys
from selenium import webdriver
from SeleniumUtils import MO_Test_Utils
from selenium.webdriver.common.keys import Keys


class test_addons(MO_Test_Utils):

    def __init__(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://127.0.0.1/examples/QuickStartSelect.html'

    def test02_coloring(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="scrolltest"]',
                             'cell': '//*[@id="SP_menuoptions4"]/table/tbody/tr/td',
                             'expected': '<span style="color:brown;font-size:110%;">December</span>'})

    def test03_rt_arrow(self):
        self.url='http://127.0.0.1/examples/RightMenu.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
                          'expected': u'Menu&nbsp;▸'.encode('utf-8')})
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
                          'expected': u'Menuwithimages&nbsp;▸'.encode('utf-8')})

    def tearDown(self):
        self.browser.quit()

