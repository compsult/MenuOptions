#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation
from money import MoneyUtils


class testMoney(SeleniumUtils, SetupByLocation, MoneyUtils):

    def setUp(self):
        super(testMoney,self).setUp()
        self.url='http://'+self.IP+'/examples/Masks_test.html'

    def test02_click_pos(self):
        """
           verify money mask initial click pos is 3 from right
        """
        #--- if re.search(r'firefox', self.TST_BROWSER, re.I): ---#
            #--- return ---#
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_pos ({ 'xpath': '//*[@id="Moneytest"]',
                          'id': 'Moneytest',
                          'pos': 3 })

    def test03_after_entry_pos(self):
        """
           verify money mask cursor pos stays at 3 from right
        """
        #--- if re.search(r'firefox', self.TST_BROWSER, re.I): ---#
            #--- return ---#
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_pos ({ 'xpath': '//*[@id="Moneytest"]',
                          'id': 'Moneytest',
                          'keys': '123',
                          'pos': 3 })

    def tearDown(self):
        super(testMoney,self).tearDown()
        self.driver.quit()

