/* Parking : capteur de pression et afficheur 7 segments
Modifié par Laurène Guelorget le 27 Fev 2014
DataIn : pin 12 | CLK : pin 11 | LOAD/CL : pin 10 */

#include <LedControl.h>

//Déclaration et initialisation des variables
#define C1 A0 // Pin analog du capteur 1
#define C2 A1 // Pin analog du capteur 2
#define C3 A2 // Pin analog du capteur 3
#define C4 A3 // Pin analog du capteur 4

LedControl lc=LedControl(12,11,10,1); //DataIn : pin 12, CLK : pin 11, LOAD/CL : pin 10
int i = 3; // nombre de places dans le parking
char t[] = "0000"; 
int j1 = 0; int j2 = 0; int j3 = 0;

void setup() {
  lc.shutdown(0,false);
  lc.setIntensity(0,8);
  lc.clearDisplay(0);
  Serial.begin(9600); // Initialisation du port série 
}

void loop() {
  int sensorValue1 = analogRead(C1);
  int sensorValue2 = analogRead(C2);
  int sensorValue3 = analogRead(C3);
  //int sensorValue4 = analogRead(C4);
  
  if (sensorValue1 > 5) {
    if (j1 < 1) {
      j1 = 1;
      i--;
      Serial.println("i1");
      Serial.println(i);
      Serial.println();
    }
  }
  else {
    if (j1 > 0) {
      j1 = 0;
      i++;
    }
  }
  
  if (sensorValue2 > 5) {
    if (j2 < 1) {
      j2 = 1;
      i--;
      Serial.println("i2");
      Serial.println(i);
      Serial.println();
    }
  }
  else {
    if (j2 > 0) {
      j2 = 0;
      i++;
    }
  }
  
  if (sensorValue3 > 5) {
    if (j3 < 1) {
      j3 = 1;
      i--;
      Serial.println("i3");
      Serial.println(i);
      Serial.println();
    }
  }
  else {
    if (j3 > 0) {
      j3 = 0;
      i++;
    }
  }
  
  Serial.println(sensorValue1);
  Serial.println();
  Serial.println(sensorValue2);
  Serial.println();
  Serial.println(sensorValue3);
  Serial.println();  
  
  Serial.println(i);
  Serial.println();
  Serial.println();
  
  lc.setDigit(0,0,i,false);
  
  // Wait 0,5 sec
  delay(500);
}

