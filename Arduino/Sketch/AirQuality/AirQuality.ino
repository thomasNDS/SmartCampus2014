/* capteur de qualité d'air : GPL and méthane
Modifié par Laurène Guelorget le 26 Fev 2014 */

#define MQ_PIN 0 //entrée analog input
#define RL_VALUE 20 //resistance du capteur : 20 Kohms
#define RO_CLEAN_AIR_FACTOR 10 //info de la datasheet

#define GAS_LPG 0
#define GAS_CH4 1

//Déclaration et initialisation des variables
float LPGCurve[3] = {3,0,-0.4};
float CH4Curve[3] = {3.3,0,-0.38};
float Ro = 10; //Ro initialisé à 10 Kohms
 
void setup()
{
  Serial.begin(9600); //Initialisation du port série
  Serial.print("Calibrage en cours...\n");                
  Ro = MQCalibration(MQ_PIN); //Calibrage pendant 25 secondes
  Serial.print("Calibrage terminé\n"); 
  Serial.print("Ro = ");
  Serial.print(Ro);
  Serial.print("Kohm");
  Serial.print("\n");
}
 
void loop()
{
   Serial.print("GPL : "); 
   Serial.print(MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_LPG));
   Serial.print("ppm");
   Serial.print("        ");   
   Serial.print("Methane : "); 
   Serial.print(MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_CH4));
   Serial.print("ppm");
   Serial.print("\n");
   delay(200);
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
