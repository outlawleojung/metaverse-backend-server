import * as CryptoJS from 'crypto-js';
import { config } from 'dotenv';

config();

const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY); // 32자리 키
const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV);

type Data = {
  [key: string]: string;
};

export const Encrypt = (data: string | Data) => {
  if (typeof data === 'string') {
    if (data) {
      const srcs = CryptoJS.enc.Utf8.parse(data);
      return CryptoJS.AES.encrypt(srcs, key, {
        keySize: 256 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
    }
  } else if (typeof data === 'object') {
    for (const _o in data) {
      if (data[_o]) {
        const srcs = CryptoJS.enc.Utf8.parse(data[_o]);
        data[_o] = CryptoJS.AES.encrypt(srcs, key, {
          keySize: 256 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
      }
    }
  }
  return data;
};
export const Decrypt = (data: string | Data) => {
  if (typeof data === 'string') {
    return CryptoJS.AES.decrypt(data, key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  } else if (typeof data === 'object') {
    for (const _o in data) {
      if (data[_o]) {
        const srcs = data[_o];
        data[_o] = CryptoJS.AES.decrypt(srcs, key, {
          keySize: 256 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);
      }
    }
    return data;
  }
};
