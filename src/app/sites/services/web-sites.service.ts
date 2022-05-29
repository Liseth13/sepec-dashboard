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

  get() {
    return this.http.get(`${this.configUrl}/api/v1/website/sites/`);
  }

  create( data : any ) {
    return this.http.post(`${this.configUrl}/api/v1/website/sites/`, data);
  }
  
  update( site : any ) {
    return this.http.put(`${this.configUrl}/api/v1/website/sites/${site.id}/`, site);
  }
}


