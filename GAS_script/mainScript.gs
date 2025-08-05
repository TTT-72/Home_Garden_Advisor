// 農業IoTシステム - Google Apps Script
// ESP32から温湿度データを受信し、天気予報APIと連携してLLMで予測を生成

//ESP32からのデータ受信エンドポイント
//* WebアプリとしてデプロイしてURLを取得

function doGet(e) {
  try {
    // URLパラメータから値を取得
    const data = e.parameter;
    const temperature = e.parameter['1_cell'];
    const humidity = e.parameter['2_cell'];
    
    // 受信データの検証
    if (!temperature || !humidity) {
      return ContentService.createTextOutput('Error: Invalid data format')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // メイン処理実行
    const result = processIoTData(data);
 
    if (result.success) {
      console.log('main function Successfly');
      console.log(result);
    } else {
      console.log('Error main function', result.error);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * メイン処理関数
 */
function processIoTData(sensorData) {
  
  // 1. 現在の天気予報を取得
  const weatherData = getWeatherForecast();
  
  // 2. LLMで予測を生成
  const prediction = generatePredictionWithGemini(sensorData, weatherData);
  
  // 3. データをスプレッドシートに記録
  const recordResult = recordData(sensorData, weatherData, prediction);
  
  // 4. LINE通知送信
  if (CONFIG.NOTIFICATION_ENABLED) {
    sendLINEMessage(sensorData, prediction);
  }
  // 5. 前日までのデータを統計処理
  const DailyStats = calculateDailyStats();

  return {
    success: true,
    timestamp: new Date().toLocaleString('ja-JP'),
    temperature: sensorData['1_cell'],
    humidity: sensorData['2_cell'],
    prediction: prediction,
    recorded: recordResult,
    statsprocess: DailyStats
  };
}
