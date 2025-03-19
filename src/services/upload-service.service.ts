import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import  apiURL  from '../models/api';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private cloudName = 'drtxmwrmb'; 
  private api:string="";
  // "CloudName": "drtxmwrmb",
  // "ApiKey": "881122212878697",
  // "ApiSecret": "FNISNl6iafJHwhCJ51USobCbCaY"
  constructor(private http: HttpClient) {
    this.api=apiURL+'api/';
 }

  uploadPDF(file: File,email:string): Observable<{message:string,path:string}> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<{message:string,path:string}>(this.api+`cloudinary/upload?email=${email}`, formData);
  }

}
