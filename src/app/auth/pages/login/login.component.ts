import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin : FormGroup;

  constructor( private formBuilder : FormBuilder, private loginService : LoginService, private router : Router ) { 
    this.loadForms();
  }

  ngOnInit(): void {
  }

  loadForms = () => {
    this.formLogin = this.formBuilder.group({
      email : [ '', [ Validators.required ] ],
      password : [ '', [ Validators.required ] ]
    });
  }

  login = ( form : FormGroup ) => {
    const isLogin : boolean = this.loginService.login( form.value );
    if ( isLogin ) {
      this.router.navigate(['dash/']);
      return;
    }
    Swal.fire('Error!', 'Usuario o contraseña invalidos','error');
  }

}
