import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Footer } from '../interfaces/footer';

@Injectable({
  providedIn: 'root'
})
export class footerSiteService {

  constructor(private http: HttpClient ) { 

  }

  private api = environment.api_url;
  // port = 443

  get(from?: number, limit?: number, active?: boolean) {
    return this.http.get(`${this.api}/api/v1/website/site/footer/`);
  }

  create(data: any) {
    
    return this.http.post(`${this.api}/api/v1/website/site/footer/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

  }
  
  update( footer : Footer ) {

    return this.http.put(`${this.api}/api/v1/website/site/footer/${footer.id}/`, footer);

  }
}


