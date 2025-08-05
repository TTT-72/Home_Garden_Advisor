/**
 * Gemini APIで予測を生成
 */
function generatePredictionWithGemini(sensorData, weatherData) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
  try {
    const prompt = createPredictionPrompt(sensorData, weatherData);
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4000,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    const response = UrlFetchApp.fetch(
      `${url}${CONFIG.MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      }
    );
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Gemini API error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const result = JSON.parse(response.getContentText());
    console.log('Gemini API Response:', JSON.stringify(result, null, 2));
    
    // レスポンスの構造を確認
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
      throw new Error('Unexpected response format from Gemini API');
    }
    
    console.log('generaiting prediction received successfully');

    return result.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Error generating prediction with Gemini:', error);

    // フォールバック：簡単な予測を返す
    return generateFallbackPrediction(sensorData, weatherData);
  }
}

/**
 * Gemini用の詳細なプロンプト作成
 */
function createPredictionPrompt(sensorData, weatherData) {
  const currentTime = new Date().toLocaleString('ja-JP');
  let analysisSummary = '';
  const sensorTemp = parseFloat(sensorData['1_cell']);
  const temp_diff = sensorTemp - weatherData.forecast[0].temperature;

// 気温の差を評価
  if (temp_diff > 0.5) { // 0.5℃以上の差で「高い」と判断
    analysisSummary = `実測の気温は予報より${temp_diff.toFixed(1)}℃高く、`;
  } else if (temp_diff < -0.5) { // -0.5℃以下の差で「低い」と判断
    analysisSummary = `実測の気温は予報より${Math.abs(temp_diff).toFixed(1)}℃低く、`;
  } else {
    analysisSummary = `実測の気温、予報とほぼ同じで、`;
  }

// 湿度の差も同様に評価（任意ですが、あると精度が上がります）
  const sensorHumi = parseFloat(sensorData['2_cell']);
  const humidity_diff = sensorHumi - weatherData.forecast[0].humidity;
  if (humidity_diff > 5) { // 5%以上の差
    analysisSummary += `湿度は${humidity_diff.toFixed(0)}%高い状態です。`;
  } else if (humidity_diff < -5) {
    analysisSummary += `湿度は${Math.abs(humidity_diff).toFixed(0)}%低い状態です。`;
  } else {
    analysisSummary += `湿度、予報通りです。`;
  }

console.log(analysisSummary);
  
  let prompt = `# 役割
あなたは、家庭菜園の失敗を防ぐためのリスク管理AIです。プロの農家のように、データに基づいた的確で具体的な指示を出すことがあなたの仕事です。

# 背景情報

- 作物名: ${CONFIG.FARM_CROPS}
- 作物の状態: ${CONFIG.FARM_STATE}
- 作物の栽培方式 ${CONFIG.FARM_METHOD}

## 【最重要】この作物のクリティカルな環境条件
- 生育に適した温度範囲: 15℃～25℃
- 高温による生育不良が始まる温度: 30℃以上
- 霜害の危険がある温度: 3℃以下
- 多湿による病気リスクが高まる湿度: 85%以上が2時間以上続くこと

# 入力データ
- 現在時刻: ${currentTime}
- 実測値（畑）: 気温${sensorData['1_cell']}, 湿度${sensorData['2_cell']}
- 【分析サマリー】: ${analysisSummary}
- 【今後の天気予報】:
${weatherData.forecast.map((f, index) => 
  `${index + 1}. ${f.time}: 気温${f.temperature}°C, 湿度${f.humidity}%, 天気「${f.weather}」`
).join('\n')}`;

  prompt += `

# 最重要ミッション
上記の[背景情報]と[入力データ]を統合し、今後24時間で指定された作物が直面する**最も重大なリスクを1つだけ特定**してください。
そのリスクが発生する具体的な時間と、それを回避するための**実践的で具体的な対策**を指示してください。

# 出力条件
- 全体で300文字以内。
- 「～かもしれません」のような曖昧な表現は避け、「～です」「～してください」と断定的に指示する。
- 以下の形式を厳守すること。
【温度推移】（実測値と今後の天気予報の差を重視、天気予報より確度の高いであろう6時間後と12時間後の予測）
【リスク予測】（最も注意すべき事象と次点の事象、時間、予測数値を簡潔に）
【対策】（もし対策していなければ、とつけ加える。「今すぐ」「夕方までに」など、いつ何をすべきか具体的に）
【一言コメント】`;

  console.log('prompt sent successfully');
  return prompt;
}

/**
 * Gemini API呼び出し失敗時のフォールバック予測
 */
function generateFallbackPrediction(sensorData, weatherData) {
  try {
    // 安全にデータを取得
    const currentTemp = parseFloat(sensorData['1_cell']) || 0;
    const currentHumidity = parseFloat(sensorData['2_cell']) || 0;
    
    // 天気予報との比較（安全にチェック）
    let forecastTemp = currentTemp;
    let tempDiff = 0;
    
    if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
      const firstForecast = weatherData.forecast[0];
      if (firstForecast && typeof firstForecast.temperature === 'number') {
        forecastTemp = firstForecast.temperature;
        tempDiff = currentTemp - forecastTemp;
      }
    }
    
    // 基本情報
    let prediction = `現在の畑の気温は${currentTemp.toFixed(1)}°C、湿度は${currentHumidity.toFixed(1)}%です。`;
    
    // 天気予報との比較
    if (Math.abs(tempDiff) > 2) {
      prediction += `予報と${Math.abs(tempDiff).toFixed(1)}°C${tempDiff > 0 ? '高く' : '低く'}なっています。`;
    }
    
    // 温度に基づく注意喚起
    if (currentTemp < 5) {
      prediction += `低温注意。霜害対策を検討してください。`;
    } else if (currentTemp > 30) {
      prediction += `高温注意。水分補給や遮光対策を検討してください。`;
    } else if (currentTemp >= 5 && currentTemp <= 30) {
      prediction += `適温範囲内です。`;
    }
    
    // 湿度に基づく注意喚起
    if (currentHumidity < 30) {
      prediction += `湿度が低いため、乾燥対策を行ってください。`;
    } else if (currentHumidity > 80) {
      prediction += `湿度が高いため、換気や病害虫対策を行ってください。`;
    }
    
    // 時間帯に応じたアドバイス
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour <= 9) {
      prediction += `朝の時間帯です。今日の作業計画を立てましょう。`;
    } else if (currentHour >= 10 && currentHour <= 15) {
      prediction += `日中の時間帯です。水分管理に注意してください。`;
    } else if (currentHour >= 16 && currentHour <= 19) {
      prediction += `夕方の時間帯です。翌日の準備を検討してください。`;
    }
    
    return prediction;
    
  } catch (error) {
    console.error('Error in generateFallbackPrediction:', error);
    return `現在の畑の状況を確認中です。センサーデータ：気温${sensorData['1_cell'] || 'N/A'}°C、湿度${sensorData['2_cell'] || 'N/A'}%。定期的にを続けてください。`;
  }
}