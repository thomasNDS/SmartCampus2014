/* Alarme led+speaker quand température au dessus d'un seuil
Modifié par Laurène Guelorget le 26 Fev 2014 */

#include "pitches.h"

//Déclaration et initialisation des variables
int melody[] = {NOTE_C4,NOTE_G3,NOTE_C4,NOTE_G3,NOTE_C4,NOTE_G3};
int noteDurations[] = {4,4,4,4,4,4}; 

float mesure=0; //Variable pour le stockage mesure retournée par le capteur
float temperature=0; //Variable pour le stockage de la température
int pinTemp = 7; //Pin analogique sur lequel la température est mesurée
const int ledPin =  13; //Pin de la led
  
// setup()
void setup() {
  pinMode(ledPin, OUTPUT);  
  Serial.begin(9600); // Initialisation du port série
}
 
// loop()
void loop() {
  mesure = analogRead(pinTemp);  //Lecture de la valeur fournie par le capteur de température
  temperature = mesure * 0.0625;    //Conversion en température (en degré Celsius)
           
  Serial.print("Temperature :");
  Serial.print (temperature); 
  Serial.println();
  delay(2000);
  if(temperature>25) {
    for (int thisNote = 0; thisNote < 8; thisNote++) {
      int noteDuration = 1000/noteDurations[thisNote];
      tone(8, melody[thisNote],noteDuration);
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);
      if(thisNote%2 == 0) { digitalWrite(ledPin, HIGH); }
      else { digitalWrite(ledPin, LOW); }
      noTone(8);
    }   
  }    
}
