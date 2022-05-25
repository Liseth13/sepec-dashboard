import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserLogin } from '../interfaces/userLogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user : User = { id : '1', name : 'sepec', email : 'admin@sepec.com', password : 'sepec12345' } ;

  constructor( private httpClient : HttpClient, private authService : AuthService ) {}

  login = ( data : UserLogin ) : boolean => {
    if ( data.email === this.user.email && data.password === this.user.password ) {
      this.authService.saveSesion( this.user );
      return true;
    }
    return false;
  }
}
