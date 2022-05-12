import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WebPagesService {

  private url : string ="https://sepec-backend.herokuapp.com";

  constructor( private httpClient : HttpClient) {}

  get = () => this.httpClient.get(`${this.url}/api/v1/website/pages/`);

  create = ( webPage : any ) => this.httpClient.post(`${this.url}/api/v1/webpage/pages/`, webPage);
}
