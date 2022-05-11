import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSitesService {

  constructor(private http: HttpClient ) { 

  }

  configUrl = 'https://sepec-backend.herokuapp.com/';
  // port = 443

   getWebSites(from?: number, limit?: number, active?: boolean) {
    return this.http.get(`${this.configUrl}api/v1/website/sites/`);
  }
    // createWebSite(data) {
    // return this.http.post(`${this.configUrl}:${this.port}/api/v1/website/create`, data);
  // }
  //  updateWebSite(data) {
  //   return this.http.post(`${this.configUrl}:${this.port}/api/v1/website/update`, data);
  // }
  //  disableWebSite(data) {
  //   return this.http.post(`${this.configUrl}:${this.port}/api/v1/website/disable`, data);
  // }
}


