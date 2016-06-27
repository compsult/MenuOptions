#!/usr/bin/python

import glob, os, sys, re
import fileinput

class combineFiles(object):

    def __init__ (self):
        if ( len(sys.argv) < 2 or not os.path.isfile(sys.argv[1])):
            sys.stderr.write("Usage:\n\t\t"+sys.argv[0]+" [file name]\n\n")
            sys.exit(1)

    def combine (self, inp_file, out_file):
        filebfr=""
        with open(out_file, 'w') as out:
            return self.process_files(inp_file, out)

    def process_files (self, inp_file, out_fh):
        more_includes = False
        with open(inp_file) as primary:
            for line in primary:
                match = re.search(r'^ *#import (\b\S+\b) *$', line)
                if match:
                    with open(match.group(1)) as import_file:
                        for imp_line in import_file:
                            match_inner = re.search(r'^ *#import (\b\S+\b) *$', imp_line)
                            if match_inner:
                                more_includes = True
                            out_fh.write(imp_line)
                else:
                   out_fh.write(line)
        return more_includes

os.chdir("./media/js")
acb = combineFiles()
more_incls = acb.combine(sys.argv[1], 'firstpass')
if more_incls:
    acb.combine('firstpass', 'secondpass')
    os.rename('secondpass',  "../../dist/js/"+str(sys.argv[1][1:]))
else:
    os.rename('firstpass',  "../../dist/js/"+str(sys.argv[1][1:]))
if os.path.isfile('firstpass'):
    os.unlink('firstpass')
if os.path.isfile('secondpass'):
    os.unlink('secondpass')
