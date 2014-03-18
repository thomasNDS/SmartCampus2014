#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
#
#  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
# License MIT

import httplib
#from BeautifulSoup import BeautifulSoup
import json
import time
import os, sys
from datetime import datetime
import paho.mqtt.client as paho
import time

print "DEBUT: "
#if len(sys.argv) > 4:
#    print sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
#    city = sys.argv[1]
#    day = sys.argv[2]
#    month = sys.argv[3]
#    year = sys.argv[4]
    
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

site = "www.stationmobile.fr"

#Access to our server and get ids of restaurants
conn = httplib.HTTPConnection(site)  # never http:// and not  end /20140319
conn.request("GET", "/stationmobilecore/XML/Horaires/Statique/"+time.strftime('20%y%m%d',time.localtime())+"_SEM_B.json?key=108")  # launch a Get request
response = conn.getresponse()		            # store the answer
print response.status, response.reason              # just print the debug, if success
data = response.read()			            # get the html as a string '<html >...</html>'
try:
    decoded = json.loads(data)
    ids = [3,4,5,6]
    sens = 0
    for id in ids:
        name=decoded["destinations"][sens]["arrets"][id]["nom"]
        hours= decoded["destinations"][sens]["arrets"][id]["heures"]
#        for hour in hours:
#            (h,m)=hour.split(':')
        
        topic = "hours_" + name
        topic = topic.replace(" ","_")
        topic = topic.replace("'","_")
        print topic
        mqttc.publish(topic, str(hours), 0, True)                              #qos=0, retain=y

except (ValueError, KeyError, TypeError):
    print "JSON format error"

