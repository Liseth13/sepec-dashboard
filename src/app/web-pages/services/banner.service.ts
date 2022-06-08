import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banner } from '../interfaces/banner';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient ) { 

  }


configUrl = 'https://sepec-backend.herokuapp.com';
// port = 443

getBanner() {
  return this.http.get(`${this.configUrl}/api/v1/website/banners/`);
  
}

createBanner(data: any) {
  return this.http.post(`${this.configUrl}/api/v1/website/banners/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

}

updateBanner(banner: Banner) {
  return this.http.put(`${this.configUrl}/api/v1/website/banners/${banner.id}/`, banner);

}
}