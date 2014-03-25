import sys, mosquitto, pexpect


broker="localhost"
port = 1883
nameMosquitto = "humidityCaptor"
topic="sensor"
idSensor = "532af11c0d5e642428cef917"


mqttc = mosquitto.Mosquitto(nameMosquitto)

#connect to broker
mqttc.connect(broker, port, 60)
#launch the sketch
p = pexpect.spawn("sh",["/etc/init.d/clloader.sh"],timeout=None,logfile=None)
line = p.readline()
while line:
    #When it receives a message
    line = p.readline()
    print line
    str = line.split(" ")
    str = str[1].split("\r\n");
    #publish the message on the locat broker of the mosquitto
    mqttc.publish(topic , idSensor+"@"+str[0])

