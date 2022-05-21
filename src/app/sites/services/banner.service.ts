import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class bannerService {

  constructor(private http: HttpClient ) { 

  }


configUrl = 'https://sepec-backend.herokuapp.com';
// port = 443

getBanner(from?: number, limit?: number, active?: boolean) {
  return this.http.get(`${this.configUrl}/api/v1/website/bannersitems/`);
  
}

createBanner(data: any) {
  return this.http.post(`${this.configUrl}/api/v1/website/bannersitems/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

}

updateBanner(data: any, webBanner: number) {
  return this.http.put(`${this.configUrl}/api/v1/website/bannersitems/5/${webBanner}/`, data);

}
}