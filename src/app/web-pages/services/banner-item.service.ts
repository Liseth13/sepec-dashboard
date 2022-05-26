import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BannerItemService {

  constructor(private http: HttpClient ) { 

  }


configUrl = 'https://sepec-backend.herokuapp.com';
// port = 443

getItemBanner(from?: number, limit?: number, active?: boolean) {
  return this.http.get(`${this.configUrl}/api/v1/website/bannersitems/`);
  
}

createItemBanner(data: any) {
  return this.http.post(`${this.configUrl}/api/v1/website/bannersitems/`, data);
}

 updateItemBanner(data: any, weBanner: number) {
  return this.http.put(`${this.configUrl}/api/v1/website/bannersitems/${weBanner}/`, data);
}
}