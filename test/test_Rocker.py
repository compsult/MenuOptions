#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class test_rocker(SeleniumUtils, SetupByLocation):

    def __init__(self):
        super(test_rocker,self).setUp()
        self.url='http://'+self.IP+'/examples/MultiSelect.html'

    def test02_rocker(self):
        """
           check that rocker control works on MultiSelect screen (added reset test 10/15)
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'cfg',
                          'xpath': '//td[text()="Programatically set all values"]',
                          'sleep': 3 })
        self.click_menu_item({ 'menu': 'cfg',
                          'xpath': '//td[text()="Use rocker control for binary choices"]',
                          'sleep': 5 })
        self.check_rocker({ 'xpath': '//*[@id="RK_LT_menuoptions5"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions5"]/span',
                             'classnm': 'ltdown' })
        self.check_rocker({ 'xpath': '//*[@id="RK_RT_menuoptions5"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions5"]/span',
                             'classnm': 'rtup' })
        self.check_rocker({ 'xpath': '//*[@id="RK_LT_menuoptions10"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions10"]/span',
                             'classnm': 'ltup' })
        self.check_rocker({ 'xpath': '//*[@id="RK_RT_menuoptions10"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions10"]/span',
                             'classnm': 'rtdown' })
        self.check_serialize({ 'xpath': '//*[@id="menutest"]',
                          'js_result': 'fake_alert',
                          'sleep': 2,
                          'expected': 'pizzatype=1&toppings=2&crust=3&cheese=3&cooked=2&delivery=2&drivertip=6' })
        self.reset_rocker({ 'id':'pizzatype' })
        self.check_rocker({ 'xpath': '//*[@id="RK_LT_menuoptions5"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions5"]/span',
                            'classnm': 'ltup' })
        self.check_rocker({ 'xpath': '//*[@id="RK_RT_menuoptions5"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions5"]/span',
                            'classnm': 'rtup' })

    def test03_rocker(self):
        """
           check that the MenuOptions rocker control works on Rocker only screen
        """
        self.url='http://'+self.IP+'/examples/RockerControl.html'
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.check_rocker({ 'click': True,
                            'xpath': '//*[@id="RK_LT_menuoptions6"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions6"]/span',
                            'classnm': 'ltdown' })
        self.check_rocker({ 'click': True,
                            'xpath': '//*[@id="RK_RT_menuoptions7"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions7"]/span',
                            'classnm': 'rtdown' })
        self.check_rocker({ 'click': True,
                            'xpath': '//*[@id="RK_LT_menuoptions5"]',
                            'xpath_txt': '//*[@id="RK_LT_menuoptions5"]/span',
                            'classnm': 'ltdown' })
        self.check_rocker({ 'click': True,
                            'xpath': '//*[@id="RK_RT_menuoptions4"]',
                            'xpath_txt': '//*[@id="RK_RT_menuoptions4"]/span',
                            'classnm': 'rtdown' })
        self.check_serialize({ 'xpath': '//*[@id="menutest"]',
                          'js_result': 'fake_alert',
                          'sleep': 1,
                          'expected': 'TrueFalse=T&YesNo=N&MaleFemale=M&on_off=2' })


    def tearDown(self):
        super(test_rocker,self).tearDown()
        self.driver.quit()
