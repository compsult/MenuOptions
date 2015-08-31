#!/usr/bin/python 
# -*- coding: utf-8 -*-

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation
from selenium.webdriver.common.keys import Keys


class test_addons(SetupByLocation, SeleniumUtils):

    def setUp(self):
        super(test_addons,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect.html'

    def test02_coloring(self):
        """
           verify that matching text is colorized
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="scrolltest"]',
                             'cell': '//*[@id="SP_menuoptions5"]/table/tbody/tr/td',
                             'expected': '<span style="color:brown;font-size:110%;">December</span>'})

    def test03_down_arrow(self):
        """
           verify that  dropdown menus show a down arrow after menu text
        """
        self.url='http://'+self.IP+'/examples/MenusBottom.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
            'partial': True,
            'expected': u'Menu&nbsp;.*span.*class="down_arrow"' })
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
            'partial': True,
            'expected': u'Menuwithimages&nbsp;.*span.*class="down_arrow"' })
    def test04_rt_arrow(self):
        """
           verify that right side menus show a right arrow after menu text
        """
        self.url='http://'+self.IP+'/examples/RightMenu.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
            'partial': True,
            'expected': u'Menu&nbsp;.*span.*class="right_arrow"' })
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
            'partial': True,
            'expected': u'Menuwithimages&nbsp;.*span.*class="right_arrow"' })

    def tearDown(self):
        super(test_addons,self).tearDown()
        self.driver.quit()

