import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class menuService {

  constructor(private http: HttpClient ) { 

  }

  //headers = new HttpHeaders();
 

  configUrl = 'https://sepec-backend.herokuapp.com';
  // port = 443

  get = () => this.http.get(`${this.configUrl}/api/v1/website/menus/`);
  

  createMenu(data: any) {
    
    return this.http.post(`${this.configUrl}/api/v1/website/menus/`, data, {headers: {'Content-Type': 'application/json; charset=utf-8'}});

  }
  
  updateMenu(data: any, menuId: number) {

    return this.http.put(`${this.configUrl}/api/v1/website/menus/${menuId}/`, data);

  }
}