#!/usr/bin/python

import glob, os, sys, re
import fileinput
from shutil import copyfile

class addCodeBLock(object):

    def __init__ (self):
        self.fnames = []
        self.fnames = [f for f in os.listdir('.') if re.match(r'^.*_test\.html$', f)]
        for fname in self.fnames:
            sys.stderr.write("\n"+fname+"\n")

    def run_convert (self):
        [ self.process_files(fname) for fname in self.fnames ]

    def import_files (self, fname, out_file):
        with open(out_file, 'w') as out:
            with open(fname) as fr:
                for line in fr:
                    match = re.search(r'^ *<[^>]+#import (\b\S+\b)[^>]+> *$', line)
                    if match:
                        #--- import ipdb; ipdb.set_trace() # BREAKPOINT ---#
                            with open(match.group(1)) as import_file:
                                for imp_line in import_file:
                                    out.write(imp_line)
                    else:
                        out.write(line)

    def process_files (self, fname):
        out_file = '/tmp/import_file'+str(os.getpid())
        self.import_files(fname, out_file)
        filebfr=""
        with open(out_file) as fr:
            for line in fr:
                if '</body>' not in line and '</html>' not in line:
                    filebfr = ''.join([filebfr, line])
        os.unlink(out_file)
        out_file = re.sub(r'_test','',fname)
        with open(out_file, 'w') as fw:
            fw.write(self.add_hilite_code(filebfr))
            fw.write(self.add_js_code(filebfr))
            fw.write(self.add_html_code(filebfr))
            fw.write(self.add_includes_code(filebfr))

    def add_hilite_code (self, filebfr):
        return re.sub(r'(\/.*?  END_JAVASCRIPT  .*?\/)',
                ''.join(['/*--  END_JAVASCRIPT  --*/',  """
    $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
    });
    $( "#tabs" ).tabs();
                """ ]),
                filebfr, re.MULTILINE|re.X|re.S)

    def add_js_code (self, filebfr):
        m = re.search(r'(  START_JAVASCRIPT  .*?\/)(.*)(\/.*?  END_JAVASCRIPT  .*?\/)', filebfr, re.MULTILINE|re.X|re.S)
        if m == None:
            return ""
        else:
            m2 = re.sub(r'<','&lt;', m.group(2), re.MULTILINE|re.X|re.S)
            m = re.sub(r'>','&gt;', m2, re.MULTILINE|re.X|re.S)
            return ''.join(["""
    <br /><br /><br /><br />
    <div class="container visible-lg visible-md">
      <div class="row">
        <div class="col-lg-12">
            <h1>Code</h1>
            <div id="tabs">
                <ul>
                    <li><a href="#tabs-1">Javascript</a></li>
                    <li><a href="#tabs-2">HTML </a></li>
                    <li><a href="#tabs-3">includes </a></li>
                </ul>
            <div id="tabs-1">
            <pre><code class="javascript" style='text-align:left'>
                """ , m,
                """
            </code></pre>
        </div>
            """ ])

    def add_html_code (self, filebfr):
        m = re.search(r'(<[^>]+START_HTML[^>]+>)(.*)(<[^E]+END_HTML[^>]+>)', filebfr, re.MULTILINE|re.X|re.S)
        if m == None:
            return ""
        else:
            m2 = re.sub(r'<','&lt;', m.group(2), 10000, re.MULTILINE|re.X|re.S)
            m = re.sub(r'>','&gt;', m2, 10000, re.MULTILINE|re.X|re.S)
            return ''.join(["""
    <div id="tabs-2">
        <pre><code class="html" style='text-align:left'>
            """ , m ,
            """
        </code></pre>
    </div>
            """ ])

    def add_includes_code (self, filebfr):
        m = re.search(r'(  START_INCLUDES  .*?>)(.*)(<.*?  END_INCLUDES  .*?>)', filebfr, re.MULTILINE|re.X|re.S)
        if m == None:
            return ""
        else:
            m2 = re.sub(r'<','&lt;', m.group(2), re.MULTILINE|re.X|re.S)
            m = re.sub(r'>','&gt;', m2, re.MULTILINE|re.X|re.S)
            return ''.join(["""
    <div id="tabs-3">
        <pre><code class="html" style='text-align:left'>
            """ , m ,
            """
        </code></pre>
       </div>
      </div>
     </div>
    </div>
    </body>
    </html>
            """ ])

os.chdir("./examples")
acb = addCodeBLock()
acb.run_convert()

