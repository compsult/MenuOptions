#!/usr/bin/python 
# -*- coding: utf-8 -*-

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation
from selenium.webdriver.common.keys import Keys


class test_addons(SetupByLocation, SeleniumUtils):

    def setUp(self):
        super(test_addons,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'

    def test02_coloring(self):
        """
           verify that matching text is colorized
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="scrolltest"]',
                             'cell': '//*[@id="SP_menuoptions1"]/table/tbody/tr/td',
                             'expected': '<span class="match">December</span>' })

    def test03_down_arrow(self):
        """
           verify that  dropdown menus show a down arrow after menu text
        """
        self.url='http://'+self.IP+'/examples/MenusBottom_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
            'partial': True,
            'expected': u'down_arrow' })
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
            'partial': True,
            'expected': u'down_arrow' })

    def test04_rt_arrow(self):
        """
           verify that right side menus show a right arrow after menu text
        """
        self.url='http://'+self.IP+'/examples/RightMenu_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_html({ 'xpath': '//*[@id="menu_plain"]/span',
            'partial': True,
            'expected': u'right_arrow' })
        self.driver.execute_script("$('button#menu_w_imgs').focus()")
        self.check_html({ 'xpath': '//*[@id="menu_w_imgs"]/span',
            'partial': True,
            'expected': u'right_arrow' })

    def test05_autocfg_text(self):
        """
           verify that auto-configure works with text in the input element
        """
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.js_chk_autocfg_text({ 'id': 'selecttest',
            'text': "December",
            'expected': u'12'})

    def test06_autocfg_code(self):
        """
           verify that auto-configure works with a code in the input element
        """
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.js_chk_autocfg_code({ 'id': 'selecttest',
            'code': "4",
            'expected': u'April'})

    def tearDown(self):
        super(test_addons,self).tearDown()
        self.driver.quit()

