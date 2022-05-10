import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebSite } from 'src/app/web-sites/interfaces/web-site';
import { WebPage } from '../../interfaces/web-page';

@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent implements OnInit {

  private webPages : Array<WebPage> = [];
  private formCreate : FormGroup;
  private formEdit : FormGroup;

  constructor( private formBuilder : FormBuilder, private modalService : NgbModal ) { 
    this.laodFormCreate();
  }

  ngOnInit(): void {
    console.log(this.webPages)
  }

  laodFormCreate = () => {
    this.formCreate = this.formBuilder.group({
      idSite : ['dsfsdfdsfsdfdsfdsf', [Validators.required]],
      name   : ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug   : ['', [ Validators.required] ],
      weight : ['', [ Validators.required] ],
      isActive : ['', [ Validators.required] ],
    })
  }

  laodFormEdit = ( webPage : WebPage ) => {
    this.formEdit = this.formBuilder.group({
      idSite : [ webPage.idSite , [Validators.required]],
      name   : [webPage.name, [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug   : [webPage.slug, [ Validators.required] ],
      weight : [webPage.weight, [ Validators.required] ],
      isActive : [webPage.isActive, [ Validators.required] ],
    });
  }

  validateForm = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      console.log( form.value )
      return true;
      
    }
    console.log('Formulario invalido')
    return false;
  }

  create = () => {
    
    const  isValid : boolean = this.validateForm( this.formCreate );

    if ( isValid ) {
      //Metodo para crear paginas webs
    }
  }

  edit = () => {
    
    const  isValid : boolean = this.validateForm( this.formEdit );

    if ( isValid ) {
      //Metodo para editaer paginas webs
    }
  }

  disabled = () => {

  }

  openModal(targetModal: NgbModal, mode: string) {

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',

    });

   
  }

  closeBtnClick() {
    this.modalService.dismissAll();
  }

  

}
