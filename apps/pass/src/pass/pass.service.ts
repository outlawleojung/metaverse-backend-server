import { Injectable, Req, Res } from '@nestjs/common';
import childProcess from 'child_process';
import fs from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

@Injectable()
export class PassService {
  constructor() {}

  ejsDir = path.join(__dirname, '..', 'views');
  //NICE평가정보에서 발급한 본인인증 서비스 개발 정보(사이트 코드 , 사이트 패스워드)
  sSiteCode = 'CA576';
  sSitePW = 'J8t1KAzxqPP6';

  //모듈의 절대 경로(권한:755 , FTP업로드방식 : binary)
  // ex) sModulePath = "C:\\module\\CPClient.exe";
  //     sModulePath = "/root/modile/CPClient";
  sModulePath = './CPClient_linux_x64';

  sAuthType = ''; //없으면 기본 선택화면, M(휴대폰), X(인증서공통), U(공동인증서), F(금융인증서), S(PASS인증서), C(신용카드)
  sCustomize = ''; //없으면 기본 웹페이지 / Mobile : 모바일페이지

  // 본인인증 처리 후, 결과 데이타를 리턴 받기위해 다음예제와 같이 http부터 입력합니다.
  // 리턴url은 인증 전 인증페이지를 호출하기 전 url과 동일해야 합니다. ex) 인증 전 url : https://www.~ 리턴 url : https://www.~
  sReturnUrl = `${process.env.PASS_BACKEND_URL}/pass/checkplus_success`; // 성공시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
  sErrorUrl = `${process.env.PASS_BACKEND_URL}/pass/checkplus_fail`; // 실패시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)

  async getCheckplusMain(@Res() res) {
    const test = fs.existsSync(this.sModulePath);
    console.log('#################### file : ', test);
    console.log('#################### url : ', process.env.PASS_BACKEND_URL);

    //업체 요청 번호
    //세션등에 저장하여 데이터 위변조 검사 (인증후에 다시 전달)
    const d = new Date();
    const sCPRequest = this.sSiteCode + '_' + d.getTime();

    //전달 원문 데이터 초기화
    let sPlaincData = '';
    //전달 암호화 데이터 초기화
    let sEncData = '';
    //처리 결과 메시지
    let sRtnMSG = '';

    sPlaincData =
      '7:REQ_SEQ' +
      sCPRequest.length +
      ':' +
      sCPRequest +
      '8:SITECODE' +
      this.sSiteCode.length +
      ':' +
      this.sSiteCode +
      '9:AUTH_TYPE' +
      this.sAuthType.length +
      ':' +
      this.sAuthType +
      '7:RTN_URL' +
      this.sReturnUrl.length +
      ':' +
      this.sReturnUrl +
      '7:ERR_URL' +
      this.sErrorUrl.length +
      ':' +
      this.sErrorUrl +
      '9:CUSTOMIZE' +
      this.sCustomize.length +
      ':' +
      this.sCustomize;
    console.log('[' + sPlaincData + ']');

    const cmd =
      this.sModulePath +
      ' ' +
      'ENC' +
      ' ' +
      this.sSiteCode +
      ' ' +
      this.sSitePW +
      ' ' +
      sPlaincData;
    console.log(cmd);
    // var child = childProcess.exec(cmd, { encoding: 'euc-kr' });
    const child = childProcess.exec(cmd, { encoding: 'utf-8' });
    // console.log(child);
    child.stdout.on('data', function (data) {
      sEncData += data;
      console.log('##################### DATA #####################');
      console.log(data);
    });
    child.on('close', function () {
      //console.log(sEncData);
      //이곳에서 result처리 해야함.

      //처리 결과 확인
      if (sEncData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류입니다.';
      } else if (sEncData == '-2') {
        sRtnMSG = '암호화 처리 오류입니다.';
      } else if (sEncData == '-3') {
        sRtnMSG = '암호화 데이터 오류 입니다.';
      } else if (sEncData == '-9') {
        sRtnMSG =
          '입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.';
      } else {
        sRtnMSG = '';
      }
      res.render(`checkplus_main.ejs`, { sEncData, sRtnMSG });
    });
  }

