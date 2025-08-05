/**
 * LINE Messaging API�Œʒm���M
 */
function sendLINEMessage(sensorData, prediction) {
  try {
    const currentTime = new Date().toLocaleString('ja-JP');
    
    // �t���b�N�X���b�Z�[�W���쐬�i���b�`�ȕ\���j
    const flexMessage = {
      type: "flex",
      altText: "���̊����|�[�g",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "? ���̊����|�[�g",
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
                  text: "?? �C��",
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
                  text: "? ���x",
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
                  text: "? AI�\��",
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
              text: "#��IoT #�_��",
              size: "xs",
              color: "#000000",
              align: "center"
            }
          ]
        }
      }
    };
    
    // �V���v���ȃe�L�X�g���b�Z�[�W�Łi�t�H�[���o�b�N�j
    const simpleMessage = {
      type: "text",
      text: `? ���̊����|�[�g
? ${currentTime}

?? ���݂̋C��: ${sensorData['1_cell']}
? ���݂̎��x: ${sensorData['2_cell']}

? AI�\��:
${prediction}

#��IoT #�_��`
    };
    
    // API���N�G�X�g�p�̃y�C���[�h
    const payload = {
      messages: [flexMessage] // �t���b�N�X���b�Z�[�W���g�p�A�G���[����simpleMessage�ɕύX
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
      
      // �t���b�N�X���b�Z�[�W�ŃG���[���o���ꍇ�A�V���v�����b�Z�[�W�ōĎ��s
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