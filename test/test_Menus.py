#!/usr/bin/python 

import time, re, sys
from SeleniumUtils import SeleniumUtils, SetupByLocation


class testMO(SeleniumUtils, SetupByLocation):

    def setUp(self):
        super(testMO,self).setUp()
        self.url='http://'+self.IP+'/examples/MenusBottom.html'

    def test02_js(self):
        """
           click javascript menu item and test if MO show javascript was run message
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item ({ 'menu': 'menu_plain',
                          'xpath': '//td[text()="javascript"]',
                          'sleep': 3,
                          'js_result': 'fake_alert',
                          'expected': 'I just ran javscript from plain menu'})

    def test03_google(self):
        """
           click google menu (plain) item and test if MO navigates there
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_plain',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test04_js(self):
        """
           click javascript menu (with imgs) item and test if MO show javascript was run message
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_w_imgs',
                          'xpath': '//td[text()="javascript"]',
                          'js_result': 'fake_alert',
                          'expected': 'I just ran javscript from menu with images',
                          'sleep': 1 })

    def test05_google(self):
        """
           click google menu (with imgs) item and test if MO navigates there
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_w_imgs',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test07_google(self):
        """
           click google menu (with dividers & filters) item and test if MO navigates there
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_divs_filts',
                          'xpath': '//td[text()="Google"]',
                          'fltr' : 'hdr_fltrAll',
                          'sleep': 3 })
        self.find_tab('Google')

    def test08_mousefiltering(self):
        """
           verify that mouseover Search shows GoogleYahoo
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': 'menu_divs_filts'})
        self.hover_over({ 'menu': 'hdr_fltrSearch',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'GoogleYahoo' })

    def test09_mousefiltering(self):
        """
           verify that mouseover Biz shows CNBCMarketWatch
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': 'menu_divs_filts'})
        self.hover_over({ 'menu': 'hdr_fltrBiz',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'CNBCMarketWatch' })

    def test10_mousefiltering(self):
        """
           verify that mouseover (all) shows SearchGoogleYahooBusinessCNBCMarketWatch
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.hover_over({ 'menu': 'menu_divs_filts'})
        self.hover_over({ 'menu': 'hdr_fltrAll',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'SearchGoogleYahooBusinessCNBCMarketWatch' })

    def test11_dividers(self):
        """
           click divider menu item and make sure no window opens
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_divs_filts',
            'xpath': '//td[@class="divider" and contains(.,"Search")]',
            'fltr' : 'hdr_fltrAll',
            'sleep': 3 })
        assert len(self.driver.window_handles) == 1

    def test12_replace_window(self):
        """
           click menu item and make sure current window is replaced
        """
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': 'menu_divs_filts',
                          'xpath': '//td[text()="Google"]',
                          'fltr' : 'hdr_fltrAll',
                          'sleep': 3 })
        assert len(self.driver.window_handles) == 1


    def tearDown(self):
        super(testMO,self).tearDown()
        self.driver.quit()