  async postCheckplusSuccess(@Req() req, @Res() res) {
    // 공통 함수
    function GetValue(plaindata, key) {
      const arrData = plaindata.split(':');
      let value = '';
      for (let i = 0; i < arrData.length; i++) {
        const item = arrData[i];
        if (item.indexOf(key) == 0) {
          const valLen = parseInt(item.replace(key, ''));
          i++;
          value = arrData[i].substr(0, valLen);
          break;
        }
      }
      return value;
    }

    const sEncData = req.body.EncodeData;
    let cmd = '';

    if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
      const sRtnMSG = '입력값 오류';
      const requestnumber = '';
      const authtype = '';
      const errcode = '';
      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    }

    if (sEncData != '') {
      cmd =
        this.sModulePath +
        ' ' +
        'DEC' +
        ' ' +
        this.sSiteCode +
        ' ' +
        this.sSitePW +
        ' ' +
        sEncData;
    }

    let sDecData = '';

    // let child = childProcess.exec(cmd, { encoding: 'euc-kr' });
    const child = childProcess.exec(cmd, { encoding: 'utf-8' });
    child.stdout.on('data', function (data) {
      sDecData += data;
    });
    child.on('close', function () {
      //console.log(sDecData);

      //처리 결과 메시지
      let sRtnMSG = '';
      //처리 결과 확인
      if (sDecData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류';
      } else if (sDecData == '-4') {
        sRtnMSG = '복호화 처리 오류';
      } else if (sDecData == '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
      } else if (sDecData == '-6') {
        sRtnMSG = '복호화 데이터 오류';
      } else if (sDecData == '-9') {
        sRtnMSG = '입력값 오류';
      } else if (sDecData == '-12') {
        sRtnMSG = '사이트 비밀번호 오류';
      } else {
        //항목의 설명은 개발 가이드를 참조
        const requestnumber = decodeURIComponent(GetValue(sDecData, 'REQ_SEQ')); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        const responsenumber = decodeURIComponent(
          GetValue(sDecData, 'RES_SEQ'),
        ); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
        const authtype = decodeURIComponent(GetValue(sDecData, 'AUTH_TYPE')); //인증수단
        const name = decodeURIComponent(GetValue(sDecData, 'UTF8_NAME')); //이름
        const birthdate = decodeURIComponent(GetValue(sDecData, 'BIRTHDATE')); //생년월일(YYYYMMDD)
        const gender = decodeURIComponent(GetValue(sDecData, 'GENDER')); //성별
        const nationalinfo = decodeURIComponent(
          GetValue(sDecData, 'NATIONALINFO'),
        ); //내.외국인정보
        const dupinfo = decodeURIComponent(GetValue(sDecData, 'DI')); //중복가입값(64byte)
        const conninfo = decodeURIComponent(GetValue(sDecData, 'CI')); //연계정보 확인값(88byte)
        const mobileno = decodeURIComponent(GetValue(sDecData, 'MOBILE_NO')); //휴대폰번호(계약된 경우)
        const mobileco = decodeURIComponent(GetValue(sDecData, 'MOBILE_CO')); //통신사(계약된 경우)
        console.log(sDecData);

        res.render('checkplus_success.ejs', {
          sRtnMSG,
          requestnumber,
          responsenumber,
          authtype,
          name,
          birthdate,
          gender,
          nationalinfo,
          dupinfo,
          conninfo,
          mobileno,
          mobileco,
        });
      }
    });
  }

  async getCheckplusSuccess(@Req() req, @Res() res) {
    // 공통 함수
    function GetValue(plaindata, key) {
      const arrData = plaindata.split(':');
      let value = '';
      for (let i = 0; i < arrData.length; i++) {
        const item = arrData[i];
        if (item.indexOf(key) == 0) {
          const valLen = parseInt(item.replace(key, ''));
          i++;
          value = arrData[i].substr(0, valLen);
          break;
        }
      }
      return value;
    }

    //chrome80 이상 대응
    const sEncData = req.param('EncodeData');
    let cmd = '';

    if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
      const sRtnMSG = '입력값 오류';
      const requestnumber = '';
      const authtype = '';
      const errcode = '';
      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    }

    if (sEncData != '') {
      cmd =
        this.sModulePath +
        ' ' +
        'DEC' +
        ' ' +
        this.sSiteCode +
        ' ' +
        this.sSitePW +
        ' ' +
        sEncData;
    }

    let sDecData = '';

    const child = childProcess.exec(cmd, { encoding: 'utf-8' });
    child.stdout.on('data', function (data) {
      sDecData += data;
    });
    child.on('close', function () {
      //console.log(sDecData);

      let requestnumber; //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
      let responsenumber; //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
      let authtype; //인증수단
      let name; //이름
      let birthdate; //생년월일(YYYYMMDD)
      let gender; //성별
      let nationalinfo; //내.외국인정보
      let dupinfo; //중복가입값(64byte)
      let conninfo; //연계정보 확인값(88byte)
      let mobileno; //휴대폰번호(계약된 경우)
      let mobileco; //통신사(계약된 경우)

      //처리 결과 메시지
      let sRtnMSG = '';
      //처리 결과 확인
      if (sDecData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류';
      } else if (sDecData == '-4') {
        sRtnMSG = '복호화 처리 오류';
      } else if (sDecData == '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
      } else if (sDecData == '-6') {
        sRtnMSG = '복호화 데이터 오류';
      } else if (sDecData == '-9') {
        sRtnMSG = '입력값 오류';
      } else if (sDecData == '-12') {
        sRtnMSG = '사이트 비밀번호 오류';
      } else {
        //항목의 설명은 개발 가이드를 참조
        requestnumber = decodeURIComponent(GetValue(sDecData, 'REQ_SEQ')); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        responsenumber = decodeURIComponent(GetValue(sDecData, 'RES_SEQ')); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
        authtype = decodeURIComponent(GetValue(sDecData, 'AUTH_TYPE')); //인증수단
        name = decodeURIComponent(GetValue(sDecData, 'UTF8_NAME')); //이름
        birthdate = decodeURIComponent(GetValue(sDecData, 'BIRTHDATE')); //생년월일(YYYYMMDD)
        gender = decodeURIComponent(GetValue(sDecData, 'GENDER')); //성별
        nationalinfo = decodeURIComponent(GetValue(sDecData, 'NATIONALINFO')); //내.외국인정보
        dupinfo = decodeURIComponent(GetValue(sDecData, 'DI')); //중복가입값(64byte)
        conninfo = decodeURIComponent(GetValue(sDecData, 'CI')); //연계정보 확인값(88byte)
        mobileno = decodeURIComponent(GetValue(sDecData, 'MOBILE_NO')); //휴대폰번호(계약된 경우)
        mobileco = decodeURIComponent(GetValue(sDecData, 'MOBILE_CO')); //통신사(계약된 경우)
      }
      console.log(sDecData);

      res.render('checkplus_success.ejs', {
        sRtnMSG,
        requestnumber,
        responsenumber,
        authtype,
        name,
        birthdate,
        gender,
        nationalinfo,
        dupinfo,
        conninfo,
        mobileno,
        mobileco,
      });
    });
  }

  async postCheckplusFail(@Req() req, @Res() res) {
    // 공통 함수
    function GetValue(plaindata, key) {
      const arrData = plaindata.split(':');
      let value = '';
      for (let i = 0; i < arrData.length; i++) {
        const item = arrData[i];
        if (item.indexOf(key) == 0) {
          const valLen = parseInt(item.replace(key, ''));
          i++;
          value = arrData[i].substr(0, valLen);
          break;
        }
      }
      return value;
    }

    const sEncData = req.body.EncodeData;
    let cmd = '';

    if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
      const sRtnMSG = '입력값 오류';
      const requestnumber = '';
      const authtype = '';
      const errcode = '';
      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    }

    if (sEncData != '') {
      cmd =
        this.sModulePath +
        ' ' +
        'DEC' +
        ' ' +
        this.sSiteCode +
        ' ' +
        this.sSitePW +
        ' ' +
        sEncData;
    }

    let sDecData = '';

    const child = childProcess.exec(cmd, { encoding: 'utf-8' });
    child.stdout.on('data', function (data) {
      sDecData += data;
    });
    child.on('close', function () {
      //console.log(sDecData);

      let requestnumber; //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
      let authtype; //인증수단
      let errcode; //본인인증 실패 코드

      //처리 결과 메시지
      let sRtnMSG = '';
      //처리 결과 확인
      if (sDecData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류';
      } else if (sDecData == '-4') {
        sRtnMSG = '복호화 처리 오류';
      } else if (sDecData == '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
      } else if (sDecData == '-6') {
        sRtnMSG = '복호화 데이터 오류';
      } else if (sDecData == '-9') {
        sRtnMSG = '입력값 오류';
      } else if (sDecData == '-12') {
        sRtnMSG = '사이트 비밀번호 오류';
      } else {
        //항목의 설명은 개발 가이드를 참조
        requestnumber = decodeURIComponent(GetValue(sDecData, 'REQ_SEQ')); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        authtype = decodeURIComponent(GetValue(sDecData, 'AUTH_TYPE')); //인증수단
        errcode = decodeURIComponent(GetValue(sDecData, 'ERR_CODE')); //본인인증 실패 코드
      }

      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    });
  }

  async getCheckplusFail(@Req() req, @Res() res) {
    // 공통 함수
    function GetValue(plaindata, key) {
      const arrData = plaindata.split(':');
      let value = '';
      for (let i = 0; i < arrData.length; i++) {
        const item = arrData[i];
        if (item.indexOf(key) == 0) {
          const valLen = parseInt(item.replace(key, ''));
          i++;
          value = arrData[i].substr(0, valLen);
          break;
        }
      }
      return value;
    }

    //chrome80 대응
    const sEncData = req.param('EncodeData');
    let cmd = '';

    if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
      const sRtnMSG = '입력값 오류';
      const requestnumber = '';
      const authtype = '';
      const errcode = '';
      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    }

    if (sEncData != '') {
      cmd =
        this.sModulePath +
        ' ' +
        'DEC' +
        ' ' +
        this.sSiteCode +
        ' ' +
        this.sSitePW +
        ' ' +
        sEncData;
    }

    let sDecData = '';

    const child = childProcess.exec(cmd, { encoding: 'utf-8' });
    child.stdout.on('data', function (data) {
      sDecData += data;
    });
    child.on('close', function () {
      //console.log(sDecData);

      let requestnumber; //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
      let authtype; //인증수단
      let errcode; //본인인증 실패 코드

      //처리 결과 메시지
      let sRtnMSG = '';
      //처리 결과 확인
      if (sDecData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류';
      } else if (sDecData == '-4') {
        sRtnMSG = '복호화 처리 오류';
      } else if (sDecData == '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
      } else if (sDecData == '-6') {
        sRtnMSG = '복호화 데이터 오류';
      } else if (sDecData == '-9') {
        sRtnMSG = '입력값 오류';
      } else if (sDecData == '-12') {
        sRtnMSG = '사이트 비밀번호 오류';
      } else {
        //항목의 설명은 개발 가이드를 참조
        requestnumber = decodeURIComponent(GetValue(sDecData, 'REQ_SEQ')); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        authtype = decodeURIComponent(GetValue(sDecData, 'AUTH_TYPE')); //인증수단
        errcode = decodeURIComponent(GetValue(sDecData, 'ERR_CODE')); //본인인증 실패 코드
      }

      res.render('checkplus_fail.ejs', {
        sRtnMSG,
        requestnumber,
        authtype,
        errcode,
      });
    });
  }
}
