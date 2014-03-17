#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
#
#  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
# License MIT

import httplib
from BeautifulSoup import BeautifulSoup
import json
import time
import os, sys

print "DEBUT: "
#if len(sys.argv) > 4:
#    print sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
#    city = sys.argv[1]
#    day = sys.argv[2]
#    month = sys.argv[3]
#    year = sys.argv[4]
    
def __unicode__(self):
   return unicode(self.title) or u''

site = "www.tag.fr"

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection(site)  # never http:// and not  end /
conn.request("GET", "/TPL_CODE/TPL_RECHERCHEHORAIRES/rec_arr/GRENOBLE%2BFLANDRIN-VALMY/179-recherche-d-horaires.htm#tpl_calculItineraireRecHorairesHome")  # launch a Get request
response = conn.getresponse()		            # store the answer
print response.status, response.reason              # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)			    # string to a tree structure 

alltag = tree.findAll("tbody")
#alltag += tree.findAll("li", attrs = {'class':'one-trip clearfix one-trip-even'})

for trip in alltrip:
    title = str(trip)
    title = title.replace('href="', 'href="http://'+ site +'/')
    title = title.replace('src="', 'src="http://'+site)
    print title