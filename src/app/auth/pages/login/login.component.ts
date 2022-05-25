import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin : FormGroup;

  constructor( private formBuilder : FormBuilder, private loginService : LoginService ) { 
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
      this.loginService.login( form.value )
  }

}
