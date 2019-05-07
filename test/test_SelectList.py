#!/usr/bin/python 

import time, re, sys
from selenium.webdriver.common.keys import Keys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testSL(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testSL,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'

    def test02_chk_inp(self):
        """
           check that MenuOptions select list InitialValue and scrolling works
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_content({ 'xpath': '//*[@id="selecttest"]',
                             'inputtext': 'December'})
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions1"]',
                         'input': '//*[@id="scrolltest"]' })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_DOWN,
                               'repeat': 9 })
        self.check_scrolling({ 'xpath': '//*[@id="scrolltest"]',
                               'keypress': Keys.ARROW_UP,
                               'repeat': 9 })

    def test03_autocomplete(self):
        """
           check select list autocomplete works (any character not in list is deleted). Verify entry of item that matches mask (and not in autocomplete list). Verify UserInputAllowed works (help, icons & ret values)
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions0"]',
            'input': '//*[@id="selecttest"]' })
        self.check_autocomplete({ 'xpath': '//*[@id="selecttest"]',
                         'filt_rslts': '//*[@id="SP_menuoptions0"]',
                         'expected': 'JanuaryFebruaryMarchAprilMayAugust',
                         'test_key': 'a' })
        print "after self.check_autocomplete"
        self.check_invalid_key ({ 'xpath': '//*[@id="selecttest"]',
                                  'inv_key': 'x' })
        print "after self.check_invalid_key"
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_regexp_validation({ 'xpath': '//*[@id="starttime3"]',
                              'clearbtn': '//*[@id="CB_menuoptions4"]',
                              'fill_str': '12:22 A',
                              'klass': 'data_good',
                              'TABout': True,
                              'rslt': '12:22 AM' })
        self.check_ENTER_exit({ 'xpath': '//*[@id="endtime3"]',
                              'clearbtn': '//*[@id="CB_menuoptions5"]',
                              'rslt': '12:27 AM',
                              'help_cls': 'mask_match',
                              'klass': 'data_good',
                              'instruct': 'ENTER' })
        self.url='http://'+self.IP+'/examples/AutocompleteWithUserInput_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({ 'xpath': '//*[@id="selecttest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'no list matches',
                              'help_cls': 'warn_text',
                              'keys': 'zzzz',
                              'klass': 'data_error',
                              'rslt': 'zzzz' })
        self.url='http://'+self.IP+'/examples/AutocompleteWithUserInput_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_user_input({ 'xpath': '//*[@id="selecttest"]',
                              'clearbtn': '//*[@id="CB_menuoptions0"]',
                              'sendkeys': 'zzzz',
                              'newVal': 'NewVal',
                              'newKey': 'NewKey' })

    def test06_regex(self):
        """
           check that MenuOptions select list autocomplete works special characters and that autocomplete works with images and clear button works
        """
        self.url='http://'+self.IP+'/examples/MultiSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_autocomplete({ 'xpath': '//*[@id="drivertip"]',
                         'filt_rslts': '//*[@id="SP_menuoptions7"]',
                         'expected': '1,000,000.00(verygooddriver)',
                         'test_key': '(' })
        self.url='http://'+self.IP+'/examples/SelectWithImages_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_autocomplete({ 'xpath': '//*[@id="CustSel"]',
                         'filt_rslts': '//*[@id="SP_menuoptions0"]',
                         'expected': 'CashChargeCheck',
                         'test_key': 'c' })
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_clr({ 'xpath': '//*[@id="CB_menuoptions1"]',
                         'input': '//*[@id="scrolltest"]' })
        self.is_element_present({ 'xpath': '//*[@id="SP_menuoptions1"]'})

    def test08_tab_with_data(self):
        """
           check MenuOptions chooses 1st matching item in select list when TAB is used to exit. Check MenuOptions leaves input element empty on TAB (when no chars in input). Check that MenuOptions chooses 1st  item in select list when ENTER is pressed
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_TAB_exit({ 'xpath': '//*[@id="starttime2"]',
                              'rslt': '09:15 AM',
                              'klass': 'data_good',
                              'test_key': '1' })
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_TAB_exit({ 'xpath': '//*[@id="starttime1"]',
                              'rslt': '',
                              'notKlass': ['data_error','data_good'] })
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_ENTER_exit({ 'xpath': '//*[@id="starttime2"]',
                              'rslt': '09:00 AM',
                              'klass': 'data_good' })
        self.check_menu_opt_key({ 'xpath': '//*[@id="starttime2"]',
                                'menu_opt': '09:00 AM' })

    def test11_chk_initial_data_validation(self):
        """
           check that MenuOptions validates initialization data (InitialValue) and that autocomplete truncates or deletes bad pasted data
        """
        self.url='http://'+self.IP+'/examples/QuickStartSelect_test.html?bad_data'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_content({ 'xpath': '//*[@id="selecttest"]',
                             'inputtext': 'June'})
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_regexp_validation({ 'xpath': '//*[@id="selecttest"]',
                              'clearbtn': '//*[@id="CB_menuoptions0"]',
                              'fill_str': 'menuoptionsonselect',
                              'klass': 'data_error',
                              'rslt': 'm' })

    def test13_check_backspace(self):
        """
           verify BACKSPACE function on mask and autocomplete combo fields
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_regexp_validation({ 'xpath': '//*[@id="starttime3"]',
                              'clearbtn': '//*[@id="CB_menuoptions3"]',
                              'fill_str': '09:',
                              'back_spc': True,
                              'klass': 'data_error',
                              'rslt': '0' })


    def tearDown(self):
        super(testSL,self).tearDown()
        self.driver.quit()
