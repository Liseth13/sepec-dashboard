import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient ) { 

  }


configUrl = 'https://sepec-backend.herokuapp.com';
// port = 443

getBanner(from?: number, limit?: number, active?: boolean) {
  return this.http.get(`${this.configUrl}/api/v1/website/banners/`);
  
}

createBanner(data: any) {
  return this.http.post(`${this.configUrl}/api/v1/website/banners/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

}

updateBanner(data: any, webBanner: number) {
  return this.http.put(`${this.configUrl}/api/v1/website/banners/5/${webBanner}/`, data);

}
}