# Home_Garden_Advisor
���v���W�F�N�g�́A�ƒ�؉��Ƃ�������I�ȋC���𑪒肵�A�\�����ڂƍ��킹��AI���앨�ɍ��킹���������s���A�ƒ�؉����S�҂�������@��̊J���Ƃ����R���Z�v�g�ł��B
**ESP32**�Ŏ擾�����Z���T�[�f�[�^��AI�ɂ��\���Ə�����LINE�o�R�ōs���A**Google Apps Script (GAS)**�����**Google�X�v���b�h�V�[�g**�ɘA���̋C���E���x�����L�^���܂��B

---

## �g�p�Z�p

| �Z�p�X�^�b�N | �ڍ� |
| :--- | :--- |
| **�n�[�h�E�F�A** | ESP32-CherryIoT, DHT20 (���x�E���x�E�C���Z���T�[) �i������͊w�K���ނƂ���ESP32CherryIoT�̋@������؂肵�Ďg�p���Ă��܂��B�j|
| **�t�@�[���E�F�A** | Arduino |
| **�N���E�h** | Google Apps Script, Google �X�v���b�h�V�[�g |
| **API** | OpenWeather, Google Gemini, Line |

---

## ���쌴��

���̃v���W�F�N�g�̒��j��S��GAS�X�N���v�g�́AESP32���瑗���Ă����C���E���x�f�[�^�����ƂɁA�ȉ��̂悤�ȏ������������s���܂��B

1.  **ESP32����̃f�[�^��M**:
    - ESP32����GET���N�G�X�g�ŋC���E���x�f�[�^���󂯎��܂��B

2.  **�O��API�A�g**:
    - ��M��������l�����ƂɁAOpenWeather API����12���ԕ��̒n�_�\���C���f�[�^���擾���܂��B
    - ����l�A�\���C���A�����Ĉ�ĂĂ����؂̎�ށi��F�~�j�g�}�g�A�i�X�j��Gemini API�ւ̃v�����v�g�ɂ܂Ƃ߁A�����̋C���\���ƍ앨�ւ̑Ώ��@�𐶐����܂��B

3.  **��񔭐M**:
    - Gemini API�����������e�L�X�g�i��F�u�~�j�g�}�g�͖�Ԃ̗₦���݂ɒ��ӂ��K�v�ł�...�v�j��LINE�ő��M���܂��B

4.  **�f�[�^�L�^**:
    - ESP32����̑���l�AOpenWeather�̗\���l�A������Gemini�����������e�L�X�g��Google�X�v���b�h�V�[�g�ɋL�^���܂��B

### �T�O�}
<table>
  <tr>
    <td align="center">
      <figure>
        <img src="images/circuit.png" alt="�T�O�}" style="width:100%;">
      </figure>
    </td>
  </tr>
</table>

---

## �Z�b�g�A�b�v�菇

### 1. �n�[�h�E�F�A�̏���

[�g�p����Z���T�[�╔�i�̃��X�g�A����єz���}�ւ̃p�X]

### 2. Google Apps Script �̐ݒ�

1.  **�X�v���b�h�V�[�g�̏���**:
    * [GAS_scripts/scensorData.ods](GAS_scripts/censorData.ods) ���_�E�����[�h���AGoogle�h���C�u�ɃA�b�v���[�h���Ă��������B
    * �X�v���b�h�V�[�g���J���AURL����**�X�v���b�h�V�[�gID**���T���Ă����܂��B

2.  **GAS�̃f�v���C**:
    * �J�����X�v���b�h�V�[�g����[AppScript](images/spreadsheet_setting.png)���J���܂��B
    * �V�K�̃X�N���v�g�t�@�C�����쐬���A�f�t�H���g�̋L�q���폜���܂��B
    * `gas_scripts`�t�H���_����`.gs`�t�@�C�����J���A�����ꂽ�R�[�h���R�s�[�y�[�X�g�Œ���t���Ă��������Bgs�t�@�C���͑S7�ł����A�����悤��7�ɕ����Ă��A���gs�t�@�C����7�����ׂẴR�[�h���R�s�[���Ă��@�\����͂��ł��B
    * �S�Ă�.gs�t�@�C���̃R�[�h���ڂ��I������AWeb�A�v���Ƃ��ăf�v���C���A���s���ꂽURL���R�s�[���܂��B

3.  **API�L�[�̐ݒ�**:
    * GAS�́u�v���W�F�N�g�̐ݒ�v����u�X�N���v�g�v���p�e�B�v���J���܂��B
    * **�L�[**�� �摜�ɂ���[�L�[��](images/APIkey_list.png)���A**�l**�ɂ����g�̎����Ă���API�L�[/�X�v���b�h�V�[�gID��ݒ肵�Ă��������B

### 3. ESP32 �t�@�[���E�F�A�̐ݒ�

1.  **�v���W�F�N�g���J��**: `ESP32_cherryIoT/`�t�H���_���� `.ino`�t�@�C����Arduino IDE�ŊJ���܂��B
2.  **Wi-Fi�ݒ�**: �R�[�h���� `const char* ssid = "****"` �� `const char* password = "****"` �������g��Wi-Fi���ɏ��������܂��B
3.  **GAS��URL�ݒ�**: ��قǎ擾����GAS��Web�A�v��URL���R�[�h���̊Y���ӏ��ɓ\��t���܂��B
4.  **��������**: Arduino IDE��**ESP32 C3 Dev Module**�{�[�h��I�����APC��ESP32��ڑ����ď������݂����s���܂��B

---

##  ���@�摜

<table>
  <tr>
    <td align="center">
      <figure>
        <figcaption align="center">
          <code>�{��</code>
        </figcaption>
        <img src="images/main_device.jpg" alt="�{��" style="width:100%;">
      </figure>
    </td>
    <td align="center">
      <figure>
        <figcaption align="center">
          <code>���M���b�Z�[�W</code>
        </figcaption>
        <img src="images/advice_image.jpg" alt="���M���b�Z�[�W" style="width:100%;">
      </figure>
    </td>
  </tr>
</table>

---

## �o��

���̋@���IoT���w�҂��Z�p�I�ȗ����E���K�̂��߂ɍ쐬���܂����B

