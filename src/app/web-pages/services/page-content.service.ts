import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageContent } from '../interfaces/PageContent';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class pageContentService {

  private url : string = environment.api_url;

  constructor( private httpClient : HttpClient ) { }

  get = () => this.httpClient.get(`${this.url}/api/v1/website/page/content`);

  create = ( pageContent : any ) => this.httpClient.post(`${this.url}/api/v1/website/page/content/`, pageContent);
  
  edit = ( pageContent : PageContent ) => this.httpClient.put(`${this.url}/api/v1/website/page/content/${pageContent.id}/`, pageContent);
  
}
