// �ݒ�l
const CONFIG = {
  // API �L�[�iGAS�́u�v���p�e�B�v�Őݒ肷�邱�Ƃ𐄏��j
  OPENWEATHER_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENWEATHER_API_KEY'),
  // OpenAI
  OPENAI_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY'),
  // Gemini
  GEMINI_API_KEY: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'),
  MODEL: 'gemini-2.5-flash', // �����g�Ŏg�p�\
  // LINE
  LINE_CHANNEL_ACCESS_TOKEN: PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN'),
  LINE_USER_ID: PropertiesService.getScriptProperties().getProperty('LINE_USER_ID'),
  LINE_GROUP_ID: 'YOUR_GROUP_ID', // �O���[�v�ɑ��M����ꍇ�̃O���[�vID


 
  //���̏�

  // �X�v���b�h�V�[�gID
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  
  // �ʒm�ݒ�
  NOTIFICATION_ENABLED: true
};

  //CONFIG�Ɍォ��ǉ�
  // ���̈ܓx
CONFIG.FARM_LAT = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B2').getValue();
  // ���̌o�x
CONFIG.FARM_LON = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B3').getValue();

  //���̎�ʂ�K��
CONFIG.FARM_METHOD = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B5').getValue();

  //�͔|�앨
CONFIG.FARM_CROPS = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B6').getValue();

  //���̏�ԁ@
CONFIG.FARM_STATE = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName('config')
  .getRange('B7').getValue();


/**
 * �ݒ�l���擾/�ݒ肷��w���p�[�֐�
 */
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function setProperty(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

/**
 * �ݒ�l���ꊇ�ݒ�
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
