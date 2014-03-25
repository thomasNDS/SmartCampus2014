/* Capteur de température
Modifié par Laurène Guelorget le 28 Fev 2014 */
#include <Ethernet.h>
#include <SPI.h>
 

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin analog du capteur
int sensorValue = 0;  // valeur du capteur
int tmp;


byte      mac[] = { 0x98, 0x4F, 0xEE, 0x00, 0x2E, 0x3C };
IPAddress ip(127, 0, 0, 1);
EthernetServer server(8888);

// setup()
void setup() {
  pinMode(13, OUTPUT); 
  Serial.begin(9600); // Initialisation du port série
  server.begin();
}
 
// loop()
void loop() {
  // listen for incoming clients
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
        char inByte = ' ';
        char buf[32];
        strcpy(buf, "Temp : ");
        char tempBuf[16];
        sprintf(tempBuf, "%d", sensorValue);
        strcat(buf, tempBuf); 
        client.write(buf);   
          if(client.available()){   // only send data back if data has been sent
            
            char inByte = client.read(); // read the incoming data
            if (inByte=='H'){ 
              
              digitalWrite(13, HIGH);
            }  
            if (inByte=='L'){
              digitalWrite(13, LOW);
            } 
          }
        delay(5000);
      
    }
  }
  
}
