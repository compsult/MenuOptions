#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testSL(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testSL,self).setUp()
        self.driver.implicitly_wait(30) # seconds
        self.url='http://'+self.IP+'/examples/QuickStartSelect.html'

    def test02_chk_inp(self):
        """
           check that MenuOptions select list InitialValue works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_content({ 'xpath': '//*[@id="selecttest"]',
                             'inputtext': 'December'})

    def test03_clr_n_autocomplete(self):
        """
           check that MenuOptions select list autocomplete works and
           that any character not in select list is deleted
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions3"]',
                         'input': '//*[@id="selecttest"]' })
        self.check_autocomplete({ 'xpath': '//*[@id="selecttest"]',
                         'filt_rslts': '//*[@id="SP_menuoptions3"]',
                         'expected': 'JanuaryFebruaryMarchAprilMayAugust',
                         'test_key': 'a' })
        self.check_invalid_key ({ 'xpath': '//*[@id="selecttest"]',
                                  'inv_key': 'x' })

    def test04_select_w_imgs(self):
        """
           check that MenuOptions select list autocomplete works with images
        """
        self.url='http://www.menuoptions.org/examples/SelectWithImages.html'
        self.open_n_tst_title({'url': self.url, 'title': 'Select'} )
        self.check_autocomplete({ 'xpath': '//*[@id="CustSel"]',
                         'filt_rslts': '//*[@id="SP_menuoptions3"]',
                         'expected': 'CashChargeCheck',
                         'test_key': 'c' })

    def tearDown(self):
        super(testSL,self).tearDown()
        self.driver.quit()
