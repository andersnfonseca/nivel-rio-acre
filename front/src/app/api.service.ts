import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'dotenv/config';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL: string;
  
  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
   }

  getData() {
    return this.http.get<any>(this.API_URL);
  }
}
