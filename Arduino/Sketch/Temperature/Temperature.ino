/* Capteur de température
Modifié par Laurène Guelorget le 28 Fev 2014 */

//Déclaration et initialisation des variables
float mesure=0; //Variable pour le stockage mesure retournée par le capteur
float temperature=0; //Variable pour le stockage de la température
int pinTemp = 7; //Pin analogique sur lequel la température est mesurée

// setup()
void setup() {
  Serial.begin(9600); // Initialisation du port série
}
 
// loop()
void loop() {
  mesure = analogRead(pinTemp);  //Lecture de la valeur fournie par le capteur de température
  temperature = mesure * 0.0625;    //Conversion en température (en degré Celsius)
           
  Serial.print("Temperature :");
  Serial.print(temperature); 
  Serial.println();
  delay(2000);
}
