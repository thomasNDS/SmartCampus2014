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
if len(sys.argv) > 4:
    print sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
    city = sys.argv[1]
    day = sys.argv[2]
    month = sys.argv[3]
    year = sys.argv[4]
    
def __unicode__(self):
   return unicode(self.title) or u''

site = "www.covoiturage.fr"

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection(site)  # never http:// and not  end /
conn.request("GET", "/recherche?fc=Grenoble&fi=14861&tc="+city+"&tci=3&d="+day+"%2F"+month+"%2F"+year+"&to=BOTH&p=1&n=20&t=tripsearch&a=searchtrip")  # launch a Get request
response = conn.getresponse()		            # store the answer
print response.status, response.reason              # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)			    # string to a tree structure 

alltrip = tree.findAll("li", attrs = {'class':'one-trip clearfix one-trip-odd'})
alltrip += tree.findAll("li", attrs = {'class':'one-trip clearfix one-trip-even'})

for trip in alltrip:
    title = str(trip)
    title = title.replace('href="', 'href="http://'+ site +'/')
    title = title.replace('src="', 'src="http://'+site)
    
    print title