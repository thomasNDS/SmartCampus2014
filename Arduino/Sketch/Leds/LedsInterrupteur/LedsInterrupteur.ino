/* Leds : chenillard avec 5 leds (pin 7 à 11) avec bouton poussoir
Modifié par Laurène Guelorget le 26 Fev 2014 */

//Déclaration et initialisation des variables
const int buttonPin = 2; //Pin Data du BP
int buttonState = 0; //Etat du BP
const int ledPin =  13; //Pin de la led
int i = 0;

void setup()
{
  pinMode(11,OUTPUT);
  pinMode(10,OUTPUT);
  pinMode(9,OUTPUT);
  pinMode(8,OUTPUT);
  pinMode(7,OUTPUT);
  pinMode(buttonPin, INPUT); 
}
void loop()
{
  buttonState = digitalRead(buttonPin);
  
    if (buttonState == HIGH) { 
      digitalWrite(i,HIGH);
      delay(100);
      digitalWrite(i,LOW);
      if(t == true) {
        i = i - 1;
      }
      else {
        i = i + 1;
      }
      if(i < 7) {
        i = 8;
        t = false;
      }
      if(i > 11) {
        i = 10;
        t = true;
      }
   }
}

