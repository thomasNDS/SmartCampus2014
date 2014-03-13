#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
# pip install paho-mqtt
#
#  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
# License MIT

import httplib
from BeautifulSoup import BeautifulSoup
import json
import paho.mqtt.client as paho
import os
import time

def __unicode__(self):
   return unicode(self.title) or u''

broker = "localhost"
port = 1883

# Create a MQTT identifier for this process
mypid = os.getpid()
pub= "pubclient_"+str(mypid)
mqttc = paho.Client(pub, False) #nocleanstart

#connect to broker
mqttc.connect(broker, port, 60)

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection("podcast.grenet.fr") # never http:// and not  end /
conn.request("GET", "/fil/les-reportages-ujf.rss")	 # launch a Get request
response = conn.getresponse()		            # store the answer
print response.status, response.reason		  # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)			    # string to a tree structure 

print tree.channel.title.string
print  "============\n"
items = tree.findAll("item")
msg = ""
for item in items:
    if item.title.string and item.description.string:
        msg += (item.title.string)+ "--" + (item.description.string) + "@"
#        print msg

topic = "ujf_event"
mqttc.publish(topic, (msg).encode('utf-8'), 0, True)                              #qos=0, retain=y
    





