/* capteur de pression
Modifié par Laurène Guelorget le 26 Fev 2014 */

void setup() {
  // Start serial at 9600 baud
  Serial.begin(9600); 
}

void loop() {
  // Read the input on analog pin 0:
  int sensorValue = analogRead(A0);
   
  // Print out the value you read (which goes from 0 - 1023):
  Serial.println(sensorValue);
  
  // Wait 100 milliseconds
  delay(1000);
}

