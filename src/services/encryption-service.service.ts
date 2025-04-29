import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
   key = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012'); // 32 תווים ל-AES-256
   iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16 תווים

  // הצפנה
  encryptData(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); // מחזיר את המידע המוצפן כ־Base64
  }

  // פענוח
  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8); // מחזיר את המידע המפוענח כ־string
  }
}
