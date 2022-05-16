import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { WebPage } from '../../interfaces/web-page';
import { WebPagesService } from '../../services/web-pages.service';

@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent implements OnInit {

  public  webPages   : Array<WebPage> = [];
  public webSites    : Array<any> = [];
  private formCreate : FormGroup;
  private formEdit   : FormGroup;
  sidebarMode : string = 'create';

  //Paginación

  paginationPages : any = {
    page : 1,
    pageSize :16,
    collectionSize : 0,
    _searchTerm : ''
  }

  paginacionSites: any = {
    page : 1,
    pageSize :7,
    collectionSize : 0,
    _searchTerm : ''
  }
 
  
  //selectedST: TaskSection | undefined = Object.create(null);

  constructor
  ( 
    private formBuilder    : FormBuilder, 
    private modalService   : NgbModal, 
    private webPageService : WebPagesService
  ) { 
    this.loadFormCreate();
    
  }

  ngOnInit(): void {
    this.get( true );
    this.getWebSites();
  }

  loadFormCreate = () => {
    this.formCreate = this.formBuilder.group({
      site   : [null, [Validators.required]],
      name   : ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug   : ['', [ Validators.required] ],
      weight : ['', [ Validators.required] ],
    })
  }

  loadFormEdit = ( webPage : WebPage ) => {
    this.formEdit = this.formBuilder.group({
      site     : [webPage.site , [Validators.required]],
      id       : [webPage.id, [Validators.required]],
      name     : [webPage.name, [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug     : [webPage.slug, [ Validators.required] ],
      weight   : [webPage.weight, [ Validators.required] ],
      is_active : [webPage.is_active, [ Validators.required] ],
    });
  }

  validateForm = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error!', 'Los campos del formulario no son validos','error');
    return false;
  }

  get = ( isShowLoading : boolean = false ) => {
    this.webPageService.get().subscribe(
      ( res : WebPage[] ) => {
        this.webPages = res;
        this.paginationPages.collectionSize = this.webPages.length;
      },
      ( error : any ) => { this.errorHandler( error ) }
    );
  }

  getWebSites = () => {
    this.webPageService.getWebSites().subscribe(
      ( res : any ) => {
        this.webSites = res;
        this.paginacionSites.collectionSize = this.webSites.length;
      },
      ( error : any ) => { this.errorHandler( error ) }
    );
  }

  create = () => {
    
    const  isValid : boolean = this.validateForm( this.formCreate );

    if ( isValid ) {
     this.webPageService.create( this.formCreate.value ).subscribe(
       ( res : WebPage ) => {
        this.webPages.push( res );
        this.closeRightSidebar();
        Swal.fire('Exito!', 'La página se ha creado exitosamente', 'success');
        
       }
     ), ( error : any ) => { this.errorHandler( error ) }
     
    }
  }

  edit = () => {
    console.log(this.formEdit );
    const  isValid : boolean = this.validateForm( this.formEdit );
    if ( isValid ) {
      this.webPageService.edit( this.formEdit.value ).subscribe( 
        ( res : WebPage ) => {
          this.webPages = this.webPages.map( ( page : WebPage) => page.id === res.id ? { ...res } : page );
          this.closeRightSidebar();
          Swal.fire('Exito!', 'La página se ha creado exitosamente', 'success');
        },
        ( error : any ) => { this.errorHandler( error ) }
      );
    }
  }

  push = ( webPage : WebPage ) => {
    //this.webPages.map( ( page : WebPage ) => page.id === res.id);
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

  closeModals = () => {
    this.modalService.dismissAll();
  }

  openRightSidebar( mode: string, page? : WebPage ) {
    this.sidebarMode = mode;
    if ( mode === 'edit' && page ){
      this.sidebarMode = mode;
      this.loadFormEdit( page );
    } else if ( mode === 'create' ) {
      this.sidebarMode = mode;
      this.formCreate.reset();
    } else {
      return;
    }

    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    if ( rightMenu.style.width === '285px' ) {
        this.closeRightSidebar();
        return;
    }
    rightMenu.style.width = '285px';
  }

  selectSite = ( form : FormGroup, idSite : string ) => {
    form.controls['site'].setValue( idSite ) ;
    this.closeModals();
    console.log(form);
  }

  closeRightSidebar() {
    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    rightMenu.style.width = '0px';
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

}
