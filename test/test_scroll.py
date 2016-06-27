#!/usr/bin/python 

import time, re, sys
from selenium.webdriver.common.keys import Keys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class test_scrolling(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(test_scrolling,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'

    def test02_chk_inp(self):
        """
           check that MenuOptions select list scrolling works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions1"]',
                         'input': '//*[@id="scrolltest"]' })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_DOWN,
                               'repeat': 9 })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_UP,
                               'repeat': 9 })

    def tearDown(self):
        super(test_scrolling,self).tearDown()
        self.driver.quit()
