#!/usr/bin/python 

import time, re, sys
from selenium import webdriver
from SeleniumUtils import MO_Test_Utils


class testMO(MO_Test_Utils):

    def setUp(self):
        #--- self.browser = webdriver.Chrome() ---#
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://menuoptions/examples/QuickStartSelect.html'

    def test02_chk_inp(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_content({ 'xpath': '//*[@id="selecttest"]',
                             'inputtext': 'December'})

    def test03_clr_n_autocomplete(self):
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
        self.url='http://menuoptions/examples/SelectWithImages.html'
        self.open_n_tst_title({'url': self.url, 'title': 'Select'} )
        self.check_autocomplete({ 'xpath': '//*[@id="CustSel"]',
                         'filt_rslts': '//*[@id="SP_menuoptions3"]',
                         'expected': 'CashChargeCheck',
                         'test_key': 'c' })

    def tearDown(self):
        self.browser.quit()
