// �_��IoT�V�X�e�� - Google Apps Script
// ESP32���牷���x�f�[�^����M���A�V�C�\��API�ƘA�g����LLM�ŗ\���𐶐�
// // �_��IoT�V�X�e�� - �f�[�^�L�^�E�ʒm�@�\

/**
 * �X�v���b�h�V�[�g�Ƀf�[�^���L�^
 */
function recordData(sensorData, weatherData, prediction) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('sensor_data');
    
    // �V�[�g�����݂��Ȃ��ꍇ�͍쐬
    if (!sheet) {
      sheet = spreadsheet.insertSheet('sensor_data');
      // �w�b�_�[�s��ǉ�
      sheet.appendRow([
        'Timestamp',
        'Temperature',
        'Humidity', 
        'Weather_Temperature',
        'Weather_Humidity',
        'Prediction',
        'Weather_Description'
      ]);
    }
    if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config")){
      const configSheet = spreadsheet.insertSheet('config');
      configSheet.appendRow(['Setting', 'Value', 'Description']);
      configSheet.appendRow(['Farm_Latitude', CONFIG.FARM_LAT, '���̈ܓx']);
      configSheet.appendRow(['Farm_Longitude', CONFIG.FARM_LON, '���̌o�x']);
      configSheet.appendRow(['Created_At', new Date().toLocaleString('ja-JP'), '�쐬����']);
    }

    // ���v�p�V�[�g���쐬
    if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName("statistics")){
      const statsSheet = spreadsheet.insertSheet('statistics');
      statsSheet.appendRow(['���t', '�Œ�C��', '�ō��C��', '���ϋC��', '�ŒᎼ�x', '�ō����x', '���ώ��x']);
    }

    // ���ݎ����ƓV�C�\��̍ŏ��̃f�[�^���g�p
    const currentWeather = weatherData.forecast.length > 0 ? weatherData.forecast[0] : {};
    
    // �f�[�^��ǉ�
    sheet.appendRow([
      new Date().toLocaleString('ja-JP'),
      sensorData['1_cell'],
      sensorData['2_cell'],
      currentWeather.temperature || 'N/A',
      currentWeather.humidity || 'N/A',
      prediction,
      currentWeather.weather || 'N/A'
    ]);
    
    // �Â��f�[�^�̍폜�i1000�s�𒴂����ꍇ�j
    const lastRow = sheet.getLastRow();
    if (lastRow > 1500) {
      sheet.deleteRows(2, lastRow - 1500);
    }
    console.log('record successfully');
    return { success: true, rowsRecorded: 1 };
    
  } catch (error) {
    console.error('Error recording data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * �������v���v�Z���ăX�v���b�h�V�[�g�ɋL�^
 */
function calculateDailyStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const dataSheet = spreadsheet.getSheetByName('sensor_data');
    const statsSheet = spreadsheet.getSheetByName('statistics');
    
    // ����̓��t���擾
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // ����̃f�[�^���擾
    const dataRange = dataSheet.getRange(2, 1, dataSheet.getLastRow() - 1, 7);
    const data = dataRange.getValues();
    
    const yesterdayData = data.filter(row => {
      const rowDate = new Date(row[0]);
      return rowDate.toDateString() === yesterdayStr;
    });
    
    if (yesterdayData.length === 0) {
      console.log('No data for yesterday');
      return { success: false, message: 'No data for yesterday' };
    }
    
    // ���v���v�Z
    const temperatures = yesterdayData.map(row => parseFloat(row[1]));
    const humidities = yesterdayData.map(row => parseFloat(row[2]));
    
    const stats = {
      date: yesterday.toLocaleDateString('ja-jp'),
      minTemp: Math.min(...temperatures),
      maxTemp: Math.max(...temperatures),
      avgTemp: temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length,
      minHumidity: Math.min(...humidities),
      maxHumidity: Math.max(...humidities),
      avgHumidity: humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length
    };
    
    // ���v�V�[�g�ɋL�^
    statsSheet.appendRow([
      stats.date,
      stats.minTemp.toFixed(1),
      stats.maxTemp.toFixed(1),
      stats.avgTemp.toFixed(1),
      stats.minHumidity.toFixed(1),
      stats.maxHumidity.toFixed(1),
      stats.avgHumidity.toFixed(1)
    ]);
 
    // �P�ʐݒ�
    const lastRow = statsSheet.getLastRow();
    statsSheet.getRange(lastRow, 2, 1, 3).setNumberFormat('0"��"'); 
    statsSheet.getRange(lastRow, 5, 1, 3).setNumberFormat('0"%"'); 
  
    console.log('Daily stats calculated:', stats);
    return { success: true, stats: stats };
    
  } catch (error) {
    console.error('Error calculating daily stats:', error);
    return { success: false, error: error.message };
  }
}