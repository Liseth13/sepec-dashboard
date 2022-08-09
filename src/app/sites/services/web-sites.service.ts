import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class WebSitesService {

  constructor(private http: HttpClient ) { 

  }

  private url = environment.api_url;
  // port = 443

  get() {
    return this.http.get(`${this.url}/api/v1/website/sites/`);
  }

  create( data : any ) {
    return this.http.post(`${this.url}/api/v1/website/sites/`, data);
  }
  
  update( site : any ) {
    return this.http.put(`${this.url}/api/v1/website/sites/${site.id}/`, site);
  }
}


