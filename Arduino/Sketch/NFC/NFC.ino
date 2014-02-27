/* Shield Arduino : NFC
Modifié par Laurène Guelorget le 26 Fev 2014 */

#include <PN532.h>
#include <SPI.h>
#define PN532_CS 10

//Déclaration et initialisation des variables
PN532 nfc(PN532_CS);

void setup(void) {
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
  }
}
 
void loop(void) {
  uint32_t id;
  // look for MiFare type cards
  id = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A);
 
  if (id != 0) {
    Serial.println();
    Serial.print("Read card #");
    Serial.println(id);
    Serial.println();
    
    uint8_t keys[]= { 0xFF,0xFF,0xFF,0xFF,0xFF,0xFF };// default key of a fresh card
    for(uint8_t blockn=0;blockn<64;blockn++) {
      if(nfc.authenticateBlock(1, id ,blockn,KEY_A,keys)) {
        //if authentication successful
        uint8_t block[16];
        //read memory block blockn
        if(nfc.readMemoryBlock(1,blockn,block)) {
          //if read operation is successful
          for(uint8_t i=0;i<16;i++) {
            //print memory block
            Serial.print(block[i],HEX);
            if(block[i] <= 0xF) {
              Serial.print("  ");
            }
            else {
              Serial.print(" ");
            }
          }
 
          Serial.print("| Block ");
          if(blockn <= 9) {
            Serial.print(" ");
          }
          Serial.print(blockn,DEC);
          Serial.print(" | ");
 
          if(blockn == 0) {
            Serial.println("Manufacturer Block");
          }
          else {
            if(((blockn + 1) % 4) == 0) {
              Serial.println("Sector Trailer");
            }
            else {
              Serial.println("Data Block");
            }
          }
        }
      }
    }
  }
  delay(2000);
}
