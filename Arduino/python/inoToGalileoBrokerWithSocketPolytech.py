import sys
import mosquitto
import pexpect
import socket
import struct

# The goal of this file is to launch the arduino sketch inside the galileo board,
# open a socket between this script and the sketch in order to communicate. (The 
# socket server is inside the sketch )
# Moreover, the sketch send data to this script which send it back to a local broker
# mosquitto on the board.
# Author : Smartcampus.



#For mqtt
broker="localhost" 
port=1883
nameMosquitto="Polytech"
topic1="humidite"
topic2="temperature"
HOST = ''  # = localhost
PORT = 8888 

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
while True:
	#receive "humid"	
	data = s.recv(32)
	str = data.split(' ')
	print data
	mqttc.publish(topic1,str[2])
	#receive "temp"	
	data = s.recv(32)
	str = data.split(' ')
	print data
	mqttc.publish(topic2,str[2])



                                                                                                                                                                           
