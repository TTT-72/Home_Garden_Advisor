/**
 * LINE Messaging APIで通知送信
 */
function sendLINEMessage(sensorData, prediction) {
  try {
    const currentTime = new Date().toLocaleString('ja-JP');
    
    // フレックスメッセージを作成（リッチな表示）
    const flexMessage = {
      type: "flex",
      altText: "畑の環境レポート",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "? 畑の環境レポート",
              weight: "bold",
              size: "lg",
              color: "#2E7D32"
            },
            {
              type: "text",
              text: currentTime,
              size: "sm",
              color: "#666666"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "?? 気温",
                  flex: 1,
                  weight: "bold"
                },
                {
                  type: "text",
                  text: `${sensorData['1_cell']}`,
                  flex: 1,
                  align: "end",
                  color: "#FF5722"
                }
              ]
            },
            {
              type: "separator",
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "? 湿度",
                  flex: 1,
                  weight: "bold"
                },
                {
                  type: "text",
                  text: `${sensorData['2_cell']}`,
                  flex: 1,
                  align: "end",
                  color: "#2196F3"
                }
              ],
              margin: "md"
            },
            {
              type: "separator",
              margin: "md"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "? AI予測",
                  weight: "bold",
                  margin: "md"
                },
                {
                  type: "text",
                  text: prediction,
                  wrap: true,
                  color: "#000000",
                  margin: "sm"
                }
              ]
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "#畑IoT #農業",
              size: "xs",
              color: "#000000",
              align: "center"
            }
          ]
        }
      }
    };
    
    // シンプルなテキストメッセージ版（フォールバック）
    const simpleMessage = {
      type: "text",
      text: `? 畑の環境レポート
? ${currentTime}

?? 現在の気温: ${sensorData['1_cell']}
? 現在の湿度: ${sensorData['2_cell']}

? AI予測:
${prediction}

#畑IoT #農業`
    };
    
    // APIリクエスト用のペイロード
    const payload = {
      messages: [flexMessage] // フレックスメッセージを使用、エラー時はsimpleMessageに変更
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', options);
    
    if (response.getResponseCode() === 200) {
      console.log('LINE message sent successfully');
      return { success: true };
    } else {
      console.error('LINE message failed:', response.getContentText());
      
      // フレックスメッセージでエラーが出た場合、シンプルメッセージで再試行
      if (response.getResponseCode() === 400) {
        console.log('Retrying with simple text message...');
        payload.messages = [simpleMessage];
        
        const retryResponse = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', {
          ...options,
          payload: JSON.stringify(payload)
        });
        
        if (retryResponse.getResponseCode() === 200) {
          console.log('LINE simple message sent successfully');
          return { success: true };
        } else {
          console.error('LINE simple message also failed:', retryResponse.getContentText());
          return { success: false, error: retryResponse.getContentText() };
        }
      }
      
      return { success: false, error: response.getContentText() };
    }
    
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return { success: false, error: error.message };
  }
}