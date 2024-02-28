import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'dotenv/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL: string;
  
  constructor(private http: HttpClient) {
    this.API_URL = process.env['API_URL'] || '';
   }

  getData() {
    return this.http.get<any>(this.API_URL);
  }
}
