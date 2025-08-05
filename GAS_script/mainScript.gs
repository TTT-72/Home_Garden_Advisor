// �_��IoT�V�X�e�� - Google Apps Script
// ESP32���牷���x�f�[�^����M���A�V�C�\��API�ƘA�g����LLM�ŗ\���𐶐�

//ESP32����̃f�[�^��M�G���h�|�C���g
//* Web�A�v���Ƃ��ăf�v���C����URL���擾

function doGet(e) {
  try {
    // URL�p�����[�^����l���擾
    const data = e.parameter;
    const temperature = e.parameter['1_cell'];
    const humidity = e.parameter['2_cell'];
    
    // ��M�f�[�^�̌���
    if (!temperature || !humidity) {
      return ContentService.createTextOutput('Error: Invalid data format')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // ���C���������s
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
 * ���C�������֐�
 */
function processIoTData(sensorData) {
  
  // 1. ���݂̓V�C�\����擾
  const weatherData = getWeatherForecast();
  
  // 2. LLM�ŗ\���𐶐�
  const prediction = generatePredictionWithGemini(sensorData, weatherData);
  
  // 3. �f�[�^���X�v���b�h�V�[�g�ɋL�^
  const recordResult = recordData(sensorData, weatherData, prediction);
  
  // 4. LINE�ʒm���M
  if (CONFIG.NOTIFICATION_ENABLED) {
    sendLINEMessage(sensorData, prediction);
  }
  // 5. �O���܂ł̃f�[�^�𓝌v����
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
