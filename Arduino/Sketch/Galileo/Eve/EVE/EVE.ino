/* Chenillard LEDs : ambiance à EVE
Modifié par Laurène Guelorget et Nicolas Husson le 26 Fev 2014 */

#include <Ethernet.h>
#include <SPI.h>

//Déclaration et initialisation des variables

//Variables pour les sockets
byte mac[] = { 0x98, 0x4F, 0xEE, 0x00, 0x2E, 0x3C };
IPAddress ip(127, 0, 0, 1);
EthernetServer server(8888);

boolean t = true;
int i = A2;

void setup() {
	pinMode(A0,OUTPUT);
	pinMode(A1,OUTPUT);
	pinMode(A2,OUTPUT);
	pinMode(A3,OUTPUT);
	pinMode(A4,OUTPUT);
	Serial.begin(9600); // Initialisation du port série
	server.begin();
}

void loop() {
	//Booléen pour lancer ce les leds et les speakers
	boolean launchSketch = true;
	//initialisation des sockets  
	EthernetClient client = server.available();
	Serial.println("Sketch launched");
	if (client) {
		  while(client.connected()){
			if (launchSketch){
				int j=0;
				digitalWrite(A4,HIGH);
				while(j<12){
					digitalWrite(i,HIGH);
					delay(100);
					digitalWrite(i,LOW);
					if(t == true) { 
						i = i - 1;
					}
					else { 
						i = i + 1;
					}
					if(i < A0) {
						i = A1;
						t = false;
					}
					if(i > A3) {
						i = A2;
						t = true;
					}
					j++;
					}
					if(client.available()){   // only send data back if data has been sent
					char inByte = client.read(); // read the incoming data
					if (inByte=='1'){ 
						launchSketch = true;
					}  
					if (inByte=='0'){
						digitalWrite(A4,LOW);
						launchSketch = false;
					} 
				}
			}
			if(client.available()){   // only send data back if data has been sent
				char inByte = client.read(); // read the incoming data
				if (inByte=='1'){ 
					launchSketch = true;
				}  
				if (inByte=='0'){
					digitalWrite(A4,LOW);
					launchSketch = false;
				} 
			}
		}
	} 
}