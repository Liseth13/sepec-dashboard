import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import { WebPagesService } from 'src/app/web-pages/services/web-pages.service';
import Swal from 'sweetalert2';
import { Banner } from '../../interfaces/banner';
import { Page } from '../../interfaces/Page';
import { BannerService }  from '../../services/banner.service'

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  public pages   : Array <Page> = [];
  public banners : Array <Banner> = [];
  public bannersForTable : Array <Banner> = [];
  public formCreate : FormGroup;
  private formEdit  : FormGroup;

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';
  sidebarMode : 'create' | 'edit' | string = 'create';

  //Paginación
  pagBanners = new Pagination();
  pagPages   = new Pagination();

  constructor(

    private formBuilder : FormBuilder, private BannerService: BannerService,
    private modalService: NgbModal, private webPagesService: WebPagesService,

  ) {
    this.loadFormCreate();
  }

  ngOnInit(): void {
    this.get( true );
    this.getPages();
  }

  loadFormCreate(){
    this.formCreate = this.formBuilder.group({ 
      page:['',[Validators.required]],
      name:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
    })
  
  }

  loadFormEdit( banner : Banner ){
    this.formEdit = this.formBuilder.group({
      id  : [ banner.id || null, [ Validators.required ] ],
      page:[banner.page || null,[Validators.required]],
      name:[banner.name || null,[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      is_active:[banner.is_active,[Validators.required,]],
    })
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error','Faltan Campos Por Validar','warning');
    return false;
  };

  get = ( isShowLoading : boolean = false ) =>{

    if ( isShowLoading ) {
      Swal.fire({
        title: 'Cargando',
        html: 'Por favor espera un momento...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
    }
    
    this.BannerService.getBanner()
    .subscribe({ 
      next : ( res : Banner[] ) => {
        this.banners = res;
        this.showBanners( this.tableMode );
      },
      error : ( error : any ) => { this.errorHandler( error ) },
      complete : () => { isShowLoading && Swal.close() }
    });
  }

  create = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      this.BannerService.createBanner( form.value )
      .subscribe({
        next : () => {
          this.get();
          this.closeRightSidebar();
          Swal.fire('Exito!', 'Banner creado exitosamente', 'success');
        },
        error : ( error : any ) => { this.errorHandler( error ) }
      });
    }
  }

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.BannerService.updateBanner( form.value )
      .subscribe({
        next : () => {
          this.get();
          this.closeRightSidebar();
          Swal.fire(' Success','Editado correctamente','success');
        },
        error : ( error : any ) => { this.errorHandler( error ) }
      });
    }
  }

  getPages = () =>{
    this.webPagesService.get()
    .subscribe({
      next  : ( res : Page[] ) => { 
        this.pages = res;
        this.pagPages.collectionSize = res.length;
      },
      error : ( error : any ) => { this.errorHandler( error ) }
    });
  }

  showBanners = ( mode : string ) => {

    if ( mode === 'all' ) {
      this.bannersForTable = this.banners;
    }

    if ( mode === 'actives' ){
      this.bannersForTable = this.banners.filter((b:Banner) => b.is_active);
    }

    if ( mode === 'inactives' ){
      this.bannersForTable = this.banners.filter((b:Banner) => !b.is_active);
    }

    this.pagBanners.collectionSize = this.bannersForTable.length;
    this.pagBanners.page = 1;
    this.tableMode = mode;
  }

  openRightSidebar( mode: string, banner? : Banner ) {
    if ( mode === 'edit' && banner ){
      this.sidebarMode = mode;
      this.loadFormEdit( banner );
    } else if ( mode === 'create' ) {
      this.sidebarMode = mode;
      this.loadFormCreate();
    } else {
      this.sidebarMode = 'create';
      return;
    }

    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    
    if ( rightMenu.style.width === '285px' ) {
      this.closeRightSidebar();
      return;
    }
    rightMenu.style.width = '285px';
  }

  closeRightSidebar() {
    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    rightMenu.style.width = '0px';
  }

  openModal( targetModal: NgbModal, size : string = 'md', ) {  
    this.modalService.open( targetModal , {
      size : size ,
      centered: true,
      backdrop: 'static',
    });
  }

  closeModals = () => {
    this.modalService.dismissAll();
  }

  selectPage = ( form : FormGroup, page : Page ) => {
    form.get('page').setValue(page?.id || '');
    this.closeModals();
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

}
