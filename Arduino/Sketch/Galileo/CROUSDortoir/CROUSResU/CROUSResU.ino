  /* Capteur d'humidité dans le sol
Modifié par Nicolas Husson le 28 Fev 2014 */
#include <Ethernet.h>
#include <SPI.h>


#define MQ_PIN A5 //entrée analog input
#define RL_VALUE 20 //resistance du capteur : 20 Kohms
#define RO_CLEAN_AIR_FACTOR 10 //info de la datasheet

#define GAS_LPG 0
#define GAS_CH4 1

//Déclaration et initialisation des variables
float LPGCurve[3] = {3,0,-0.4};
float CH4Curve[3] = {3.3,0,-0.38};
float Ro = 10; //Ro initialisé à 10 Kohms

//Déclaration et initialisation des variables
int sensorPin = A0;    // Pin analog du capteur
int sensorValue = 0;  // valeur du capteur
int tmp;

//Variables pour les sockets
EthernetServer server(8888);

void setup() {
  Serial.begin(9600); // Initialisation du port série
  Ro = MQCalibration(MQ_PIN); //Calibrage pendant 25 secondes
  server.begin();
}

void loop() {
  EthernetClient client = server.available();
  Serial.println("Sketch launched");
  if (client) {
      while(client.connected()){
        sensorValue = analogRead(sensorPin);
        tmp = 335 - sensorValue;
        tmp = (tmp*100)/195;  
        sensorValue = tmp;
        if (sensorValue < 0){
          sensorValue = 0;
        }  
        if (sensorValue > 100){
          sensorValue = 100; 
        }
        char buf[32];
        strcpy(buf, "Humi : ");
        char tempBuf[16];
        sprintf(tempBuf, "%d", sensorValue);
        strcat(buf, tempBuf); 
        client.write(buf);
        
        //Methane sensor
        char buf1[32];
        char tempBuf1[16];
        strcpy(buf1, "Meth : ");
        sprintf(tempBuf1, "%d", MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_CH4));
        strcat(buf1, tempBuf1); 
        client.write(buf1);
        
        //GPL sensor
        char buf2[32];
        char tempBuf2[16];
        strcpy(buf2, "GPL : ");
        sprintf(tempBuf2, "%d", MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_LPG));
        strcat(buf2, tempBuf2); 
        client.write(buf2);
        delay(1000); 
      }
  }
  
}


float MQResistanceCalculation(int raw_adc)
{
  return (((float)RL_VALUE*(1023-raw_adc)/raw_adc));
}

float MQCalibration(int mq_pin) {
  int i;
  float val=0;
  for (i=0;i<50;i++) { //on prend 50 échantillons
    val += MQResistanceCalculation(analogRead(mq_pin));
    delay(500);
  }
  val = val/50; //calcul de la valeur moyenne
  val = val/RO_CLEAN_AIR_FACTOR;
  return val; 
}

float MQRead(int mq_pin) {
  int i;
  float rs=0;
  for (i=0;i<5;i++) {
    rs += MQResistanceCalculation(analogRead(mq_pin));
    delay(50);
  }
  rs = rs/5;
  return rs;  
}

int MQGetGasPercentage(float rs_ro_ratio, int gas_id) {
  if ( gas_id == GAS_LPG ) {
     return MQGetPercentage(rs_ro_ratio,LPGCurve);
  } else if ( gas_id == GAS_CH4 ) {
      return MQGetPercentage(rs_ro_ratio,CH4Curve);
  }    
  return 0;
}

int  MQGetPercentage(float rs_ro_ratio, float *pcurve) {
  return (pow(10, (((log(rs_ro_ratio)-pcurve[1])/pcurve[2]) + pcurve[0])));
}
