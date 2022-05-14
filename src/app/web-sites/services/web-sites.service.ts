import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSitesService {

  constructor(private http: HttpClient ) { 

  }

  configUrl = 'https://sepec-backend.herokuapp.com';
  // port = 443

  getWebSites(from?: number, limit?: number, active?: boolean) {
    return this.http.get(`${this.configUrl}/api/v1/website/sites/`);
  }

  createWebSite(data: any) {
    return this.http.post(`${this.configUrl}/api/v1/website/sites/`, data);
  }
  
  updateWebSite(data: any, websiteId: number) {
    return this.http.put(`${this.configUrl}/api/v1/website/sites/${websiteId}/`, data);
  }
}


