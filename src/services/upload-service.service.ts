import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private cloudName = 'drtxmwrmb'; 
  private apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  private signatureUrl = 'https://localhost:7054/api/cloudinary/generate-signature'; // הכתובת של ה-API ב-C#
  // "CloudName": "drtxmwrmb",
  // "ApiKey": "881122212878697",
  // "ApiSecret": "FNISNl6iafJHwhCJ51USobCbCaY"
  constructor(private http: HttpClient) {}

  uploadPDF(file: File,email:string): Observable<{message:string,path:string}> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<{message:string,path:string}>(`https://localhost:7054/api/cloudinary/upload?email=${email}`, formData);
  }

}
