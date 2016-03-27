#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testSL(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testSL,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect.html'

    def test02_chk_inp(self):
        """
           check that MenuOptions select list InitialValue works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_content({ 'xpath': '//*[@id="selecttest"]',
                             'inputtext': 'December'})

    def test03_autocomplete(self):
        """
           check that MenuOptions select list autocomplete works and that any character not in select list is deleted
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions4"]',
            'input': '//*[@id="selecttest"]' })
        self.check_autocomplete({ 'xpath': '//*[@id="selecttest"]',
                         'filt_rslts': '//*[@id="SP_menuoptions4"]',
                         'expected': 'JanuaryFebruaryMarchAprilMayAugust',
                         'test_key': 'a' })
        self.check_invalid_key ({ 'xpath': '//*[@id="selecttest"]',
                                  'inv_key': 'x' })

    def test04_select_w_imgs(self):
        """
           check that MenuOptions select list autocomplete works with images
        """
        self.url='http://'+self.IP+'/examples/SelectWithImages.html'
        self.open_n_tst_title({'url': self.url, 'title': 'Select'} )
        self.check_autocomplete({ 'xpath': '//*[@id="CustSel"]',
                         'filt_rslts': '//*[@id="SP_menuoptions4"]',
                         'expected': 'CashChargeCheck',
                         'test_key': 'c' })

    def test05_regex(self):
        """
           check that MenuOptions select list autocomplete works special characters
        """
        self.url='http://'+self.IP+'/examples/MultiSelect.html'
        self.open_n_tst_title({'url': self.url, 'title': 'multiple'} )
        self.check_autocomplete({ 'xpath': '//*[@id="drivertip"]',
                         'filt_rslts': '//*[@id="SP_menuoptions11"]',
                         'expected': '1,000,000.00(verygooddriver)',
                         'test_key': '(' })

    def test0r65_clear_btn(self):
        """
           check that click on 'X' clears the input and opens the select list dropdown
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions5"]',
            'input': '//*[@id="selecttest"]' })
        self.is_element_present({ 'xpath': '//*[@id="SP_menuoptions5"]'})

    def tearDown(self):
        super(testSL,self).tearDown()
        self.driver.quit()
