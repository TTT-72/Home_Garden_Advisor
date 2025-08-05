// 農業IoTシステム - Google Apps Script
// ESP32から温湿度データを受信し、天気予報APIと連携してLLMで予測を生成
// // 農業IoTシステム - データ記録・通知機能

/**
 * スプレッドシートにデータを記録
 */
function recordData(sensorData, weatherData, prediction) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('sensor_data');
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = spreadsheet.insertSheet('sensor_data');
      // ヘッダー行を追加
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
      configSheet.appendRow(['Farm_Latitude', CONFIG.FARM_LAT, '畑の緯度']);
      configSheet.appendRow(['Farm_Longitude', CONFIG.FARM_LON, '畑の経度']);
      configSheet.appendRow(['Created_At', new Date().toLocaleString('ja-JP'), '作成日時']);
    }

    // 統計用シートを作成
    if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName("statistics")){
      const statsSheet = spreadsheet.insertSheet('statistics');
      statsSheet.appendRow(['日付', '最低気温', '最高気温', '平均気温', '最低湿度', '最高湿度', '平均湿度']);
    }

    // 現在時刻と天気予報の最初のデータを使用
    const currentWeather = weatherData.forecast.length > 0 ? weatherData.forecast[0] : {};
    
    // データを追加
    sheet.appendRow([
      new Date().toLocaleString('ja-JP'),
      sensorData['1_cell'],
      sensorData['2_cell'],
      currentWeather.temperature || 'N/A',
      currentWeather.humidity || 'N/A',
      prediction,
      currentWeather.weather || 'N/A'
    ]);
    
    // 古いデータの削除（1000行を超えた場合）
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
 * 日次統計を計算してスプレッドシートに記録
 */
function calculateDailyStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const dataSheet = spreadsheet.getSheetByName('sensor_data');
    const statsSheet = spreadsheet.getSheetByName('statistics');
    
    // 昨日の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // 昨日のデータを取得
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
    
    // 統計を計算
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
    
    // 統計シートに記録
    statsSheet.appendRow([
      stats.date,
      stats.minTemp.toFixed(1),
      stats.maxTemp.toFixed(1),
      stats.avgTemp.toFixed(1),
      stats.minHumidity.toFixed(1),
      stats.maxHumidity.toFixed(1),
      stats.avgHumidity.toFixed(1)
    ]);
 
    // 単位設定
    const lastRow = statsSheet.getLastRow();
    statsSheet.getRange(lastRow, 2, 1, 3).setNumberFormat('0"℃"'); 
    statsSheet.getRange(lastRow, 5, 1, 3).setNumberFormat('0"%"'); 
  
    console.log('Daily stats calculated:', stats);
    return { success: true, stats: stats };
    
  } catch (error) {
    console.error('Error calculating daily stats:', error);
    return { success: false, error: error.message };
  }
}