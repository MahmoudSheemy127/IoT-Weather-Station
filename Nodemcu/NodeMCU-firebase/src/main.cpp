#include <Arduino.h>
#include "Cred.h" //This header file contains Credentials such as WIFI_SSID, WIFI_PASS and so on. 
#include <Firebase_ESP_Client.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <BME280_t.h>
#include <RtcDS1302.h>
#include <ThreeWire.h>
#include <LiquidCrystal_I2C.h>




void printDateTime(const RtcDateTime& dt);
char *generateUniqueId();

//firbase auth object
FirebaseAuth auth;

//firebase data object
FirebaseData data;

//firebase config object
FirebaseConfig config;

bool signup = false;

u32 newId;
u8 inputChar;

//rtc object
// ThreeWire wire()
ThreeWire wire(D7,D8,D6);
RtcDS1302<ThreeWire> rtc(wire);

//configure lcd
LiquidCrystal_I2C lcd(0x27,16,2);

//bme object
BME280<> BMESensor;

String recordName,fieldName,id ;
String duration,date;

void setup()
{
  Serial.begin(9600);
  //begin rtc
  rtc.Begin();
  //begin i2c connection for BME sensor
  Wire.begin(D2,D1,0x76);
  //begin BME sensor connection
  BMESensor.begin();
  //init lcd
  lcd.init();
  //activate backlight for lcd
  lcd.backlight();


  //connect to wifi
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  Serial.print("Connecting to wifi network ");
  Serial.print(WIFI_SSID);
  Serial.print(" ");
  lcd.setCursor(0,0);
  lcd.print("Connecting....");
  while(WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
  }
  lcd.clear();

  //connected to wifi
  lcd.println("Connected");
  lcd.setCursor(0,1);
  lcd.print("IP: ");
  lcd.print(WiFi.localIP());
  delay(1000);
  lcd.clear();
  //config with firebase
  config.api_key = API_KEY;

  //assign real time database
  config.database_url = DATABASE_URL;

  //firabase auth
  auth.user.email = NODE_EMAIL;
  auth.user.password = NODE_PASS;

  //signup first if no account was created
  if(Firebase.signUp(&config,&auth,NODE_EMAIL,NODE_PASS))
  {
    Serial.println("New account Created...");
  }


  
  //connect with firebase
  Firebase.begin(&config,&auth);
}

void loop()
{
  //IF nodeMcu is authenticated
  if(Firebase.ready())
  {
    //interface with RTC module to get the real time
    //get duration time
    date = String(rtc.GetDateTime().Day()) + ":" + String(rtc.GetDateTime().Month()) + ":" + String(rtc.GetDateTime().Year());
    duration = String(rtc.GetDateTime().Hour()) + ":" + (rtc.GetDateTime().Minute() < 10 ? "0"+String(rtc.GetDateTime().Minute()) : String(rtc.GetDateTime().Minute())) + ":" + (rtc.GetDateTime().Second() < 10 ? "0"+String(rtc.GetDateTime().Second()) : String(rtc.GetDateTime().Second()));  
    id = date + duration;
    //refresh BME sensor
    BMESensor.refresh();
    //write temp data to lcd
    lcd.setCursor(0,0);
    lcd.print("Temp: ");
    lcd.print(BMESensor.temperature);
    //write pressure data to lcd
    lcd.print(" press: ");
    lcd.print((BMESensor.pressure / 100.0F));
    lcd.setCursor(0,1);
    //write humiditiy data to lcd
    lcd.print("humidity: ");
    lcd.print(BMESensor.humidity / 1.0F);

    //send temp record to firebase
    recordName = "temperature/" + id + "/value";
    Firebase.RTDB.setFloat(&data,recordName,BMESensor.temperature);
    recordName = "temperature/" + id + "/date";
    Firebase.RTDB.setString(&data,recordName,duration);
    
    // //send pressure record to firebase
    recordName = "pressure/" + id + "/value";
    Firebase.RTDB.setFloat(&data,recordName,(BMESensor.pressure / 100.0F));
    recordName = "pressure/" + id + "/date";
    Firebase.RTDB.setString(&data,recordName,duration);

    // //send humidity record to firebase
    recordName = "humidity/" + id + "/value";
    Firebase.RTDB.setFloat(&data,recordName,BMESensor.humidity / 1.0F);
    recordName = "humidity/" + id + "/date";
    Firebase.RTDB.setString(&data,recordName,duration);


    //Do this every 2 seconds
    delay(2000);
  }
  else
  {
    // NodeMCU not authenticated
    lcd.setCursor(0,0);
    lcd.print("Firebase UnAuthenticated");
  }
}


//function for generating unqiue id
char *generateUniqueId()
{
    static char id[20];
    char randomOne,randomTwo;
    for(int i=0;i<19;i++)
    {
        randomOne = random(3);
        switch (randomOne)
        {
        case 0:
            //random for uppercase letters
            randomTwo = random(65,90);
            break;
        case 1:
            //random for lowercase letters
            randomTwo = random(97,122);
            break;
        case 2:
            //random for numbers
            randomTwo = random(48,57);
            break;
        default:
            break;
        }
        id[i] = randomTwo;
    }
    id[19] = '\0';
    return id;
}