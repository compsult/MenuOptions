import time, re, sys, os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.alert import Alert


USERNAME=os.getenv("SAUCE_USERNAME")
SECRET_KEY=os.getenv("SAUCE_ACCESS_KEY")
LOCAL_IP="127.0.0.1"

class SetupByLocation(object):

    def setUp (self):
        self.TST_LOCATION = os.getenv("TST_LOCATION")
        self.TST_BROWSER = os.getenv("TST_BROWSER")
        if self.TST_LOCATION is None:
            raise NameError("Env variable TST_LOCATION not defined")
        if self.TST_BROWSER is None:
            raise NameError("Env variable TST_BROWSER not defined")
        if re.search(r'sauce', self.TST_LOCATION, re.I):
            self.cfg_sauce()
        elif re.search(r'local', self.TST_LOCATION, re.I):
            self.cfg_local()

    def cfg_local (self):
        if self.TST_BROWSER is not None:
            self.IP=LOCAL_IP
            if re.search(r'chrome', self.TST_BROWSER, re.I):
                self.driver = webdriver.Chrome()
            elif re.search(r'firefox', self.TST_BROWSER, re.I):
                self.driver = webdriver.Firefox()
            elif re.search(r'internet explorer', self.TST_BROWSER, re.I):
                self.driver = webdriver.Ie()

    def cfg_sauce (self):
        self.IP="localhost"
        SE_HUB=os.getenv("SAUCE_URL")
        TST_VERSION=os.getenv("TST_VERSION")
        TST_NAME=os.getenv("TST_NAME")
        TST_PLATFORM=os.getenv("TST_PLATFORM") # linux, windows, mac
        TST_BUILD=os.getenv("TST_BUILD") # build id
        TST_VERSION=os.getenv("TST_VERSION,") or ""
        TST_DEVICE=os.getenv("TST_DEVICE") or ""
        TST_DEVICE_ORIENT=os.getenv("TST_DEVICE_ORIENT") or ""
        sauce_url = ''.join(["http://", USERNAME,":",SECRET_KEY,"@",SE_HUB])
        desired_capabilities = {
            'platform': TST_PLATFORM,
            'browserName': self.TST_BROWSER,
            "public": "public",
            "passed": "true",
            "build": TST_BUILD,
            'version': TST_VERSION,
            'deviceName': TST_DEVICE,
            'deviceOrientation': TST_DEVICE_ORIENT,
            'name': TST_NAME,
        }
        self.driver = webdriver.Remote(desired_capabilities=desired_capabilities,
                            command_executor=sauce_url)

    def tearDown (self):
        self.TST_LOCATION = os.getenv("TST_LOCATION")
        if self.TST_LOCATION is not None and re.search(r'sauce',
                self.TST_LOCATION, re.I):
            from sauceclient import SauceClient
            sauce_client = SauceClient(USERNAME, SECRET_KEY)
            sauce_client.jobs.update_job(self.driver.session_id, passed=True)

