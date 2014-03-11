/* capteur de température et d'humidité
Modifié par Laurène Guelorget le 26 Fev 2014 */

#include "DHT.h"
#define DHTPIN 2  //pin Data
#define DHTTYPE DHT22

//Déclaration et initialisation des variables
DHT dht(DHTPIN, DHTTYPE);

void setup() 
{
  Serial.begin(9600);
  dht.begin();
}

void loop() 
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT");
  } 
  else {
    Serial.print("Humidity: "); 
    Serial.print(h);
    Serial.print(" %\t");
    Serial.print("Temperature: "); 
    Serial.print(t);
    Serial.println(" *C");
  }
  delay(5000);
}
