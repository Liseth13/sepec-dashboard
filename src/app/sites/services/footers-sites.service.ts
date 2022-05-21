import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class footerSiteService {

  constructor(private http: HttpClient ) { 

  }

  //headers = new HttpHeaders();
 

  configUrl = 'https://sepec-backend.herokuapp.com';
  // port = 443

  getFootersSites(from?: number, limit?: number, active?: boolean) {
    return this.http.get(`${this.configUrl}/api/v1/website/site/footer/`);
  }

  createFootersSites(data: any) {
    
    return this.http.post(`${this.configUrl}/api/v1/website/site/footer/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

  }
  
  updateFootersSites(data: any, webFooterId: number) {

    return this.http.put(`${this.configUrl}/api/v1/website/site/footer/${webFooterId}/`, data);

  }
}


