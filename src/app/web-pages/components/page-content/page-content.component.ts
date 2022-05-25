import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
import { Page } from '../../interfaces/Page';
import { PageContent } from '../../interfaces/PageContent';
import { Pagination } from '../../../shared/interfaces/Pagination';
import { pageContentService } from '../../services/page-content.service';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss']
})
export class PageContentComponent implements OnInit, OnChanges {

  @Input() idPage : string = '';
  @Input() pages : Page[] = [];

  contents : Array<PageContent> = [];

  contentsByPage : Array<PageContent> = [];

  paginationContentPage = new Pagination();

  public config: PerfectScrollbarConfigInterface = {};

  //fORMULARIOS DE CONTENIDO DE PÁGINAS
  formCreate : FormGroup;
  formEdit   : FormGroup;

  constructor
  ( 
    private formBuilder        : FormBuilder, 
    private modalSv            : NgbModal, 
    private pageContentService : pageContentService 
  ) { 
    this.loadFormCreate();
  }

  ngOnInit(): void {
    this.get();
    this.paginationContentPage.pageSize = 3;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if ( this.contents.length > 0 ) {
      this.getContentsByPage();
    }

    this.get();
  }

  loadFormCreate= ( ) => {
    this.formCreate = this.formBuilder.group({
      page      : [ this.idPage , [Validators.required ] ],
      body      : [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(15000) ] ],
      is_active : ['', [ Validators.required ] ]
    });
  }

  loadFormEdit = ( pageContent : PageContent ) => {
    this.formEdit = this.formBuilder.group({
      id        : [ pageContent.id, [ Validators.required ] ],
      page      : [ pageContent.page , [Validators.required ] ],
      body      : [ pageContent.body, [ Validators.required, Validators.minLength(5), Validators.maxLength(15000) ] ],
      is_active : [ pageContent.is_active, [ Validators.required ] ]
    });
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error!', 'Los campos del formulario no son validos','error');
    return false;
  }

  get = () => {
    this.pageContentService.get().subscribe(
    ( res : PageContent[] ) => {
      this.contents = res;
      this.getContentsByPage();
    }, ( error : any ) => { this.errorHandler( error )});
  }

  getContentsByPage = ( status : boolean = true, page : number = 1 ) => {
    this.paginationContentPage.status = status;

    if ( this.contents.length > 0 ) {
      this.contentsByPage = this.contents.filter( c => c.page === this.idPage && c.is_active === status);
      this.paginationContentPage.collectionSize = this.contentsByPage.length;
      this.paginationContentPage.page = page;
      return;
    }
    this.paginationContentPage.collectionSize = 0;
    this.paginationContentPage.page = page;
  }

  create = ( form : FormGroup ) => {
    console.log(form.value)
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.pageContentService.create( form.value ).subscribe(
      ( res : PageContent ) => {
        this.contents.push( res ); 
        this.getContentsByPage( this.paginationContentPage.status, this.paginationContentPage.page )
        this.closeModals();
        Swal.fire('Exito!', 'Se ha creado el post exitosamente', 'success');
      }, 
      ( error : any ) => { this.errorHandler( error ) });
    }
  }

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.pageContentService.edit( form.value ).subscribe( 
      ( res : PageContent ) => {
        this.contents = this.contents.map( ( c : PageContent) => c.id === res.id ? { ...res } : c );
        this.getContentsByPage(this.paginationContentPage.status, this.paginationContentPage.page)
        this.closeModals();
        Swal.fire('Exito!', 'Se ha actualizado el post exitosamente!', 'success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  openModals( target: NgbModal , mode : 'create' | 'edit' | string = '', content? : PageContent ) {
    
    if ( mode === 'create' ) {
      this.loadFormCreate();
    }

    if ( mode === 'edit' && content ) {
      this.loadFormEdit( content );
    } 
    
    this.modalSv.open( target , {
      size : 'lg' ,
      centered: true,
      backdrop: 'static',
    });
  }

  closeModals = () => {
    this.modalSv.dismissAll();
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

}