class SeleniumUtils(object):

    def open_n_tst_title (self, params):
        self.driver.get(params['url'])
        time.sleep(2)
        assert params['title'] in self.driver.title

    def is_element_present(self, params):
        try: self.driver.find_element_by_xpath(params['xpath'])
        except NoSuchElementException, e: assert False
        assert True

    def check_html (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        elem.click()
        if 'cell' in params and params['cell']:
            elem2=self.driver.find_element_by_xpath(params['cell'])
            found=re.sub(r'\s+', '', elem2.get_attribute('innerHTML'))
        else:
            found=re.sub(r'\s+', '', elem.get_attribute('innerHTML'))
        params['expected']=re.sub(r'\s+', '', params['expected'].decode('utf-8'))
        print ' '.join(['Found:   ',found.encode('utf-8'),'\nExpected:',params['expected'].encode('utf-8')])
        assert params['expected'] == found

    def check_invalid_key (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        orig_text=elem.get_attribute('value')
        elem.send_keys(params['inv_key'])
        new_text=elem.get_attribute('value')
        print ' '.join(['New:',new_text,'Orig:',orig_text, 'Invalid key:',params['inv_key']])
        assert orig_text == new_text

    def check_scrolling (self, params ):
        elem =self.driver.find_element_by_xpath(params['xpath'])
        elem.click()
        elem.send_keys(params['keypress']*params['repeat'])
        elem=self.driver.find_element_by_xpath('//*[@id="SP_menuoptions4"]/table/tbody/tr['+str(params['repeat'])+']')
        rowtop=elem.location['y']
        rowheight=elem.size['height']
        elem=self.driver.find_element_by_xpath('//*[@id="SP_menuoptions4"]')
        vistop=elem.location['y']
        visheight=elem.size['height']
        print ' '.join(['rowtop:',str(rowtop),'rowheight:',str(rowheight),
                        'vistop:',str(vistop), 'visheight:',str(visheight)])
        if params['keypress'] == Keys.ARROW_DOWN and \
                  vistop+visheight < rowtop+rowheight:
            assert False
        elif params['keypress'] == Keys.ARROW_UP and \
                vistop > rowtop:
            assert False
        else:
            assert True

    def check_content (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        input_text=elem.get_attribute('value')
        print ' '.join(["Expected text in xpath:",params['xpath'],"=",input_text,
            'Actual text:',params['inputtext']])
        assert params['inputtext'] == input_text

    def check_clr (self, params ):
        self.driver.find_element_by_xpath(params['xpath']).click()
        elem=self.driver.find_element_by_xpath(params['input'])
        input_text=elem.get_attribute('value')
        print "Clicked clear, input value = " + input_text
        assert input_text == ''

    def check_rocker (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        if 'click' in params and params['click'] == True:
            elem.click()
        classnm=elem.get_attribute('class')
        rkr_txt=self.driver.find_element_by_xpath(params['xpath_txt']).text
        print "Rocker elem = " + str(rkr_txt) + " classnm = " + classnm
        assert params['classnm'] == classnm

    def check_serialize (self, params ):
        self.driver.maximize_window();
        sleeptime = params['sleep'] if 'sleep' in params else 0
        time.sleep(sleeptime)
        self.driver.find_element_by_xpath(params['xpath']).click()
        time.sleep(sleeptime)
        self._check_js_result( params )

    def check_add_menu_opt_key (self, params ):
        self.driver.find_element_by_xpath(params['clr_xpath']).click()
        elem=self.driver.find_element_by_xpath(params['xpath'])
        elem.send_keys(params['inp_text'])
        js_script = ''.join(["$('input#", params['id'],
            "').menuoptions('add_menuoption_key');"])
        self.driver.execute_script(js_script)
        menu_opt_key = elem.get_attribute('menu_opt_key')
        print ' '.join(['Expected attr:',params['exp_key'],'Actual:',menu_opt_key])
        assert menu_opt_key == params['exp_key']

    def check_autocomplete (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        elem.send_keys(params['test_key'])
        if 'filt_rslts' in params and params['filt_rslts']:
            txt=self.driver.find_element_by_xpath(params['filt_rslts']).text
            str_txt=re.sub(r'\s+', '', txt)
            print ' '.join(['Found:',str_txt,'Expected:',params['expected']])
            assert str_txt == params['expected']

    def click_menu_item (self, params ):
        self.hover_over({ 'menu': params['menu']})
        if 'fltr' in params and params['fltr']:
            self.hover_over({ 'menu': params['fltr']})
        time.sleep(2)
        print "Clicking over = " + params['xpath']
        self.driver.find_element_by_xpath(params['xpath']).click()
        time.sleep(2)
        self._check_js_result( params )

    def close_last_tab(self):
        if (len(self.driver.window_handles) == 2):
           self.driver.switch_to.window(window_name=self.driver.window_handles[0])
           self.driver.close()
           self.driver.switch_to.window(window_name=self.driver.window_handles[0])

    def find_tab (self, tab_title ):
        result=False
        for handle in self.driver.window_handles:
            self.driver.switch_to_window(handle)
            if re.search(tab_title,self.driver.title, re.IGNORECASE):
                result=True
                break
        assert result == True

    def hover_over (self, params ):
        if self.driver.desired_capabilities['browserName'] in ['safari', 'internet explorer']:
            print "Javascript Hovering over = " + params['menu']
            self.js_hover_over (params )
        else:
            print "Std Hovering over = " + params['menu']
            self.std_hover_over (params )

    def js_hover_over (self, params ):
        js_script = ''.join(["var elem = document.getElementById('",
            params['menu'],
            "');",
            "if( document.createEvent) {",
            "var evObj = document.createEvent('MouseEvents');",
            "evObj.initEvent( 'mouseover', true, false );",
            "elem.dispatchEvent(evObj);",
            "} else if( document.createEventObject ) {",
            "elem.fireEvent('onmouseover');",
            "}"])
        self.driver.execute_script(js_script)

    def std_hover_over (self, params ):
        elem =self.driver.find_element_by_id(params['menu'])
        hover = ActionChains(self.driver).move_to_element(elem)
        hover.perform()
        if 'filt_rslts' in params and params['filt_rslts']:
            txt=self.driver.find_element_by_xpath(params['filt_rslts']).text
            str_txt=re.sub(r'\s+', '', txt)
            assert str_txt == params['expected']

    def _check_js_result (self, params):
        if 'js_result' in params and params['js_result']:
            js_result_txt = self.driver.find_element_by_id(params['js_result']).text
            print ' '.join(["Expected result = ",params['expected'],\
                " Actual = ",js_result_txt])
            assert params['expected'] == js_result_txt
        elif 'alert' in params and params['alert']:
            alert_text = Alert(self.driver).text
            assert params['alerttext'] == alert_text
            print ' '.join(["Expected alert = ",params['alerttext'],\
                " Actual = ",alert_text])
            alert =self.driver.switch_to_alert()
            alert.dismiss()

