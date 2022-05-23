import { Component, ComponentRef, ElementRef, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
// import { PageContentManagerComponent } from '../../components/page-content-manager/page-content-manager.component';
import { Page } from '../../interfaces/Page';
import { PageContent } from '../../interfaces/PageContent';
import { Pagination } from '../../interfaces/pagination';
import { pageContentService } from '../../services/page-content.service';
import { WebPagesService } from '../../services/web-pages.service';

@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent implements OnInit {

  public  webPages : Array<Page> = [];

  public webPagesFilter : Array<Page> = [];

  //ARREGLO DE TODOS LOS SITIOS
  public  webSites  : Array<any> = [];

  //FORMULARIOS DE PÁGINAS
  private formCreate : FormGroup;
  private formEdit   : FormGroup;

  showMode : 'contents' | 'posts' | string = '' ;

  sidebarMode : 'create' | 'edit' | string = 'create';

  idPageSelected : string = '';

  //Paginación
  paginationPages = new Pagination();
  paginacionSites = new Pagination();

  // TEMPLATE
  public showSidebar = false;
  public config: PerfectScrollbarConfigInterface = {};
 
  
  //selectedST: TaskSection | undefined = Object.create(null);

  constructor
  ( 
    private formBuilder    : FormBuilder, 
    private modalService   : NgbModal, 
    private webPageService : WebPagesService,
    private pageContentService : pageContentService
  ) { 

    //this.modalPageContentManager = PageContentManagerComponent
    this.loadFormCreate();
    //console.log(this.modalPageContentManager.getId())
    // this.contentManager.getId()
  }

  ngOnInit(): void {
    this.get( this.paginationPages.status );
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

  loadFormEdit = ( webPage : Page ) => {
    this.formEdit = this.formBuilder.group({
      site     : [webPage.site , [Validators.required]],
      id       : [webPage.id, [Validators.required]],
      name     : [webPage.name, [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] ],
      slug     : [webPage.slug, [ Validators.required] ],
      weight   : [webPage.weight, [ Validators.required] ],
      is_active : [webPage.is_active, [ Validators.required] ],
    });
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error!', 'Los campos del formulario no son validos','error');
    return false;
  }

  get = ( isShowLoading : boolean = false ) => {
    this.webPageService.get().subscribe(
      ( res : Page[] ) => {
        this.webPages = res;
        this.paginationPages.collectionSize = this.webPages.length;
        this.showPages( this.paginationPages.status );
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

  create = ( form : FormGroup ) => {
    const  isValid : boolean = this.validateForms( this.formCreate );
    if ( isValid ) {
     this.webPageService.create( this.formCreate.value ).subscribe(
       ( res : Page ) => {
        this.webPages.push( res );
        this.closeRightSidebar();
        Swal.fire('Exito!', 'La página se ha creado exitosamente', 'success');
        
       }
     ), ( error : any ) => { this.errorHandler( error ) }
    }
  }


  edit = ( form : FormGroup ) => {
    const  isValid : boolean = this.validateForms( this.formEdit );
    if ( isValid ) {
      this.webPageService.edit( this.formEdit.value ).subscribe( 
        ( res : Page ) => {
          this.webPages = this.webPages.map( ( page : Page) => page.id === res.id ? { ...res } : page );
          this.showPages(this.paginationPages.status, this.paginationPages.page );
          this.closeRightSidebar();
          Swal.fire('Exito!', 'Datos actualizados exitosamente', 'success');
        },
        ( error : any ) => { this.errorHandler( error ) }
      );
    }
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


  openRightSidebar( mode: string, page? : Page ) {
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
  }

  closeRightSidebar() {
    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    rightMenu.style.width = '0px';
  }

  errorHandler = ( error : any ) => {
    console.log( error )
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }


  showData = ( pageId : string, mode : 'contents' | 'posts' | string  ) => {
    if ( mode === 'contents' || mode === 'posts' ){
      if ( pageId === '' ) {
        return;
      }

      this.showMode = mode;
      this.idPageSelected = pageId;
    }

    console.log(this.showMode)
  }

  showPages = ( status : boolean = true, page : number = 1 ) => {
    this.idPageSelected = '';
    this.webPagesFilter = this.webPages.filter(p => p.is_active === status);
    if ( this.webPagesFilter.length > 0 ) {
      this.paginationPages.status = status;
      this.paginationPages.collectionSize = this.webPagesFilter.length;
      this.paginationPages.page = page;
      return;
    }

    this.paginationPages = new Pagination();
  }

}
 