/* capteur de pression
Modifié par Laurène Guelorget le 26 Fev 2014 */

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin d'entrée du capteur

void setup() {
  Serial.begin(9600); // Initialisation du port série
}

void loop() {
  // Read the input on analog pin 0:
  int sensorValue = analogRead(sensorPin);
   
  // Print out the value you read (which goes from 0 - 1023):
  Serial.println(sensorValue);
  
  // Wait 100 milliseconds
  delay(1000);
}