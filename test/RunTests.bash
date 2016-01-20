#!/bin/bash 

function ScanForChanges {
   DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
   cd $DIR
   SLEEPSECS=0
   while [ 1 ]; do
        ((SLEEPSECS+=2))
        sleep 2
        if [[ `find . -name \*.py -mmin -1 | wc -l` -gt 0 ]]; then
            clear
            echo  "File changed, re running tests"
            nosetests
            SECCOUNT=0
            echo "Going to sleep for a minute before checking files again"
            while [[ $SECCOUNT -lt 30 ]]; do
               ((SECCOUNT+=2))
               sleep 2
               echo -ne "\e[0K\r $SECCOUNT"
            done
        fi
        echo -ne "\e[0K\r RunTests.bash asleep for $SLEEPSECS seconds"
   done
}

ScanForChanges

