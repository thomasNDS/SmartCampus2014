#! /usr/bin/python2.7
# -*-coding:Utf-8 -*

import httplib
from BeautifulSoup import BeautifulSoup
import json

serverAdress = "localhost:4242"
restaurants = ["barnave", "diderot"]
ids= []
#Access to our server and get ids of restaurants
comServer = httplib.HTTPConnection(serverAdress) 
for restaurant in restaurants:
    comServer.request("GET", "/api/entity?filter[name]=" + restaurant + "&limit=1")										# launch a Get request
    resultReq = comServer.getresponse()												
    print resultReq.status, resultReq.reason							# just print the debug, if success
    data = resultReq.read()																	# get a JSON answer
    resultJSON = json.loads(data)
    try:
        idRef = resultJSON['payload'][0]['_id']			# get the id of searched restaurant

        comServer.request("GET", "/api/entity/" + idRef + "/infos")										# launch a Get request
        infos = comServer.getresponse()						
		dataInfo = resultReq.read()		
        dataInfoJSON = json.loads(dataInfo)
        a = resultJSON['payload'][0]['_id']
        ids.append([idRef,])
    except IndexError:
        print " !!! Restaurant "+restaurant+"not created !!!"



conn = httplib.HTTPConnection("www.crous-grenoble.fr") # never http:// and not  end /
conn.request("GET", "/rss-menu-3.htm")										# launch a Get request
response = conn.getresponse()												# store the answer
print response.status, response.reason							# just print the debug, if success
data = response.read()																	# get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)															# string to a tree structure 

print tree.channel.title.string
print  "============\n"

items = tree.findAll("item")
for item in items:
    print item.title.string + "\n-----------\n" + item.description.string + "\n"



