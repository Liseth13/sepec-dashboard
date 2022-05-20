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

  public  webPages       : Array<Page> = [];
  public webPagesFilter : Array<Page> = [];

  //ARREGLO DE TODOS LOS SITIOS
  public  webSites   : Array<any> = [];

  //ARREGLOS CON CONTENIDO DE PÁGINAS
  public allPageContents: Array<PageContent> = [];
  public pageContentsFilter: Array<PageContent> = [];
  public contentsByPage : Array<any> = [];

  //fORMULARIOS DE CONTENIDO DE PÁGINAS
  private formCreatePageContent : FormGroup;
  private formEditPageContent   : FormGroup;

  //FORMULARIOS DE PÁGINAS
  private formCreate : FormGroup;
  private formEdit   : FormGroup;

  // pages : WebPage;

  

  //private modalPageContentManager  ;

  //  public contentManager : PageContentManagerComponent;

  sidebarMode : 'create' | 'edit' | string = 'create';

  idPageSelected : string = '';

  //Paginación
  paginationPages = new Pagination();
  paginacionSites = new Pagination();
  paginationContentPage = new Pagination();

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
    this.loadFormCreatePageContent();
    //console.log(this.modalPageContentManager.getId())
    // this.contentManager.getId()
  }

  ngOnInit(): void {
    this.get( this.paginationPages.status );
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

  loadFormCreatePageContent = ( pageId : string = '' ) => {
    this.formCreatePageContent = this.formBuilder.group({
      page      : [ pageId , [Validators.required ] ],
      body      : [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(100) ] ],
      is_active : ['', [ Validators.required ] ]
    });
  }

  loadFormEditPageContent = ( pageContent : PageContent ) => {
    this.formEditPageContent = this.formBuilder.group({
      id        : [ pageContent.id, [ Validators.required ] ],
      page      : [ pageContent.page , [Validators.required ] ],
      body      : [ pageContent.body, [ Validators.required, Validators.minLength(5), Validators.maxLength(100) ] ],
      is_active : [ pageContent.is_active, [ Validators.required ] ]
    });
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

  getContentPages = () => {
    this.pageContentService.get().subscribe(
      ( res : any ) => { this.allPageContents = res;},
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

  createPageContent = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( this.formCreatePageContent );
    if ( isValid ) {
      this.pageContentService.create( this.formCreatePageContent.value ).subscribe(
      ( res : any ) => {
        this.allPageContents.push( res );
        this.showContents( this.idPageSelected, this.paginationContentPage.status, this.paginationContentPage.page );
        this.closeModals();
      },
      ( error : any ) => { this.errorHandler( error ) });
    }
    console.log(this.formCreatePageContent.value)
    //this.contentPageService.
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

  editPageContent( form : FormGroup ) {
    console.log(form.value)
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      //
      this.pageContentService.edit( form.value ).subscribe(
      ( res : PageContent ) => {
        this.allPageContents = this.allPageContents.map( ( content : PageContent) => content.id === res.id ? { ...res } : content );
        this.showContents(this.idPageSelected, this.paginationContentPage.status, this.paginationContentPage.page);
        Swal.fire('Exito!', 'Datos actualizados exitosamente', 'success');
        this.closeModals();
      },
      ( error : any ) => { this.errorHandler( error )});
    }
  }

  push = ( webPage : Page ) => {
    //this.webPages.map( ( page : WebPage ) => page.id === res.id);
  }

  disabled = () => {  }

  openModal( targetModal: NgbModal, size : string = 'md', mode : 'createContent' | 'editContent' | string = '', data? : any) {
    
    if ( mode === 'createContent' ) {
      this.loadFormCreatePageContent( this.idPageSelected );
    }

    if ( mode === 'editContent' && data ) {
      this.loadFormEditPageContent( data );
    } 
    
    this.modalService.open( targetModal , {
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


  showContents = ( pageId : string, status : boolean = true, page : number = 1   ) => {
    this.idPageSelected = pageId;
    this.contentsByPage = this.allPageContents.filter( c => c.page === pageId && c.is_active === status );
    
    if ( this.contentsByPage.length > 0 ) {
      this.paginationContentPage.page = page;
      this.paginationContentPage.status = status;
      this.paginationContentPage.collectionSize = this.contentsByPage.length;
      console.log(status)
      return;
    }

    this.paginationContentPage = new Pagination();
  }

  showPages = ( status : boolean = true, page : number = 1 ) => {
    this.idPageSelected = '';
    this.webPagesFilter = this.webPages.filter(p => p.is_active === status);
    if ( this.webPagesFilter.length > 0 ) {
      this.paginationPages.status = status;
      this.paginationPages.collectionSize = this.webPagesFilter.length;
      this.paginationPages.page = page;
    }
  }

}
 