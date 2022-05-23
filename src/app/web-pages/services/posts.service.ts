import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private url : string ="https://sepec-backend.herokuapp.com";

  constructor( private httpClient : HttpClient ) { }

  get = () => this.httpClient.get(`${this.url}/api/v1/website/posts/`);
}
