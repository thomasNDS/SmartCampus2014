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
