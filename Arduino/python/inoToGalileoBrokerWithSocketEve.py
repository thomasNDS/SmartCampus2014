import sys
import mosquitto
import pexpect
import socket
import struct

# The goal of this file is to launch the arduino sketch inside the galileo board,
# open a socket between this script and the sketch in order to communicate. (The 
# socket server is inside the sketch )
# Moreover, this script subscribe to the topic "LED" and send ON ('1') or off ('0') 
# throught socket 
# Author : Smartcampus.


#For mqtt
broker="localhost" 
port=1883
nameMosquitto="Eve"
topic="LED"
HOST = '' # = localhost
PORT = 8888 


#On receipt of a message resend it to the broker of the serv
def on_message(mosq, obj, msg):
    print "message received "+msg.payload
    if msg.payload=="0":
        print "receive 0"
        s.send('0')
    elif msg.payload=="1":
        print "receive 1"
        s.send('1')

mqttc = mosquitto.Mosquitto(nameMosquitto)
#connect to broker
mqttc.connect(broker,port,60)
#launch the arduino sketch inside the galileo 
p = pexpect.spawn("sh",["/etc/init.d/clloader.sh"],timeout=None,logfile=None)
#waiting until the sketch send something in order to see when the socket server is ok
line = p.readline()
#show that the sh has been launched
print line
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
mqttc.subscribe(topic,0)
#define the callbacks
mqttc.on_message = on_message
#Number of millised mqttcGalileo is waiting
TimeMs = 1;
while True:
    mqttc.loop(TimeMs)



                                                                                                                                                                           
