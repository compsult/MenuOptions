#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testDS(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testDS,self).setUp()
        self.url='http://'+self.IP+'/examples/QuickStartSelect.html'
        self.expected_for_array="[{u'ky':u'January',u'val':u'January'},{u'ky':u'February',u'val':u'February'},{u'ky':u'March',u'val':u'March'},{u'ky':u'April',u'val':u'April'},{u'ky':u'May',u'val':u'May'},{u'ky':u'June',u'val':u'June'},{u'ky':u'July',u'val':u'July'},{u'ky':u'August',u'val':u'August'},{u'ky':u'September',u'val':u'September'},{u'ky':u'October',u'val':u'October'},{u'ky':u'November',u'val':u'November'},{u'ky':u'December',u'val':u'December'}]"
        self.expected_for_objects="[{u'ky':u'1',u'val':u'January'},{u'ky':u'2',u'val':u'February'},{u'ky':u'3',u'val':u'March'},{u'ky':u'4',u'val':u'April'},{u'ky':u'5',u'val':u'May'},{u'ky':u'6',u'val':u'June'},{u'ky':u'7',u'val':u'July'},{u'ky':u'8',u'val':u'August'},{u'ky':u'9',u'val':u'September'},{u'ky':u'10',u'val':u'October'},{u'ky':u'11',u'val':u'November'},{u'ky':u'12',u'val':u'December'}]"

    def test01_data_struct(self):
        """
           check ary_of_objs data structure with 1 dimens array as Data
        """
        self.open_n_tst_title({'url': self.url+"?one_dimens_ary", 'title': 'MenuOptions'} )
        self.js_chk_data_struct ({'id': 'selecttest',
                                  'expected': self.expected_for_array })

    def test02_data_struct(self):
        """
           check ary_of_objs data structure with 2 dimens array as Data
        """
        self.open_n_tst_title({'url': self.url+"?two_dimens_ary", 'title': 'MenuOptions'} )
        self.js_chk_data_struct ({'id': 'selecttest',
                                  'expected': self.expected_for_array })

    def test03_data_struct(self):
        """
           check ary_of_objs data structure with array of objects as Data
        """
        self.open_n_tst_title({'url': self.url+"?ary_of_objs", 'title': 'MenuOptions'} )
        self.js_chk_data_struct ({'id': 'selecttest',
                                  'expected': self.expected_for_objects })

    def test04_data_struct(self):
        """
           check ary_of_objs data structure with single multi key object as Data
        """
        self.open_n_tst_title({'url': self.url+"?singleobject", 'title': 'MenuOptions'} )
        self.js_chk_data_struct ({'id': 'selecttest',
                                  'expected': self.expected_for_objects })

    def test05_data_struct(self):
        """
           check ary_of_objs data structure with array of multi key objects as Data
        """
        self.open_n_tst_title({'url': self.url+"?ary_of_mk_objs", 'title': 'MenuOptions'} )
        self.js_chk_data_struct ({'id': 'selecttest',
                                  'expected': self.expected_for_objects })

    def tearDown(self):
        super(testDS,self).tearDown()
        self.driver.quit()
