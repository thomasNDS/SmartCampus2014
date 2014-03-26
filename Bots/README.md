Addons modules
================

* botCrous.py : parsing  [Grenoble Crous](http://www.crous-grenoble.fr/) restaurants menus 
* botEventCrous.py : parsing [Grenoble Crous](http://www.crous-grenoble.fr/) events
* botEventUjf.py : parsing [University Joseph Fourrier](http://www.ujf-grenoble.fr/home-page-213171.htm?RH=UJF&RF=UJFEN)
* botTag.py : parsing [Grenoble Transport TAG](http://tag.fr)

Install
------------

    pip install paho-mqtt

Technologies
---------------------

- Python 
- httplib: for http requests
- BeautifulSoup: To parse HTML and XML
- Json : parsing json file
- Paho: MQTT client to communicate with server

Launch
--------------

In a first terminal, launch the broker:
    mosquitto

In a second terminal, launch the bot:
    python bot_of_your_choise.py

Examples
-----------------------

Some example of parsing documents with bot or simple mqtt client are available in example/

Licencing
---------------------

 [MIT licence](LICENSE)
