#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
#
#  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
# License MIT

import httplib
import json
import time
import os, sys
from datetime import datetime

    
def __unicode__(self):
   return unicode(self.title) or u''

#http://smartselfservice.comeze.com/tousObjetsDisponibles.php
site = "smartselfservice.comeze.com"

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection(site)  # never http:// and not  end /
conn.request("GET", "/tousObjetsDisponibles.php")
response = conn.getresponse()		            # store the answer
#print response.status, response.reason              # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'

dataClean = (data.split('<!--'))[0]
dataClean= dataClean.replace("null", '""')
dataClean= dataClean.replace("\r", '')
dataClean= dataClean.replace("\n", '')
decoded = json.loads(dataClean)

#print "<div class='colElt strongCat'>Categorie</div><div class='colElt strongCat'>Objet</div>"
#print "<div class='colElt strongCat'>Propriétaire</div><div class='colElt strongCat'>Prix</div>"

for item in decoded:
    print "<div class='line-item'>"
    print "<div class='colElt '>"
    if item["categorie"]!= "":
        print "<span class='category'>",item["categorie"], "</span>"
    print "</div>", "<div class='colElt'>"
    if item["nom"]!= "":
        print "Objet : ", item["nom"]
    print " </div>"
    print "<div class='colElt'> Propriétaire :",item["prenomPropoprietaire"],item["nomProprietaire"], "</div>"
    print "<div class='colElt'>","Prix :<span class='price'>",item["prix"],"€", "</span></div>"
    print "</div>"
    print "\n</br>"
