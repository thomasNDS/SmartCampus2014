SmartCampus2014
===============

SmartCampus2014 project.

SmartCampus is an end-of-studies project at [Polytech’Grenoble](http://www.polytech-grenoble.fr/), led by five [network and communication multimedia (RICM)](http://www.polytech-grenoble.fr/ricm.html) students. The aim of this project is to create an augmented reality (AR) and crowdsourcing application. 

In fine, this application will allow the user to access multiple types of information:
* crowdsourcing information, such as the length of waiting lines;
* general information about buildings and various campus components;
* variable information like transport timetables and cafeteria menus;
* sensor data, such as atmospheric and meteorological sensors.

Each building will be managed by an admin who can handle the information published. He can also activate or desactivate sensors using the dedicated interface.

Our [wiki page (FR)](http://air.imag.fr/index.php/SmartCampus2014)

Project
========

The project contains:
* [A Server MQTT with Mongo DB](ServeurMqtt)
* [A HTML5 client application](ServeurMqtt/views/client)
* [An super administrator application](super_admin_app)
* [An administrator of a building application](ServeurMqtt/views/admin/admin)
* [Differents bots](Bots/) parser to access diferents API on internet (Opendata)
* OpenHab integration, [See configuration file](openhabConfigurationFile) 
* [Arduino Sketch and mqtt python client](Arduino) to communicate with the smartCampus server

You can also see our presentation (PDF in french) or [diagram and documents](documents).

Technologies
=============

* [MQTT](http://mqtt.org/)
* [Node.js](http://nodejs.org/)
* [Mosquitto](http://mosquitto.org/)
* [OpenHab](https://github.com/openhab)
* [Arduino Galileo](http://arduino.cc/en/ArduinoCertified/IntelGalileo)

Licensing
===========

MIT

[See term of licence](LICENSE)
