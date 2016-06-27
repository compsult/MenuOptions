#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testSL(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testSL,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'

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
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions0"]',
            'input': '//*[@id="selecttest"]' })
        self.check_autocomplete({ 'xpath': '//*[@id="selecttest"]',
                         'filt_rslts': '//*[@id="SP_menuoptions0"]',
                         'expected': 'JanuaryFebruaryMarchAprilMayAugust',
                         'test_key': 'a' })
        self.check_invalid_key ({ 'xpath': '//*[@id="selecttest"]',
                                  'inv_key': 'x' })

    def test04_regexp(self):
        """
           check that MenuOptions allows entry of item that matches mask (and not in select list)
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_regexp_validation({ 'xpath': '//*[@id="starttime3"]',
                              'clearbtn': '//*[@id="CB_menuoptions4"]',
                              'fill_str': '12:22 A',
                              'klass': 'data_good',
                              'TABout': True,
                              'rslt': '12:22 AM' })
        self.check_ENTER_exit({ 'xpath': '//*[@id="endtime3"]',
                              'clearbtn': '//*[@id="CB_menuoptions5"]',
                              'rslt': '12:27 AM',
                              'klass': 'data_good',
                              'instruct': 'ENTER' })

    def test05_select_w_imgs(self):
        """
           check that MenuOptions select list autocomplete works with images
        """
        self.url='http://'+self.IP+'/examples/SelectWithImages_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'Select'} )
        self.check_autocomplete({ 'xpath': '//*[@id="CustSel"]',
                         'filt_rslts': '//*[@id="SP_menuoptions0"]',
                         'expected': 'CashChargeCheck',
                         'test_key': 'c' })

    def test06_regex(self):
        """
           check that MenuOptions select list autocomplete works special characters
        """
        self.url='http://'+self.IP+'/examples/MultiSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'multiple'} )
        self.check_autocomplete({ 'xpath': '//*[@id="drivertip"]',
                         'filt_rslts': '//*[@id="SP_menuoptions7"]',
                         'expected': '1,000,000.00(verygooddriver)',
                         'test_key': '(' })

    def test07_clear_btn(self):
        """
           check that click on 'X' clears the input and opens the select list dropdown
        """
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions1"]',
                         'input': '//*[@id="scrolltest"]' })
        self.is_element_present({ 'xpath': '//*[@id="SP_menuoptions1"]'})

    def test08_tab_with_data(self):
        """
           check that MenuOptions chooses 1st matching item in select list when TAB is used to exit
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_TAB_exit({ 'xpath': '//*[@id="starttime2"]',
                              'rslt': '09:15 AM',
                              'klass': 'data_good',
                              'test_key': '1' })

    def test09_tab_with_no_data(self):
        """
           check that MenuOptions leaves input element empty on TAB (when no chars in input)
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_TAB_exit({ 'xpath': '//*[@id="starttime1"]',
                              'rslt': '',
                              'notKlass': ['data_error','data_good'] })

    def test10_enter(self):
        """
           check that MenuOptions chooses 1st  item in select list when ENTER is pressed
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_ENTER_exit({ 'xpath': '//*[@id="starttime2"]',
                              'rslt': '09:00 AM',
                              'klass': 'data_good' })

    def tearDown(self):
        super(testSL,self).tearDown()
        self.driver.quit()
