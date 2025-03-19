import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root' // 👈 הופך את השירות לזמין לכל האפליקציה
})

export class EncryptionService {
  private secretKey = 'MySecretKey123!'; // 🔑 מפתח סודי (לשמור בסביבה מאובטחת!)

  // הצפנה
  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // פענוח
  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
