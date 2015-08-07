#!/bin/bash

function runTest {
    TS=`date +%T`
    echo runTest "$@" 
	export TST_LOCATION=$1
	export TST_BROWSER=$2
	export TST_PLATFORM=$3
	export TST_NAME="${4}_${TS}"
    export TST_VERSION=$5
	nosetests --stop -v $6
    if [[ $? -ne 0 ]]; then
        echo "nosetest failed (runTest $@)"
        exit 1
    fi
}
function runLocal {
	export TST_LOCATION=local
	export TST_BROWSER=chrome
	export TST_PLATFORM=linux
	nosetests --stop -v 
	export TST_BROWSER=firefox
	nosetests --stop -v
}

function runSauce {
    runTest sauce safari "OS X 10.10" "Safari test" 
    runTest sauce "internet explorer" "Windows 8" "IE test" 
    runTest sauce firefox Linux "Firefox on linux"
    runTest sauce chrome Linux "Chrome on linux"
}

#--- runSauce ---#
runLocal
#--- runTest sauce chrome Linux "Chrome on linux" ---#
#--- runTest sauce "internet explorer" "Windows 8.1" "IE test" "11.0" test/test_Menus.py:testMO.test07_google ---#
