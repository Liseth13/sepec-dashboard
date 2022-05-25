import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  saveSesion( user : User ) {
    localStorage.setItem('sepec_session', JSON.stringify(user) );
  }

  removeSesion = () : boolean => {
    localStorage.removeItem( 'sepec_session' );
    return true;
  }

  isAuthenticated = () : boolean => {
    const user : User = JSON.parse(localStorage.getItem('sepec_session'));
    if ( user ) {
      return true;
    }
    return false;
  }
}
