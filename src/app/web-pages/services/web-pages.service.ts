import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { WebPage } from '../interfaces/web-page';

@Injectable({
  providedIn: 'root'
})
export class WebPagesService {

  private url : string ="https://sepec-backend.herokuapp.com";

  constructor( private httpClient : HttpClient) {}

  get = () => this.httpClient.get(`${this.url}/api/v1/website/pages/`);

  create = ( webPage : any ) => this.httpClient.post(`${this.url}/api/v1/website/pages/`, webPage);

  getWebSites = () => this.httpClient.get(`${this.url}/api/v1/website/sites/`);

  edit = ( webPage : WebPage ) => this.httpClient.put(`${this.url}/api/v1/website/pages/${webPage.id}`, webPage);
}
