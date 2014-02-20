#! /usr/bin/python2.7
# -*-coding:Utf-8 -*

# publish the data gathered by the moisture detector
# using MQTT
# Author: Didier Donsez
# 2013/08/20
# modified by Simon Planes on 2014/02/15
# run on sudo mode, the serial port is /dev/ttyACM0 on my computer, it may differs from yours


import serial
import os, time
import threading
import mosquitto

broker="localhost"
port = 1883

serialdev="/dev/ttyACM0"

sensor = "moisturedetector"
topic="moisture"

if __name__ == '__main__':

    try:
        print "Connecting... ", serialdev
        #connect to serial port
        ser = serial.Serial(serialdev, 9600, timeout=20)
    except:
        print "Failed to connect serial"
        #unable to continue with no serial input
        raise SystemExit("Failed to connect serial")


    try:       
        ser.flushInput()
        print "Connection sucess!!!"
        #create an mqtt client
        mypid = os.getpid()
        client_uniq = sensor+"-"+str(mypid)
        mqttc = mosquitto.Mosquitto(client_uniq)

        #connect to broker
        mqttc.connect(broker, port, 60)

        while mqttc.loop() == 0:
            c = ser.readline()
            print "send ", c.rstrip()
            mqttc.publish(topic, c.split("=")[1].strip())


    # handle list index error (i.e. assume no data received)
    except (IndexError):
        print "No data received within serial timeout period"
        ser.close()
        mqttc.disconnect()
    # handle app closure
    except (KeyboardInterrupt):
        print "Interrupt received"
        ser.close()
        mqttc.disconnect()
    except (RuntimeError):
        print "uh-oh! time to die"
        ser.close()
        mqttc.disconnect()
