#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testMasks(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testMasks,self).setUp()
        self.url='http://'+self.IP+'/examples/MaskCombos_test.html'

    def test01_mask_initial_focus(self):
        """
           verify initial focus shows Help msg
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'rslt': '',
                              'click': True,
                              'help_txt': 'HH:MM AM'
                           })

    def test02_mask_error(self):
        """
           verify mask error handling (if user enter invalid data, error msg shows and char is deleted)
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.check_help_msg({
                            'xpath': '//*[@id="starttime1"]',
                            'help_id': '//*[@id="HLP_menuoptions0"]',
                            'help_txt': '0 - 1 only',
                            'rslt': '',
                            'notKlass': ['data_error','data_good'],
                            'selector': 'input#starttime1',
                            'keys': 'x'
                        })

    def test03_mask_valid(self):
        """
           verify mask for valid data (default help is shown)
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'klass': 'data_error',
                              'click': True,
                              'rslt': '1',
                              'selector': 'input#starttime1',
                              'keys': '1'
                           })

    def test04_mask_valid(self):
        """
           verify constants are automatically added when their position is reached
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({ 'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'selector': 'input#starttime1',
                              'keys': '09:29 A',
                              'klass': 'data_good',
                              'rslt': '09:29 AM' })

    def test05_check_backspace(self):
        """
           verify BACKSPACE key deletes constants properly and changes bg color class
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'klass': 'data_error',
                              'back_spc': True,
                              'rslt': '09:29 ', # deletes constant and previous char
                              'selector': 'input#starttime1',
                              'keys': '09:29 A'
                           })

    def test06_check_backspace(self):
        """
           verify BACKSPACE key deletes first char and changes class
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_help_msg({
                              'xpath': '//*[@id="starttime1"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': 'HH:MM AM',
                              'notKlass': ['data_error','data_good'],
                              'back_spc': True,
                              'rslt': '',
                              'keys': '1',
                              'selector': 'input#starttime1' # should result in '09:29 AM'
                           })

    def test07_YMD_bad_mon(self):
        """
           verify YYYYMMDD rejects invalid month
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions1"]',
                              'help_txt': '0 - 1 only',
                              'klass': 'data_error',
                              'rslt': '2016', # deletes constant and previous char
                              'keys': '20165',
                              'selector': 'input#YMDtest' # should result in '09:29 AM'
                           })

    def test08_YMD_bad_mon_2(self):
        """
           verify YYYYMMDD rejects invalid month in 2nd digit
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions1"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': '20161',
                              'keys': '201618',
                              'selector': 'input#YMDtest'
                           })

    def test09_YMD_bad_day(self):
        """
           verify YYYYMMDD rejects invalid day
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions1"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': '201602', # deletes constant and previous char
                              'keys': '2016023',
                              'selector': 'input#YMDtest' # should result in '09:29 AM'
                           })

    def test10_YMD_bad_day_2(self):
        """
           verify YYYYMMDD rejects invalid day in 2nd digit
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="YMDtest"]',
                              'help_id': '//*[@id="HLP_menuoptions1"]',
                              'help_txt': 'not a leap year',
                              'klass': 'data_error',
                              'rslt': '2015022', # deletes constant and previous char
                              'keys': '20150229',
                              'selector': 'input#YMDtest'
                           })

    def test11_MdY_bad_day(self):
        """
           verify Mon DD, YYYY rejects invalid day
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="MdYtest"]',
                              'help_id': '//*[@id="HLP_menuoptions0"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': 'Feb ', # deletes constant and previous char
                              'keys': 'Feb 3',
                              'selector': 'input#MdYtest'
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
                              'selector': 'input#MdYtest'
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
                              'selector': 'input#MdYtest'
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
                              'selector': 'input#MdYtest'
                           })

    def test15_HHMM_AM_chk_hrs(self):
        """
           verify HH:MM AM reject invalid hour
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 1 only',
                              'notKlass': ['data_error','data_good'],
                              'rslt': '',
                              'keys': '4',
                              'selector': 'input#Timetest'
                           })

    def test16_HHMM_AM_chk_hrs_2(self):
        """
           verify  HH:MM AM reject invalid hour in 2nd digit
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 2 only',
                              'klass': 'data_error',
                              'rslt': '1',
                              'keys': '13',
                              'selector': 'input#Timetest'
                           })

    def test17_HHMM_AM_chk_mins(self):
        """
           verify HH:MM AM reject invalid minutes
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 5 only',
                              'klass': 'data_error',
                              'rslt': '12:',
                              'keys': '12:7',
                              'selector': 'input#Timetest'
                           })

    def test18_HHMM_AM_chk_bad_paste(self):
        """
           verify  HH:MM AM bad paste gets truncated to  first good char
        """
        self.url='http://'+self.IP+'/examples/Masks_test.html'
        self.open_n_tst_title({'url': self.url, 'title': 'masks'})
        self.check_help_msg({
                              'xpath': '//*[@id="Timetest"]',
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': '0 - 5 only',
                              'klass': 'data_error',
                              'keys': '12:74zzz',
                              'selector': 'input#Timetest',
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
                              'help_id': '//*[@id="HLP_menuoptions3"]',
                              'help_txt': 'A or P only',
                              'klass': 'data_error',
                              'rslt': '12:22 ',
                              'keys': '12:22 z',
                              'selector': 'input#Timetest'
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
                              'help_id': '//*[@id="HLP_menuoptions2"]',
                              'help_txt': '(999) 999-9999',
                              'keys': 'zz',
                              'selector': 'input#Phonetest',
                              'klass': 'data_error',
                              'rslt': '('
                           })

    def tearDown(self):
        super(testMasks,self).tearDown()
        self.driver.quit()
