/* Capteur d'humidité dans le sol
Modifié par Laurène Guelorget et Nicolas Husson le 28 Fev 2014 */
#include <Ethernet.h>
#include <SPI.h>

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin analog du capteur humidité
int pinTemp = A5;  // Pin pour la température
int sensorValue = 0;  // valeur du capteur
int tmp;
float mesure=0; //Variable pour le stockage mesure retournée par le capteur
float temperature=0; //Variable pour le stockage de la température

//Variables pour les sockets
EthernetServer server(8888);

void setup() {
  Serial.begin(9600); // Initialisation du port série
  server.begin();
}

void loop() {
  EthernetClient client = server.available();
  Serial.println("Sketch launched");
  if (client) {
      while(client.connected()){
        sensorValue = analogRead(sensorPin);
        
        
        tmp = 335 - sensorValue;
        tmp = (tmp*100)/195;  
        sensorValue = tmp;
        if (sensorValue < 0){
          sensorValue = 0;
        }  
        if (sensorValue > 100){
          sensorValue = 100; 
        }
        char buf[32];
        strcpy(buf, "Humi : ");
        char tempBuf[16];
        sprintf(tempBuf, "%d", sensorValue);
        strcat(buf, tempBuf); 
        client.write(buf);
        
        char buf2[32];
        mesure = analogRead(pinTemp);  //Lecture de la valeur fournie par le capteur de température
        temperature = (mesure*26.5)/450;
        strcpy(buf2, "Temp : ");
        char tempBuf2[16];
        sprintf(tempBuf2, "%f ", temperature);
        strcat(buf2, tempBuf2); 
        client.write(buf2);
        
        delay(1000); 
      }
  }
  
}
