#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testMasks(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testMasks,self).setUp()
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'

    def test01_mask_initial_focus(self):
        """
           verify initial focus shows Help msg. Verify mask error handling (if user enter invalid data, error msg shows and char is deleted)
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'rslt': '',
                              'click': True,
                              'help_txt': 'HH:MM AM',
                              'position': 'bottom'
                           })
        self.check_help_msg({
                            'xpath': '//*[@id="starttime1"]',
                            'help_id': '//*[@id="HLP_menuoptions0"]',
                            'help_txt': '0 - 1 only',
                            'rslt': '',
                            'notKlass': ['data_error','data_good'],
                            'keys': 'x'
                        })

    def test03_mask_valid(self):
        """
           verify mask for valid data (default help is shown). Verify constants are automatically added when their position is reached
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'notKlass': ['data_neutral'],
                              'click': True,
                              'rslt': '1',
                              'keys': '1'
                           })
        self.check_help_msg({ 'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'keys': '09:29 A',
                              'klass': 'data_good',
                              'rslt': '09:29 AM' })

    def test05_check_backspace(self):
        """
           verify BACKSPACE key deletes constants properly and changes bg color class. Verify BACKSPACE key deletes first char and changes class
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'notKlass': ['data_neutral'],
                              'back_spc': True,
                              'rslt': '09:29 ', # deletes constant and previous char
                              'keys': '09:29 A'
                           })
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'notKlass': ['data_neutral'],
                              'back_spc': True,
                              'rslt': '',
                              'keys': '1',
                           })

    def test07_YMD_bad_mon(self):
        """
           verify YYYYMMDD rejects invalid month. Verify YYYYMMDD rejects invalid month in 2nd digit. Verify YYYYMMDD rejects invalid day. Verify card expiration works
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({ 'xpath': '//*[@id="CrdCdExp"]',
                              'help_id': '//*[@id="HLP_menuoptions15"]',
                              'keys': '11/11',
                              'klass': 'data_error',
                              'help_txt': 'Card expired',
                              'rslt': '11/1' })
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 1 only',
                              'klass': 'data_error',
                              'rslt': '2016', # deletes constant and previous char
                              'keys': '20165',
                           })
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': '20161',
                              'keys': '201618',
                           })
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': '201602',
                              'keys': '2016023',
                           })

    def test10_YMD_bad_day_2(self):
        """
           verify YYYYMMDD rejects invalid day in 2nd digit.  Verify Mon DD, YYYY rejects invalid day
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': 'not a leap year',
                              'klass': 'data_error',
                              'rslt': '2015022',
                              'keys': '20150229',
                           })
        self.check_help_msg({
                              'xpath': '//*[@id="MdYtest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': 'Feb ',
                              'keys': 'Feb 3',
                              'position': 'top'
                           })

    def test12_MdY_bad_day_2(self):
        """
           verify Mon DD, YYYY rejects invalid day in 2nd digit
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="MdYtest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'not a leap year',
                              'klass': 'data_error',
                              'keys': 'Feb 29, 2015',
                              'rslt': 'Feb 2',
                           })

    def test13_MdY_mon_complete(self):
        """
           verify Mon DD, YYYY auto completes month names where possible
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="MdYtest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'Mon DD, YYYY',
                              'klass': 'data_error',
                              'rslt': 'Feb ', # auto completes month name
                              'keys': 'F',
                           })

    def test14_MdY_invalid_mon(self):
        """
           verify Mon DD, YYYY rejects invalid month name
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="MdYtest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'invalid month',
                              'notKlass': ['data_error','data_good'],
                              'rslt': '',
                              'keys': 'x',
                           })

    def test15_HHMM_AM_chk_hrs(self):
        """
           verify HH:MM AM reject invalid hour
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions9"]',
                              'help_txt': '0 - 1 only',
                              'notKlass': ['data_error','data_good'],
                              'rslt': '',
                              'keys': '4',
                           })

    def test16_HHMM_AM_chk_hrs_2(self):
        """
           verify  HH:MM AM reject invalid hour in 2nd digit
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions9"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_neutral',
                              'rslt': '1',
                              'keys': '13',
                           })

    def test17_HHMM_AM_chk_mins(self):
        """
           verify HH:MM AM reject invalid minutes
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions9"]',
                              'help_txt': '0 - 5 only',
                              'klass': 'data_neutral',
                              'rslt': '12:',
                              'keys': '12:7',
                           })

    def test18_HHMM_AM_chk_bad_paste(self):
        """
           verify  HH:MM AM bad paste gets truncated to  first good char
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions9"]',
                              'help_txt': '0 - 5 only',
                              'klass': 'data_neutral',
                              'keys': '12:74zzz',
                              'rslt': '12:'
                           })

    def test19_HHMM_AM_bad_AM(self):
        """
           verify HH:MM AM reject anything other than AM or PM
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions9"]',
                              'help_txt': 'A or P only',
                              'klass': 'data_neutral',
                              'rslt': '12:22 ',
                              'keys': '12:22 z',
                           })

    def test20_phone_num_paren(self):
        """
           verify only numbers accepted in phone number
        """
        return
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Phonetest"]',
                              'help_id': '//*[@id="HLP_menuoptions6"]',
                              'help_txt': '(999) 999-9999',
                              'keys': 'zz',
                              'klass': 'data_error',
                              'position': 'top',
                              'rslt': '('
                           })

    def test21_both_ac_and_mask(self):
        """
           verify input mask and autocomplete work together
        """
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime3"]',
                              'help_id': '//*[@id="HLP_menuoptions4"]',
                              'help_txt': 'A or P only',
                              'klass': 'data_error',
                              'rslt': '12:22 ',
                              'keys': '12:22 z',
                           })
        self.driver.execute_script("$('input#starttime3').val('');")
        self.check_autocomplete({ 'xpath': '//*[@id="starttime3"]',
                         'filt_rslts': '//*[@id="SP_menuoptions4"]',
                         'expected': '12:00PM12:15PM12:30PM12:45PM',
                         'test_key': '12' })

    def test22_cc_exp_invalid_mon(self):
        """
           verify cc_exp rejects invalid month name and prepends a zero to any mon > 1
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="CrdCdExp"]',
                              'help_id': '//*[@id="HLP_menuoptions15"]',
                              'help_txt': '0 - 9 only',
                              'notKlass': ['data_error','data_good'],
                              'rslt': '',
                              'keys': 'x',
                           })
        self.check_help_msg({
                              'xpath': '//*[@id="CrdCdExp"]',
                              'help_id': '//*[@id="HLP_menuoptions15"]',
                              'rslt': '03/',
                              'sendkeys': '3',
                           })
        self.driver.find_element_by_xpath('//*[@id="CB_menuoptions15"]').click()
        self.check_help_msg({
                              'xpath': '//*[@id="CrdCdExp"]',
                              'help_id': '//*[@id="HLP_menuoptions15"]',
                              'rslt': '1',
                              'sendkeys': '1',
                           })

    def tearDown(self):
        super(testMasks,self).tearDown()
        self.driver.quit()
