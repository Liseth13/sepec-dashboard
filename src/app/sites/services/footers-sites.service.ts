import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class footerSiteService {

  constructor(private http: HttpClient ) { 

  }

  configUrl = 'https://sepec-backend.herokuapp.com';
  // port = 443

  getFootersSites(from?: number, limit?: number, active?: boolean) {
    return this.http.get(`${this.configUrl}/api/v1/website/site/footer/`);
  }

  createFootersSites(data: any) {
    return this.http.post(`${this.configUrl}/api/v1/website/sites/`, footer);
  }
  
//   updateFootersSites(data: any, websiteId: number) {
//     return this.http.put(`${this.configUrl}/api/v1/website/sites/${websiteId}/`, data);
//   }
}
function footer(arg0: string, footer: any) {
  throw new Error('Function not implemented.');
}

