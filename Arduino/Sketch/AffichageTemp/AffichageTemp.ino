/* capteur de température avec affichage 7 segments
Modifié par Laurène Guelorget le 26 Fev 2014
DataIn : pin 12 | CLK : pin 11 | LOAD/CL : pin 10 */

#include <LedControl.h>

//Déclaration et initialisation des variables
float mesure=0; //Variable pour le stockage mesure retournée par le capteur
float tension=0; //Variable pour le stockage de la tension 
float temperature=0; //Variable pour le stockage de la température
int pinTemp = 7; //Pin Data du capteur de température
LedControl lc=LedControl(12,11,10,1); //DataIn : pin 12, CLK : pin 11, LOAD/CL : pin 10
int i = 0; int tbis = 0; boolean minus = false;
char t[] = "0000"; 

void setup() {
  lc.shutdown(0,false);
  lc.setIntensity(0,8);
  lc.clearDisplay(0);
  Serial.begin(9600); // Initialisation du port série 
}

void loop() { 
  mesure = analogRead(pinTemp); //Lecture de la valeur fournie par le capteur de température
  temperature = mesure * 0.0625; //Conversion en température (en degré Celsius)

  Serial.print("Temperature :");
  Serial.print (temperature); 
  Serial.println();
  if(temperature<0) {
    minus = true;
  }
  tbis = temperature * 100;
  sprintf(t,"%d",tbis);

  if(minus == true) {
    lc.setChar(0,6,'-',false); 
  }

  lc.setChar(0,5,t[0],false); 
  lc.setChar(0,4,t[1],true); 
  lc.setChar(0,3,t[2],false); 
  lc.setChar(0,2,t[3],false); 
  lc.setChar(0,1,' ',false); 
  lc.setChar(0,0,'C',false);
  delay(5000);
}
