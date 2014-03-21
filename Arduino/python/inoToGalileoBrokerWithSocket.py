import sys
import mosquitto
import pexpect
import socket
import struct
import threading

#For mqtt
broker="localhost" 
port=1883
sensor="tempdetector"
topic="temperature"



a = threading.Thread(None, sendValueToGalileoBroker, None, (200,), {'nom':'thread a'}) 
b = threading.Thread(None, affiche, None, (200,), {'nom':'thread b'}) 
a.start() 
b.start()

#Thread number one which is suppose to send to the broker the value of the ino sketch
def sendValueToGalileoBroker(nb, nom=''):


	tempbool = False;
	mqttc = mosquitto.Mosquitto(sensor)
	#connect to broker
	mqttc.connect(broker,port,60)
	p = pexpect.spawn("sh",["/etc/init.d/clloader.sh"],timeout=None,logfile=None)
	line = p.readline()
	#line = p.readline()
	#show that the sh has been launched
	print "sh has been launched "+line
	while line:	
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		s.connect((HOST, PORT))
		while True:
			#receive "Temp"	
			data = s.recv(128)
			str = data.split(' ')
			print str[2]
			mqttc.publish(topic,str[2])
			if tempbool :
				print "allume LED"
				s.send('H')
				tempbool=False
			else : 
				print "extinction LED"
				s.send('L')
				tempbool=True


#Thread number two which is suppose watching the action from the openhab
def listenMessageFromCentralBroker(nb, nom=''):
	




                                                                                                                                                                           
