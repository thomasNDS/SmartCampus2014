/* compteur avec bouton poussoir et affichage 7 segments
Modifié par Laurène Guelorget le 26 Fev 2014
DataIn : pin 12 | CLK : pin 11 | LOAD/CL : pin 10 */

#include <LedControl.h>

//Déclaration et initialisation des variables
LedControl lc=LedControl(12,11,10,1); //DataIn : pin 12, CLK : pin 11, LOAD/CL : pin 10
const int buttonPin = 2; // the number of the button pin
int buttonState = 0; // variable for reading the pushbutton status
const int ledPin =  13; // the number of the LED pin
int i = 0; int j = 0;
char t[] = "00000000"; 

void setup()
{
  lc.shutdown(0,false);
  lc.setIntensity(0,8);
  lc.clearDisplay(0);
  pinMode(ledPin,OUTPUT);
  pinMode(buttonPin, INPUT);
}

void loop()
{
  buttonState = digitalRead(buttonPin);           
  if (buttonState == HIGH) {
    if (j < 1) {
       j = 1;
       digitalWrite(ledPin,HIGH);
       i++;
       Serial.print(i);
       Serial.println();
       
	   //pour l'instant, valeurs jusqu'à 999
       if (i < 10) {
         lc.setDigit(0,0,i,false);
       } else if (i < 100) {
         sprintf(t,"%d",i);
         lc.setChar(0,1,t[0],false); 
         lc.setChar(0,0,t[1],false); 
       } else if (i < 1000) {
         sprintf(t,"%d",i);
         lc.setChar(0,2,t[0],false); 
         lc.setChar(0,1,t[1],false);
         lc.setChar(0,0,t[2],false);
       }
    }
  } else {
     digitalWrite(ledPin,LOW);
     j = 0;
  }
}

