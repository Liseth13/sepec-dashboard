import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebPagesService {

  constructor() { }

  create = ( webSite : any ) => {
    console.log(webSite);
  }
}
