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
#if 1:
    decoded = json.loads(data)
    ids = [3,4,5,6]


    for id in ids:
        globalmess = []
        name=decoded["destinations"][0]["arrets"][id]["nom"]
        hours= decoded["destinations"][0]["arrets"][id]["heures"]
        topic = "hours_" + name
        topic = topic.replace(" ","_")
        topic = topic.replace("'","_")
        tabHours = []
        for hour in hours:
            (h,m)= hour.split(':')
            tabHours.append(int(h)*60+int(m))
            
        globalmess.append(sorted(tabHours))
        
        hours= decoded["destinations"][1]["arrets"][id]["heures"]
        tabHours = []
        for hour in hours:
            (h,m)= hour.split(':')
            tabHours.append(int(h)*60+int(m))
            
        globalmess.append(sorted(tabHours))
#        print globalmess
        print len(globalmess), len(globalmess[0])
        print topic
        mqttc.publish(topic, str(globalmess), 0, True)                              #qos=0, retain=y

except (ValueError, KeyError, TypeError):
    print "JSON format error"

