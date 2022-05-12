import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebSite } from 'src/app/web-sites/interfaces/web-site';
import { WebPage } from '../../interfaces/web-page';
import { WebPagesService } from '../../services/web-pages.service';

@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent implements OnInit {

  public webPages   : Array<WebPage> = [];
  private formCreate : FormGroup;
  private formEdit   : FormGroup;

  constructor
  ( 
    private formBuilder    : FormBuilder, 
    private modalService   : NgbModal, 
    private webPageService : WebPagesService 
  ) { 
    this.laodFormCreate();
  }

  ngOnInit(): void {
    this.get( true );
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
      idSite : [ webPage.site , [Validators.required]],
      name   : [webPage.name, [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug   : [webPage.slug, [ Validators.required] ],
      weight : [webPage.weight, [ Validators.required] ],
      isActive : [webPage.is_active, [ Validators.required] ],
    });
  }

  validateForm = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      console.log( form.value )
      return true;
      
    }
    console.log('Formulario invalido');
    return false;
  }

  get = ( isShowLoading : boolean = false ) => {
    this.webPageService.get().subscribe(
      ( res : any ) => {
        this.webPages = res;
      },
      ( error : any ) => { this.errorHadler( error ) }
    );
  }

  create = () => {
    
    const  isValid : boolean = this.validateForm( this.formCreate );

    if ( isValid ) {
      //Metodo para crear paginas webs
      // this.webPageService.create( this.formCreate.value ).subscribe ( 
      //   ( res : any ) => {
      //     this.webPages = res.pages;
      //   }, 
      //   ( error : any ) => {
      //     console.log(error)
      //   }
      // );

      this.webPages.push( this.formCreate.value );
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
      size : 'md',
      centered: true,
      backdrop: 'static',

    });

   
  }

  closeBtnClick() {
    this.modalService.dismissAll();
  }

  errorHadler = ( error : any ) => {
    console.log(error)
  }

}
