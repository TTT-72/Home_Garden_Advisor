// 設定値
const CONFIG = {
  // API キー（GASの「プロパティ」で設定することを推奨）
  OPENWEATHER_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENWEATHER_API_KEY'),
  // OpenAI
  OPENAI_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY'),
  // Gemini
  GEMINI_API_KEY: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'),
  MODEL: 'gemini-2.5-flash', // 無料枠で使用可能
  // LINE
  LINE_CHANNEL_ACCESS_TOKEN: PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN'),
  LINE_USER_ID: PropertiesService.getScriptProperties().getProperty('LINE_USER_ID'),
  LINE_GROUP_ID: 'YOUR_GROUP_ID', // グループに送信する場合のグループID


 
  //畑の状況

  // スプレッドシートID
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  
  // 通知設定
  NOTIFICATION_ENABLED: true
};

  //CONFIGに後から追加
  // 畑の緯度
CONFIG.FARM_LAT = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B2').getValue();
  // 畑の経度
CONFIG.FARM_LON = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B3').getValue();

  //畑の種別や規模
CONFIG.FARM_METHOD = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B5').getValue();

  //栽培作物
CONFIG.FARM_CROPS = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B6').getValue();

  //畑の状態　
CONFIG.FARM_STATE = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B7').getValue();


/**
 * 設定値を取得/設定するヘルパー関数
 */
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function setProperty(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

/**
 * 設定値を一括設定
 */
function setupProperties() {
  const properties = {
    // 'OPENWEATHER_API_KEY': 'your_openweather_api_key_here',
    // 'OPENAI_API_KEY': 'your_openai_api_key_here', 
    // 'LINE_NOTIFY_TOKEN': 'your_line_notify_token_here',
    'SPREADSHEET_ID': '109-mmVyIXZhYEdv_nuC1buAESCSmsFIPe3-cVB0gGsQ'
  };
  
  PropertiesService.getScriptProperties().setProperties(properties);
  console.log('Properties setup complete. Please update with your actual API keys.');
}
