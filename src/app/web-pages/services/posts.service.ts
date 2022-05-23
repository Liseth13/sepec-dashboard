import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private url : string ="https://sepec-backend.herokuapp.com";

  constructor( private httpClient : HttpClient ) { }

  get = () => this.httpClient.get(`${this.url}/api/v1/website/posts/`);

  create = ( post : any ) => this.httpClient.post(`${this.url}/api/v1/website/posts/`, post );

  edit = ( post : Post ) => this.httpClient.put(`${this.url}/api/v1/website/posts/${post.id}/`, post);
}
