Addons modules
================

botCrous.py : parsing bot of crous restaurants menus 

Install
------------

    pip install paho-mqtt

Technologies
---------------------

- Python 
- httplib: for http requests
- BeautifulSoup: To parse HTML and XML
- Paho: MQTT client to communicate with server

Launch
--------------

In a first terminal, launch the broker:
    mosquitto

In a second terminal, launch the bot:
    python botCrous.py

Examples
-----------------------

Some example of parsing documents with bot or simple mqtt client are available in example/

Licencing
---------------------

 MIT licence
