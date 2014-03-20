import sys
import mosquitto
import pexpect
import socket
import struct

#For mqqt
broker="localhost" 
port=1883
sensor="tempdetector"
topic="temperature"

#For the socket
HOST = 'localhost'    # The remote host
PORT = 8888              # The same port as used by the serve"



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

                                                                                                                                                                           
