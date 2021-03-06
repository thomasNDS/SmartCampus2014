  /* Capteur d'humidité dans le sol
Modifié par Laurène Guelorget le 28 Fev 2014 */

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin analog du capteur
int sensorValue = 0;  // valeur du capteur
int tmp;

//Variables pour les sockets
byte      mac[] = { 0x98, 0x4F, 0xEE, 0x00, 0x2E, 0x3C };
IPAddress ip(127, 0, 0, 1);
EthernetServer server(8888);

void setup() {
   Serial.begin(9600); // Initialisation du port série
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
        Serial.print("Humidite: ");
        if (sensorValue < 0){
          sensorValue = 0;
        }  
        if (sensorValue > 100){
          sensorValue = 100; 
        }
        Serial.print(sensorValue);
        Serial.println();
        delay(1000); 
      }
  }
  
}
