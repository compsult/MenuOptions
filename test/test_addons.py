#!/usr/bin/python 
# -*- coding: utf-8 -*-

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation
from selenium.webdriver.common.keys import Keys


class test_addons(SetupByLocation, SeleniumUtils):

    def setUp(self):
        super(test_addons,self).setUp()
        self.driver.implicitly_wait(30) # seconds
        self.url='http://'+self.IP+'/examples/QuickStartSelect.html'

    def test02_coloring(self):
        """
           verify that matching text is colorized
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="scrolltest"]',
                             'cell': '//*[@id="SP_menuoptions4"]/table/tbody/tr/td',
                             'expected': '<span style="color:brown;font-size:110%;">December</span>'})

    def test03_rt_arrow(self):
        """
           verify that right side menus show a right arrow after menu text
        """
        self.url='http://'+self.IP+'/examples/RightMenu.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
                          'expected': u'Menu&nbsp;▸'.encode('utf-8')})
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
                          'expected': u'Menuwithimages&nbsp;▸'.encode('utf-8')})

    def tearDown(self):
        super(test_addons,self).tearDown()
        self.driver.quit()

