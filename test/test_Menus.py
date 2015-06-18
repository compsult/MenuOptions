#!/usr/bin/python 

import time, re, sys
from selenium import webdriver
from SeleniumUtils import MO_Test_Utils


class testMO(MO_Test_Utils):

    def setUp(self):
        #--- self.browser = webdriver.Chrome() ---#
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://menuoptions/examples/MenusBottom.html'

    def test02_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item ({ 'menu': '//button[@id="menu_plain"]',
                          'xpath': '//td[text()="javascript"]',
                          'sleep': 1,
                          'alert': True,
                          'alerttext': 'I just ran a javscript function 2'})

    def test03_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': '//button[@id="menu_plain"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test04_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': '//button[@id="menu_w_imgs"]',
                          'xpath': '//td[text()="javascript"]',
                          'alert': True,
                          'sleep': 1,
                          'alerttext': 'I just ran a javscript function 1 '})

    def test05_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': '//button[@id="menu_w_imgs"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test06_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': '//button[@id="menu_divs_filts"]',
                          'xpath': '//td[text()="Search"]',
                          'sleep': 1 })

    def test07_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_menu_item({ 'menu': '//button[@id="menu_divs_filts"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test08_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"Search")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'GoogleYahoo' })

    def test09_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"Biz")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'CNBCMarketWatch' })

    def test10_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"(all)")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'SearchGoogleYahooBusinessCNBCMarketWatch' })


    def tearDown(self):
        self.browser.quit()
