import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class BannerItemService {

  constructor(private http: HttpClient ) { 

  }

private url = environment.api_url;
// port = 443

getItemBanner(from?: number, limit?: number, active?: boolean) {
  return this.http.get(`${this.url}/api/v1/website/bannersitems/`);
  
}

createItemBanner( itemBanner : FormData ) {
  return this.http.post(`${this.url}/api/v1/website/bannersitems/`, itemBanner);
}

 updateItemBanner(itemBanner : FormData, id : string ) {
  return this.http.put(`${this.url}/api/v1/website/bannersitems/${id}/`, itemBanner);
}
}