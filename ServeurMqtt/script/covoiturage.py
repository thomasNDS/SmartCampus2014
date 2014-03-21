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

if len(sys.argv) > 4:
#    print sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
    city = sys.argv[1]
    day = sys.argv[2]
    month = sys.argv[3]
    year = sys.argv[4]
    
def __unicode__(self):
   return unicode(self.title) or u''

site = "www.covoiturage.fr"

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection(site)  # never http:// and not  end /
#conn.request("GET", "/recherche?fc=Grenoble&fi=14861&tc="+city+"&tci=3&d="+day+"%2F"+month+"%2F"+year+"&to=BOTH&p=1&n=20&t=tripsearch&a=searchtrip")  # launch a Get request
conn.request("GET", "/rechercher-resultats?fn=Grenoble&fcc=FR&tn="+city+"&tcc=FR&db="+day+"%2F"+month+"%2F"+year+"&sort=trip_date&order=asc&initial=1&limit=10&page=1")
response = conn.getresponse()		            # store the answer
#print response.status, response.reason              # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)			    # string to a tree structure 

#alltrip = tree.findAll("li", attrs = {'class':'one-trip clearfix one-trip-odd'})
#alltrip += tree.findAll("li", attrs = {'class':'one-trip clearfix one-trip-even'})

alltrip = tree.findAll("li", attrs = {'class':'trip'})

for trip in alltrip:
    link = str(trip.find("meta").get('content'))
    title = str(trip)
    title = title.replace('href="', 'href="http://'+ site )
    title = title.replace('src="', 'src="http://'+site)

    user = trip.find("div", attrs = {'class':'user-info'})
    description = trip.find("div", attrs = {'class':'description span5'})
    stopFrom = description.find("span", attrs = {'class':'from trip-roads-stop'})
    stops = description.findAll("span", attrs = {'class':'trip-roads-stop'})
    stopTo = description.find("span", attrs = {'class':'trip-background'})

    geofrom = description.find("dl", attrs = {'class':'geo-from'}).dd.string
    geoto   = description.find("dl", attrs = {'class':'geo-to'}).dd.string

    vehicle = description.find("dl", attrs = {'class':'car-type'}).dt
    
    rent = trip.find("div", attrs = {'itemprop':'location'})
    price = rent.strong
    unit = rent.find("span", attrs = {'class':'priceUnit'}).string
    avail = str(trip.find("div", attrs = {'class':'availability'}).strong) + " " + str(trip.find("div", attrs = {'class':'availability'}).span)
    
    result = "<div class=\"jumbotron container-fluid\">"
    result += "<div class=\"row\"><div class=\"col-sm-1 label label-primary\">Départ</div>"
    result += "<div class=\"col-sm-2\">" + str(geofrom) + "</div></div>"
    result += "<div class=\"row\"><div class=\"col-sm-1 label label-primary\">Arrivée</div>"
    result += "<div class=\"col-sm-2\">" + str(geoto) + "</div></div>"
    result += "<div class=\"row\"><div class=\"col-sm-1 label label-primary\">Véhicule</div>" 
    result += "<div class=\"col-sm-2\">" + str(vehicle) + "</div></div>"
    result += "<div class=\"row\"><div class=\"col-sm-1 label label-primary\">Prix</div>"
    result += "<div class=\"col-sm-2\">" + str(price) + " " + str(unit) + "</div></div>"
    result += "<div class=\"row\"><div class=\"col-sm-1 label label-primary\">Disponibilité</div>"
    result += "<div class=\"col-sm-2\">" + str(avail) + "</div></div>"
    result += "<div class=\"row\"><div class=\"col-sm-2\"><a href=\"" + str(link) + "\">Voir l'annonce</a></div></div></div>"
    
    result = result.replace("<strong>", "")
    result = result.replace("</strong>", "")
    result = result.replace("<dt>", "")
    result = result.replace("</dt>", "")
    
    print result
    
