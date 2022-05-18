import { Component, ComponentRef, ElementRef, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
// import { PageContentManagerComponent } from '../../components/page-content-manager/page-content-manager.component';
import { WebPage } from '../../interfaces/web-page';
import { ContentPagesService } from '../../services/content-pages.service';
import { WebPagesService } from '../../services/web-pages.service';

@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent implements OnInit {

  public  webPages       : Array<WebPage> = [];
  public webPagesFilter : Array<WebPage> = [];
  public  webSites   : Array<any>     = [];
  public contentsPages: Array<any>    = [];
  public showContentsPage : Array<any> = [];
  private formCreate : FormGroup;
  private formEdit   : FormGroup;

  //private modalPageContentManager  ;

  //  public contentManager : PageContentManagerComponent;

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

  // TEMPLATE
  public showSidebar = false;
  public config: PerfectScrollbarConfigInterface = {};
 
  
  //selectedST: TaskSection | undefined = Object.create(null);

  constructor
  ( 
    private formBuilder    : FormBuilder, 
    private modalService   : NgbModal, 
    private webPageService : WebPagesService,
    private contentPageService : ContentPagesService
  ) { 

    //this.modalPageContentManager = PageContentManagerComponent
    this.loadFormCreate();
    //console.log(this.modalPageContentManager.getId())
    // this.contentManager.getId();
  }

  ngOnInit(): void {
    this.get( true );
    this.getContentPages();
    this.getWebSites();
    
  }

  mobileSidebar() {
    this.showSidebar = !this.showSidebar;
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
        this.pagesStatusChanged( true );
      },
      ( error : any ) => { this.errorHandler( error ) }
    );
  }

  getContentPages = () => {
    this.contentPageService.get().subscribe(
      ( res : any ) => { this.contentsPages = res;},
      ( error : any ) => { this.errorHandler( error )}
    )
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

  disabled = () => {  }

  openModal(targetModal: NgbModal, size : string = 'md') {
    this.modalService.open(targetModal, {
      size : size ,
      centered: true,
      backdrop: 'static',
    });
  }

  openContentManager = ( targetModal : NgbModal , pageId : string ) => {
    this.openModal( targetModal, 'lg' );
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

  pageSelected = ( page : WebPage ) => {
    //console.log(page) ;

    this.showContentsPage = this.contentsPages.filter( c => c.page === page.id );
    console.log(page.id);
  }

  pagesStatusChanged = ( status : boolean = true ) => {
    this.webPagesFilter = this.webPages.filter(p => p.is_active === status);
    this.paginationPages.collectionSize = this.webPagesFilter.length;
    this.paginationPages.page = 1;
  }
}
