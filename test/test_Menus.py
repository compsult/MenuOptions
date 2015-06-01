#!/usr/bin/python 

import time, re, sys
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert


class MO_Test_Utils(object):

    def open_n_tst_title (self, params):
        self.browser.get(params['url'])
        assert params['title'] in self.browser.title

    def click_elem (self, params ):
        sleeptime = params['sleep'] if 'sleep' in params else 0
        self.hover_over({ 'menu': params['menu']})
        print "Clicking over = " + params['xpath']
        elem =self.browser.find_element_by_xpath(params['xpath']).click();
        time.sleep(sleeptime)
        if 'alert' in params and params['alert']:
            alert_text = Alert(self.browser).text
            assert params['alerttext'] == alert_text
            alert =self.browser.switch_to_alert()
            alert.dismiss()

    def close_last_tab(self):
        if (len(self.browser.window_handles) == 2):
           self.browser.switch_to.window(window_name=self.browser.window_handles[0])
           self.browser.close()
           self.browser.switch_to.window(window_name=self.browser.window_handles[1])

    def find_tab (self, tab_title ):
        result=False
        for handle in self.browser.window_handles:
            self.browser.switch_to_window(handle)
            if re.search(tab_title,self.browser.title, re.IGNORECASE):
                result=True
                break
        assert result == True

    def hover_over (self, params ):
        print "Hovering over = " + params['menu']
        elem =self.browser.find_element_by_xpath(params['menu'])
        hover = ActionChains(self.browser).move_to_element(elem)
        hover.perform()
        if 'filt_rslts' in params and params['filt_rslts']:
            txt=self.browser.find_element_by_xpath(params['filt_rslts']).text
            str_txt=re.sub(r'\s+', '', txt)
            assert str_txt == params['expected']

class testMO(MO_Test_Utils):

    def setUp(self):
        #--- self.browser = webdriver.Chrome() ---#
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(30) # seconds
        self.url='http://menuoptions/examples/MenusBottom.html'

    def test02_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_plain"]',
                          'xpath': '//td[text()="javascript"]',
                          'sleep': 1,
                          'alert': True,
                          'alerttext': 'I just ran a javscript function 2'})

    def test03_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_plain"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test04_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_w_imgs"]',
                          'xpath': '//td[text()="javascript"]',
                          'alert': True,
                          'sleep': 1,
                          'alerttext': 'I just ran a javscript function 1 '})

    def test05_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_w_imgs"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test06_js(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_divs_filts"]',
                          'xpath': '//td[text()="Search"]',
                          'sleep': 1 })

    def test07_google(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.click_elem({ 'menu': '//button[@id="menu_divs_filts"]',
                          'xpath': '//td[text()="Google"]',
                          'sleep': 1 })
        self.find_tab('Google')

    def test08_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"Search")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'GoogleYahoo' });

    def test09_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'} )
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"Biz")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'CNBCMarketWatch' });

    def test10_mousefiltering(self):
        self.open_n_tst_title({'url': self.url, 'title': 'MenuOptions'})
        self.hover_over({ 'menu': '//button[@id="menu_divs_filts"]'})
        self.hover_over({
             'menu': '//span/following::table[@class="HdrFilter"]//tr//td[contains(.,"(all)")]',
             'filt_rslts': '//span/following::table[@class="CrEaTeDtAbLeStYlE"]',
             'expected': 'SearchGoogleYahooBusinessCNBCMarketWatch' });


    def tearDown(self):
        self.browser.quit()
