import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class menuService {

  constructor(private http: HttpClient ) { 

  }

  //headers = new HttpHeaders();
 

  private api = environment.api_url;
  // port = 443

  get = () => this.http.get(`${this.api}/api/v1/website/menus/`);
  

  createMenu(data: any) {
    
    return this.http.post(`${this.api}/api/v1/website/menus/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

  }
  
  updateMenu(data: any, menuId: number) {

    return this.http.put(`${this.api}/api/v1/website/menus/${menuId}/`, data);

  }

  getWebSites = () => this.http.get(`${this.api}/api/v1/website/sites/`);
  
}