/* Capteur d'humidité dans le sol
Modifié par Laurène Guelorget le 28 Fev 2014 */

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin analog du capteur
int sensorValue = 0;  // valeur du capteur
int tmp;

void setup() {
   Serial.begin(9600); // Initialisation du port série
}

void loop() {
  sensorValue = analogRead(sensorPin);
  tmp = 1023 - sensorValue;
  sensorValue = tmp;
  Serial.print("Humidite = "); 
  Serial.println(sensorValue);
  Serial.println();
  delay(1000); 
}
