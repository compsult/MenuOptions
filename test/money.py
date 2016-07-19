import time, re, sys, os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
#--- from selenium.webdriver.common.desired_capabilities import DesiredCapabilities ---#
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.alert import Alert

class MoneyUtils(object):

    def check_pos (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        elem=self.driver.find_element_by_xpath(params['xpath'])
        elem.click()
        if 'keys' in params and len(params['keys']) > 0:
            elem.send_keys(params['keys'])
        js_script = "return $('input#"+params['id']+"').val().length - $('input#"+params['id']+"').get(0).selectionStart;"
        pos = self.driver.execute_script(js_script)
        print ' '.join(["Expected pos in xpath:",params['xpath']," = ",str(params['pos']),
            'Actual pos:',str(pos)])
        assert params['pos'] == pos

