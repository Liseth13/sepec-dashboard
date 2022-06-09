import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
import { Page } from '../../interfaces/Page';
import { Pagination } from '../../../shared/interfaces/Pagination';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';
import { QuillModules } from 'src/app/shared/configs/quillModule';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnChanges {

  @Input() idPage : string = '';
  @Input() pages  : Page[] = [];

  posts : Array<Post> = [];

  paginationPosts = new Pagination();

  formCreate : FormGroup;

  formEdit   : FormGroup;

  public config: PerfectScrollbarConfigInterface = {};

  quillModule : any = QuillModules;

  constructor
  ( 
    private postService : PostsService, 
    private modalSv : NgbModal,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
    this.get();
    this.loadFormCreate();
    this.paginationPosts.pageSize = 3;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if ( this.posts.length > 0 ){
    //   this.getPostsByPage();
    //   return;
    // } 
    this.paginationPosts = new Pagination();
    this.paginationPosts.pageSize = 3;
    this.get();
  } 

  onChangePage = ( page : number ) => {

    this.paginationPosts.page = page;
    this.get();
  }

  loadFormCreate = () => {
    this.formCreate = this.formBuilder.group({
      page_id   : [ this.idPage, [ Validators.required ] ],
      title  : [ '', [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 200 ) ] ],
      slug   : ['prueba' ],
      body   : [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(150000) ] ],
      author : [ '1', [ Validators.required] ]
    });
  }

  loadFormEdit = ( post : Post ) => {
    this.formEdit = this.formBuilder.group({
      id     : [ post?.id || null , [ Validators.required ] ],
      page_id   : [ post?.page_id || null , [ Validators.required ] ],
      title  : [ post?.title || null , [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 200 ) ] ],
      slug   : [ post?.slug || null , [ Validators.required] ],
      body   : [ post?.body || null , [ Validators.required, Validators.minLength(5), Validators.maxLength(150000) ] ],
      author : [ post?.author || null , [ Validators.required ] ],
      is_active : [ post.is_active, [ Validators.required ] ]
    });
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error','Faltan Campos Por Validar','warning');
    return false;
  }

  get( isShowLoading : boolean = false ){
    console.log( this.paginationPosts.status )
    this.postService.get( this.idPage,this.paginationPosts.page, this.paginationPosts.pageSize, this.paginationPosts.status ).subscribe(
    ( res : any ) => { 
      console.log(res)
      this.posts = res.results ;
      this.paginationPosts.collectionSize = res.count;
      
      // this.getPostsByPage();
    },
    ( error : any ) => { this.errorHandler( error ) });
  }

  getPostsByStatus = () => {
    this.paginationPosts.page = 1;
    this.get();
  }

  create = ( form : FormGroup ) => {
    
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.postService.create( form.value ).subscribe(
      ( res : Post ) => {
        //this.posts.push( res ); 
        this.get()
        // this.getPostsByPage( this.paginationPosts.status, this.paginationPosts.page )
        this.closeModals();
        Swal.fire('Exito!', 'Se ha creado el post exitosamente', 'success');
      },  ( error : any ) => { this.errorHandler( error ) });
    }
    
  }

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.postService.edit( form.value ).subscribe( 
      ( res : Post ) => {
        this.onFixPagination( res, 'edit' );
        //this.onFixPagination()
        this.get()
        this.closeModals();
        Swal.fire('Exito!', 'Se ha actualizado el post exitosamente!', 'success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  onFixPagination = ( res : Post, mode? : 'edit' | 'create') => {
    if ( mode === 'create' ){

    }

    if ( mode === 'edit' ) {
      if ( (this.posts.length === 1 && this.paginationPosts.page > 1)){
        if ( res.page_id !== this.idPage || res.is_active !== this.paginationPosts.status ){
          this.paginationPosts.page -- ;
          return;
        }
      }
    }
  }

  openModals = ( target : NgbModal, mode : 'create' | 'edit' | string = 'create', post? : Post ) => {

    if ( mode === 'create' ) {
      this.loadFormCreate();
    }

    if ( mode === 'edit' && post ) {
      this.loadFormEdit( post );
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
