import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Page } from '../interfaces/Page';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})


export class WebPagesService {

  private url : string = environment.api_url;

  constructor( private httpClient : HttpClient) {}

  get = () => this.httpClient.get(`${this.url}/api/v1/website/pages/`);

  create = ( webPage : any ) => this.httpClient.post(`${this.url}/api/v1/website/pages/`, webPage);

  getWebSites = () => this.httpClient.get(`${this.url}/api/v1/website/sites/`);

  edit = ( page : Page ) => this.httpClient.put(`${this.url}/api/v1/website/pages/${page.id}`, page);
}
