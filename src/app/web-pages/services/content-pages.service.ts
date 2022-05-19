import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentPagesService {

  private url : string = 'https://sepec-backend.herokuapp.com';

  constructor( private httpClient : HttpClient ) { }

  get = () => this.httpClient.get(`${this.url}/api/v1/website/page/content`);
  create = ( pageContent : any ) => this.httpClient.post(`${this.url}/api/v1/website/page/content/`, pageContent);
  
}
