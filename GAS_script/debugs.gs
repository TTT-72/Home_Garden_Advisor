//ESP32を除く全体挙動のテスト
function mainTest(){
  const e = {
    parameter: {
      "1_cell": "22℃",
      "2_cell": "70％"
    }
  };

 try {
    console.log('=== main処理 テスト結果 ===', );
    doGet(e); 
  } catch (error) {
    console.error('❌ main処理 テストエラー:', error);
  }
}



// function simpleTimezoneCheck() {
//   const now = new Date();
//   console.log('現在時刻 (toString):', now.toString());
//   console.log('現在時刻 (JST):', now.toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'}));
//   console.log('タイムゾーンオフセット:', now.getTimezoneOffset(), '分');
  
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   console.log('昨日 (JST):', yesterday.toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'}));
// }

// function testrecord() {
//   const wetherdummydata = {
//     temperature: 24,
//     humidity: 22,
//     timestamp: new Date().toLocaleString('ja-JP')
//   }
//   const weatherData = getWeatherForecast();
//   const prediction = ('晴れ');

//   const testWetherResult = recordData(wetherdummydata, weatherData, prediction)
// }

// /**
//  * テスト用：ダミーデータでの動作確認
//  */
// function testOpenAIDummyData() {
//   const OpenAIdummyData = {
//     temperature: 18.5,
//     humidity: 65.2,
//     timestamp: new Date(new Date().toLocaleString('ja-JP')).toISOString();
//   };
  
//   console.log('=== テスト開始 ===');
//   const result = processIoTData(OpenAIdummyData);
//   console.log('=== テスト結果 ===');
//   console.log(result);
// }

// /* Gemini APIのテスト*/
 
// function testGeminiAPIdummyData() {
//   const GeminidaummyData = {
//     temperature: 22,
//     humidity: 15,
//     timestamp: new Date().toLocaleString('ja-JP')
//   };

//   console.log('=== Gemini API テスト開始 ===');

//   try {
//     const GeminiResult = processIoTData(GeminidaummyData);
//     console.log('=== Gemini API テスト結果 ===', );
    
//     if (GeminiResult.success) {
//       console.log('✅ Gemini API テスト成功！');
//       console.log('予測結果:\n', GeminiResult.prediction);
//     } else {
//       console.log('❌ Gemini API テスト失敗:', Geminiresult.error);
//     }
    
//   } catch (error) {
//     console.error('❌ Gemini API テストエラー:', error);
//   }
// }