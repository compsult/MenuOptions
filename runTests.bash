#!/bin/bash

VERBOSE=''
#--- VERBOSE=' --nocapture ' ---#

function runTest {
    TS=`date +%T`
    echo runTest "$@" 
	export SAUCE_URL='localhost:4445/wd/hub'
	export TST_LOCATION=$1
	export TST_BROWSER=$2
	export TST_PLATFORM=$3
	export TST_NAME="${4}_${TS}"
    export TST_VERSION=$5
    export TST_BUILD=`grep version package.json | perl -ane '{ s/,|:|"|version| //g; print $_; }'`
    #--- export PYTHONPATH=.; nosetests "test_Menus.py:testMO.test09_mousefiltering" ---#
    # nosetests "test.test_Rocker:test_rocker.test02_rocker"
    # nosetests "test.test_SelectList:testSL.test03_autocomplete"
	nosetests --stop -v 
    if [[ $? -ne 0 ]]; then
        echo "nosetest failed (runTest $@)"
        exit 1
    fi
}


function runLocal {
    #--- grunt uglify:development cssmin:minify ---#
	export TST_LOCATION=local
	export TST_BROWSER=chrome
	export TST_PLATFORM=linux
    rm test/*.pyc
    cp test/data_structs.py test/test_DataInputs.py
	# nosetests --stop ${VERBOSE} -v test/test_SelectList.py:testSL.test08_tab_with_data
    # nosetests --stop ${VERBOSE} -v test/test_addons.py:test_addons.test03_down_arrow
    # nosetests "test.test_Rocker:test_rocker.test02_rocker"
    # nosetests "test.test_Masks:testMasks.test15_HHMM_AM_chk_hrs"
	# nosetests --stop ${VERBOSE} -v
	#--- export TST_BROWSER=firefox ---#
	# nosetests --stop ${VERBOSE} -v test/test_SelectList.py:testSL.test08_tab_with_data
	nosetests --stop ${VERBOSE} -v 
    mv -f test/test_DataInputs.py test/data_structs.py
}

function runSauce {
    if [[ -f test/test_DataInputs.py ]]; then
         mv -f test/test_DataInputs.py test/data_structs.py
    fi
    # runTest sauce "internet explorer" "Windows 10" "IE test" "11.285"
    runTest sauce chrome Linux "Chrome on linux" "48.0"
    runTest sauce safari "OS X 10.11" "Safari test" "10.0"
    runTest sauce firefox Linux "Firefox on linux" "43.0"
}

if [ $# -eq 0 ]; then
    runSauce
elif [[ "$1" =~ "local" ]]; then
    runLocal
    sleep 1
    if [[ -f test/test_DataInputs.py ]]; then
         mv -f test/test_DataInputs.py test/data_structs.py
    fi
    kill -TERM -$(pgrep -o runTests.bash)
elif [[ "$1" =~ "ls" ]]; then # local sauce testing
    runTest sauce "internet explorer" "Windows 10" "IE test" "11.285"
    runTest sauce chrome Linux "Chrome on linux" "48.0"
    runTest sauce safari "OS X 10.11" "Safari test" "10.0"
    runTest sauce firefox Linux "Firefox on linux" "43.0"
fi
#--- runTest sauce chrome Linux "Chrome on linux" ---#
#--- runTest sauce "internet explorer" "Windows 8.1" "IE test" "11.0" test/test_Menus.py:testMO.test09_mousefiltering ---#
#--- runTest sauce "safari" "OS X 10.10" "Safari test" test/test_Rocker:test_rocker.test02_rocker ---#
exit 
