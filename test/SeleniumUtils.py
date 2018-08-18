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


USERNAME=os.getenv("SAUCE_USERNAME")
SECRET_KEY=os.getenv("SAUCE_ACCESS_KEY")
LOCAL_IP="localhost"

class SetupByLocation(object):

    def setUp (self):
        self.TST_LOCATION = os.getenv("TST_LOCATION")
        if self.TST_LOCATION == 'local':
            self.SLEEP=False
        else:
            self.SLEEP=True
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
            self.IP="localhost"
            if re.search(r'chrome', self.TST_BROWSER, re.I):
                self.driver = webdriver.Chrome()
            elif re.search(r'firefox', self.TST_BROWSER, re.I):
                #--- firefox_capabilities = DesiredCapabilities.FIREFOX ---#
                #--- firefox_capabilities['marionette'] = True ---#
                #--- firefox_capabilities['binary'] = '/usr/local/bin/wires' ---#
                #--- self.driver = webdriver.Firefox(capabilities=firefox_capabilities) ---#
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
        TST_VERSION=os.getenv("TST_VERSION,") or "latest"
        TST_DEVICE=os.getenv("TST_DEVICE") or ""
        TST_DEVICE_ORIENT=os.getenv("TST_DEVICE_ORIENT") or ""
        sauce_url = ''.join(["http://", USERNAME,":",SECRET_KEY,"@",SE_HUB])
        desired_capabilities = {
            'platform': TST_PLATFORM,
            'browserName': self.TST_BROWSER,
            "public": "public",
            "passed": "true",
            "build": TST_BUILD,
            #--- 'version': 'latest', ---#
            'version': TST_VERSION,
            'deviceName': TST_DEVICE,
            'deviceOrientation': TST_DEVICE_ORIENT,
            'name': TST_NAME,
            #--- 'autoAcceptAlerts': "true", ---#
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
        self.driver.maximize_window()
        self.driver.execute_script("$('.ui-menuoptions').menuoptions()")
        WebDriverWait(self.driver, 30).until(
              EC.presence_of_element_located((By.ID,'page_loaded')))
        assert re.search(params['title'], self.driver.title, re.I)

    def is_element_present(self, params):
        WebDriverWait(self.driver, 30).until(
              EC.presence_of_element_located((By.XPATH,params['xpath'])))
        try: self.driver.find_element_by_xpath(params['xpath'])
        except NoSuchElementException, e: assert False
        print ' '.join(['Found element ', params['xpath']])
        assert True

    def check_not_class (self, params ):
        klass = params['elem'].get_attribute("class")
        for nKlass in params['notKlass']:
            print ' '.join(["Not class =",nKlass," class = ",klass])
            assert re.search(r'%s' % nKlass, klass) is None

    def check_html (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        elem = self.click_item ( params )
        if 'cell' in params and params['cell']:
            elem2=self.driver.find_element_by_xpath(params['cell'])
            found=re.sub(r'\s+', '', elem2.get_attribute('innerHTML'))
        else:
            found=re.sub(r'\s+', '', elem.get_attribute('class'))
        params['expected']=re.sub(r'\s+', '', params['expected'].decode('utf-8'))
        if 'partial' in params and params['partial'] == True:
            print ' '.join(['Partial check', 'Found:   ',found.encode('utf-8'),
                '\nExpected:',params['expected'].encode('utf-8')])
            assert re.search(params['expected'], found)
        else:
            print ' '.join(['Found:   ',found.encode('utf-8'),'\nExpected:',params['expected'].encode('utf-8')])
            assert params['expected'] == found

    def check_help_position (self, params ):
        if 'position' in params and params['position'] in ['top', 'bottom', 'right']:
            input_id = re.match(r'^(.*)"([^"]+)"(.*)$', params['xpath']).groups()[1]
            input_ht = self.driver.execute_script("return $('input#"+input_id+"').offset().top;")
            help_id = re.match(r'^(.*)"([^"]+)"(.*)$', params['help_id']).groups()[1]
            help_top = self.driver.execute_script("return $('span#"+help_id+"').show().offset().top;")
            if params['position'] == 'top':
                assert input_ht > help_top
            elif params['position'] == 'bottom':
                assert input_ht < help_top
            elif params['position'] == 'right':
                input_left = self.driver.execute_script("return $('input#"+input_id+"').offset().left;")
                input_width =  self.driver.execute_script("return $('input#"+input_id+"').width();")
                help_rt = self.driver.execute_script("return $('span#"+help_id+"').show().offset().left;")
                assert help_rt > input_left + input_width

    def check_user_input (self, params ):
        # requires defined: sendkeys, newKey and newVal params 
        elem = self.driver.find_element_by_xpath(params['xpath'])
        self.driver.find_element_by_xpath(params['clearbtn']).click()
        elem.send_keys(params['sendkeys'])
        elem.send_keys(Keys.ENTER)
        if self.SLEEP: time.sleep(1)
        newVal = self.driver.execute_script("return $('input#"+params['newVal']+"').val();")
        newKey = self.driver.execute_script("return $('input#"+params['newKey']+"').val();")
        assert newKey == str(-1) and params['sendkeys'] == newVal

    def check_help_msg (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        elem =  self.driver.find_element_by_xpath(params['xpath'])
        if 'sendkeys' in params:
            elem.send_keys(params['sendkeys'])
        elif 'keys' in params:
            input_id = re.match(r'^(.*)"([^"]+)"(.*)$', params['xpath']).groups()[1]
            self.driver.execute_script("$('input#"+input_id+"').val('"+params['keys']+"');")
            self.driver.execute_script("$('input#"+input_id+"').trigger('input')")
        if 'click' in params:
            elem.click()
        if self.SLEEP: time.sleep(1)
        if 'back_spc' in params and params['back_spc'] == True:
            elem.send_keys(Keys.BACKSPACE)
        elem2=self.driver.find_element_by_xpath(params['help_id'])
        if 'help_txt' in params:
            assert params['help_txt'] == elem2.text
        assert params['rslt'] == elem.get_attribute("value")
        if 'help_cls' in params and len(params['help_cls']) > 0:
            assert re.search(r'%s' % params['help_cls'], elem2.get_attribute("class"))
        if 'klass' in params and len(params['klass']) > 0:
            assert re.search(r'%s' % params['klass'], elem.get_attribute("class"))
        if 'notKlass' in params and len(params['notKlass']) > 0:
            params['elem']=elem
            self.check_not_class (params)
        self.check_help_position(params)

    def check_regexp_validation (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        if 'clearbtn' in params and len(params['clearbtn']) > 0:
            print ' '.join(['clearbtn:',params['clearbtn'],'input:',params['xpath']])
            self.driver.find_element_by_xpath(params['clearbtn']).click()
            print ' '.join(['clicked clearbtn',params['clearbtn']])
        elem = self.click_item ( params )
        print ' '.join(['clicked input',params['xpath']])
        if 'fill_str' in params and len(params['fill_str']) > 0:
            elem.send_keys(params['fill_str'])
        if 'TABout' in params and params['TABout'] == True:
            elem.send_keys(Keys.TAB) # needed when followed by check_ENTER_exit
        if 'back_spc' in params and params['back_spc'] == True:
            elem.send_keys(Keys.BACKSPACE)
        value, klass = (elem.get_attribute("value"), elem.get_attribute("class"))
        assert value == params['rslt'] and re.search(r'%s' % params['klass'], klass)


    def check_TAB_exit (self, params ):
        params['elem'] = self.click_item ( params )
        if 'test_key' in params and len(params['test_key']) > 0:
            params['elem'].send_keys(params['test_key'])
            params['elem'].send_keys(Keys.TAB)
            params['elem'] = self.click_item ( params )
            value, klass = (params['elem'].get_attribute("value"), params['elem'].get_attribute("class"))
            assert value == params['rslt'] and re.search(r'%s' % params['klass'], klass)
        elif 'notKlass' in params and len(params['notKlass']) > 0:
            params['elem'].send_keys(Keys.TAB)
            self.check_not_class (params)
            value = params['elem'].get_attribute("value")
            assert value == params['rslt']

    def check_ENTER_exit (self, params ):
        print ' '.join(['input:',params['xpath']])
        elem = self.click_item ( params )
        print ' '.join(['clicked input',params['xpath']])
        elem.send_keys(Keys.ENTER)
        value, klass = (elem.get_attribute("value"), elem.get_attribute("class"))
        assert value == params['rslt'] and re.search(r'%s' % params['klass'], klass)

    def check_invalid_key (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        orig_text=elem.get_attribute('value')
        elem.send_keys(params['inv_key'])
        new_text=elem.get_attribute('value')
        print ' '.join(['New:',new_text,'Orig:',orig_text, 'Invalid key:',params['inv_key']])
        assert orig_text == new_text

    def check_scrolling (self, params ):
        elem = self.click_item ( params )
        elem.send_keys(params['keypress']*params['repeat'])
        elem=self.driver.find_element_by_xpath('//*[@id="SP_menuoptions1"]/table/tbody/tr['+str(params['repeat'])+']')
        rowtop=elem.location['y']
        rowheight=elem.size['height']
        elem=self.driver.find_element_by_xpath('//*[@id="SP_menuoptions1"]')
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
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        elem=self.driver.find_element_by_xpath(params['xpath'])
        input_text=elem.get_attribute('value')
        print ' '.join(["Expected text in xpath:",params['xpath'],"=",input_text,
            'Actual text:',params['inputtext']])
        assert params['inputtext'] == input_text

    def check_clr (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        self.driver.find_element_by_xpath(params['xpath']).click()
        elem=self.driver.find_element_by_xpath(params['input'])
        input_text=elem.text
        print "Clicked clear, input value = " + input_text
        assert input_text == ''

    def set_win_size (self, params ):
        print ' '.join([ 'self.driver.set_window_size(',str(params['width']),',',str(params['height']) ])
        self.driver.set_window_size(params['width'], params['height'])
        if 'sleep' in params and params['sleep'] > 0:
            print ' '.join(["sleeping for",str(params['sleep']),"seconds"])
            if self.SLEEP: time.sleep(params['sleep'])

    def reset_rocker (self, params):
        js_script = "$('input#"+params['id']+"').menuoptions('set_select_value', { 'val': '' });"
        self.driver.execute_script(js_script)

    def check_rocker (self, params ):
        self.driver.maximize_window();
        elem=self.driver.find_element_by_xpath(params['xpath'])
        if 'click' in params and params['click'] == True:
            elem.click()
        classnm=elem.get_attribute('class')
        rkr_txt=self.driver.find_element_by_xpath(params['xpath_txt']).text
        print "Rocker elem = " + str(rkr_txt) + " classnm = " + classnm
        assert params['classnm'] == classnm

    def check_serialize (self, params ):
        self.driver.find_element_by_xpath(params['xpath']).click()
        if self.SLEEP: time.sleep(2)
        self._check_js_result( params )

    def check_menu_opt_key (self, params ):
        elem=self.driver.find_element_by_xpath(params['xpath'])
        menu_opt_key=elem.get_attribute('menu_opt_key')
        print ' '.join(['Checking expected menu_opt_key ',params['menu_opt'],'Actual:',menu_opt_key])
        assert menu_opt_key == params['menu_opt']

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

    def click_item (self, params ):
        print "Clicking over = " + params['xpath']
        WebDriverWait(self.driver, 30).until(
              EC.presence_of_element_located((By.XPATH,params['xpath'])))
        elem =  self.driver.find_element_by_xpath(params['xpath'])
        elem.click()
        return elem

    def disable_logic (self, params ):
        result=False
        self.driver.execute_script("$('#"+params['id']+".ui-menuoptions').menuoptions({'Disabled':true})")
        if params['type'] == "dropdown":
            self.hover_over({ 'menu': params['id']})
            try:
                self.driver.find_element_by_xpath(params['xpath'])
            except NoSuchElementException, e:
                print ' '.join(['Not found:',params['id'],' Disable succeeded'])
                result=True
            else:
                print ' '.join(['Found:',params['id'],' Disable failed'])
        else:
            disabled = self.driver.execute_script("return $('#"+params['id']+".ui-menuoptions').attr('disabled');")
            if disabled == "disabled":
                print ' '.join(['Found:',params['id'],' Disable succeeded'])
                result=True
            else:
                print ' '.join(['Found:',params['id'],' Disable failed'])
        assert result

    def click_menu_item (self, params ):
        self.hover_over({ 'menu': params['menu']})
        if 'fltr' in params and params['fltr']:
            self.hover_over({ 'menu': params['fltr']})
        WebDriverWait(self.driver, 30).until(
              EC.visibility_of_element_located((By.XPATH,params['xpath'])))
        self.click_item ( params )
        if self.SLEEP: time.sleep(params['sleep'])
        self._check_js_result( params )

    def close_last_tab(self):
        if (len(self.driver.window_handles) == 2):
           self.driver.switch_to.window(window_name=self.driver.window_handles[0])
           self.driver.close()
           self.driver.switch_to.window(window_name=self.driver.window_handles[0])

    def find_tab (self, tab_title ):
        #--- import ipdb; ipdb.def_colors='NoColor'; ipdb.set_trace() # BREAKPOINT ---#
        result=False
        time.sleep(1)
        for handle in self.driver.window_handles:
            self.driver.switch_to_window(handle)
            if bool(re.search(tab_title,self.driver.title, re.IGNORECASE)) == True:
                result=True
                break
        assert result == True

    def hover_over (self, params ):
        #--- if self.driver.desired_capabilities['browserName'] in ['safari', 'internet explorer']: ---#
        #--- if not re.search(r'internet explorer', self.TST_BROWSER, re.I): ---#
            #--- print "Javascript Hovering over = " + params['menu'] ---#
        self.js_hover_over (params )
        #--- else: ---#
            #--- print "Std Hovering over = " + params['menu'] ---#
            #--- self.std_hover_over (params ) ---#

    def check_bs_menu_offset (self, params ):
        WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR,'table.CrEaTeDtAbLeStYlE')))
        print "Offset = " + str(params['menu_offset'])
        main_ofs = self.driver.execute_script("return $('span[id^=\"SP_menuoptions\"]').offset()")
        print "main offset = " + str(main_ofs['left'])
        nav_ofs = self.driver.execute_script("return $('nav.navbar').offset()")
        print "nav offset = " + str(nav_ofs['left'])
        assert main_ofs['left'] - nav_ofs['left'] == int(params['menu_offset'])

    def js_chk_autocfg_text (self, params ):
        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
        js_script = ''.join(["$('#", params['id'],"').val('",params['text'],"');",
            "$('#",params['id'],"').menuoptions();",
            "return $('#",params['id'],"').attr('menu_opt_key');"
            ])
        data = self.driver.execute_script(js_script)
        str_data=re.sub(r'\s+', '', str(data))
        str_exp=re.sub(r'\s+', '', params['expected'])
        print ' '.join(["Expected result = ",str_exp, " Actual = ",str_data])
        assert str_data == str_exp

    def js_chk_autocfg_code (self, params ):
        js_script = ''.join(["$('#", params['id'],"').val(",params['code'], ");",
            "$('#",params['id'],"').menuoptions();",
            "return $('#",params['id'],"').val();"
            ])
        data = self.driver.execute_script(js_script)
        str_data=re.sub(r'\s+', '', str(data))
        str_exp=re.sub(r'\s+', '', params['expected'])
        print ' '.join(["Expected result = ",str_exp, " Actual = ",str_data])
        assert str_data == str_exp

    def js_chk_data_struct (self, params ):
        js_script = ''.join(["return ",
            "$('#",
            params['id'],
            "').data()['mreMenuoptions'].ary_of_objs;"
            ])
        data = self.driver.execute_script(js_script)
        str_data=re.sub(r'\s+', '', str(data))
        str_exp=re.sub(r'\s+', '', params['expected'])
        print ' '.join(["Expected result = ",str_exp, " Actual = ",str_data])
        assert str_data == str_exp

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
            WebDriverWait(self.driver, 10).until(
                    EC.visibility_of_element_located((By.CSS_SELECTOR,'table.CrEaTeDtAbLeStYlE')))
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

