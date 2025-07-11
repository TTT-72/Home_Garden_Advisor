#include <DHT20.h> //DHT20 by RobTillaart
#include <Wire.h>  //シリアル通信規格　本センサ基盤の搭載規格
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// WiFi Setting
const char* ssid = "AP01-02";
const char* password = "1qaz2wsx";

//GAS setting
const char* server = "script.google.com";
const int httpsPort = 443;
String url = "https://script.google.com/macros/s/AKfycbxKow7F0tWJj_F2V6VTki7OXo1ZRNYGZGplp1KDtNq2HM7VvX3pvTCMTSWBrXMoe_2c/exec";

//DHT20 setting
const int litsnsrPin = 4; //3:ConnectorA 4:ConnectorB
DHT20 DHT;

//switch seteing
const int swPin = 4; //3:ConnectorA 4:ConnectorB

void setup() {
  Serial.begin(115200);
  pinMode(litsnsrPin, INPUT);
  pinMode(swPin, INPUT);
  Wire.begin(1, 3); //1,3:ConnectorA 5,4:ConnectorB　3はクロックシンクロ用、1は実データ信号用
  
  //Connect WiFi
  connectWiFi();
}

void loop() {
  if(digitalRead(swPin) == HIGH) {
    DHT.read();
    float Temperature = DHT.getTemperature();
    float Humidity = DHT.getHumidity();

    delay(1000);

    Serial.print(String(Temperature) + "℃");
    Serial.print(" / ");
    Serial.println(String(Humidity) + "％");

    sendData(Temperature, Humidity);
  } 
}

void connectWiFi(){

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  //Start WiFi connection
  WiFi.begin(ssid, password);

  //Check WiFi connection status
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void sendData(int Temperature, int Humidity){
  delay(1000);
  DHT.read();
  WiFiClientSecure sslclient;

  //Add measurement value to the end of the URL
  url += "?";
  url += "&1_cell=";
  url += Temperature;
  url += "℃";
  url += "&2_cell=";
  url += Humidity;
  url += "％";

  // Access server
  Serial.println("Access server...");
  sslclient.setInsecure(); //skip verification
  
  //Send data
  if (!sslclient.connect(server, 443)) {
    Serial.println("Connection failed!");
    Serial.println("");
    return;
  }

  Serial.println("Connected to server");

  sslclient.println("GET " + url);
  delay(1000); //Waiting for stabilization
  sslclient.stop();

  Serial.println("Data transmission completed");
  Serial.println("");//改行

  //Disconnect WiFi
  WiFi.mode(WIFI_OFF);
}
