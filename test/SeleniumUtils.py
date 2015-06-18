import time, re, sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.alert import Alert


class MO_Test_Utils(object):

    def open_n_tst_title (self, params):
        self.browser.get(params['url'])
        assert params['title'] in self.browser.title

    def is_element_present(self, params):
        try: self.browser.find_element_by_xpath(params['xpath'])
        except NoSuchElementException, e: assert False
        assert True

    def check_autocomplete (self, params ):
        elem=self.browser.find_element_by_xpath(params['xpath'])
        elem.send_keys(params['test_key'])
        hover = ActionChains(self.browser).move_to_element(elem)
        hover.perform()
        if 'filt_rslts' in params and params['filt_rslts']:
            txt=self.browser.find_element_by_xpath(params['filt_rslts']).text
            str_txt=re.sub(r'\s+', '', txt)
            print ' '.join(['Found:',str_txt,'Expected:',params['expected']])
            assert str_txt == params['expected']

    def check_invalid_key (self, params ):
        elem=self.browser.find_element_by_xpath(params['xpath'])
        orig_text=elem.get_attribute('value')
        elem.send_keys(params['inv_key'])
        new_text=elem.get_attribute('value')
        print ' '.join(['New:',new_text,'Orig:',orig_text, 'Invalid key:',params['inv_key']])
        assert orig_text == new_text

    def check_content (self, params ):
        elem=self.browser.find_element_by_xpath(params['xpath'])
        input_text=elem.get_attribute('value')
        print ' '.join(["Expected text in xpath:",params['xpath'],"=",input_text,
            'Actual text:',params['inputtext']])
        assert params['inputtext'] == input_text

    def check_clr (self, params ):
        self.browser.find_element_by_xpath(params['xpath']).click()
        elem=self.browser.find_element_by_xpath(params['input'])
        input_text=elem.get_attribute('value')
        print "Clicked clear, input value = " + input_text
        assert input_text == ''

    def click_menu_item (self, params ):
        sleeptime = params['sleep'] if 'sleep' in params else 0
        self.hover_over({ 'menu': params['menu']})
        print "Clicking over = " + params['xpath']
        elem =self.browser.find_element_by_xpath(params['xpath']).click()
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

