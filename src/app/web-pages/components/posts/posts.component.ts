import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { is } from 'date-fns/locale';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
import { Page } from '../../interfaces/Page';
import { Pagination } from '../../interfaces/pagination';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnChanges {

  @Input() idPage : string = '';
  @Input() pages : Page[] = [];

  posts : Array<Post> = [];

  public postsByPage :  Array<Post> = [];

  paginationPosts = new Pagination();

  formCreate : FormGroup;

  formEdit   : FormGroup;

  public config: PerfectScrollbarConfigInterface = {};

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
    // this.loadFormEdit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPostsByPage( this.posts, this.idPage );
  } 

  getPostsByPage = ( posts : Post[], idPage : string, status : boolean = true, page : number = 1 ) => {
    this.postsByPage = posts.filter( p => p.page === idPage && p.is_active === status);
    this.paginationPosts.collectionSize = this.postsByPage.length;
    this.paginationPosts.status = status;
    this.paginationPosts.page = page;
  }

  loadFormCreate = () => {
    this.formCreate = this.formBuilder.group({
      page   : [ this.idPage, [ Validators.required ] ],
      title  : [ '', [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 200 ) ] ],
      slug   : ['', [ Validators.required] ],
      body   : [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(15000) ] ],
      author : [ '1', [ Validators.required] ]
    });
  }

  loadFormEdit = ( post : Post ) => {
    this.formEdit = this.formBuilder.group({
      id     : [ post?.id || null , [ Validators.required ] ],
      page   : [ post?.page || null , [ Validators.required ] ],
      title  : [ post?.title || null , [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 200 ) ] ],
      slug   : [ post?.slug || null , [ Validators.required] ],
      body   : [ post?.body || null , [ Validators.required, Validators.minLength(5), Validators.maxLength(15000) ] ],
      author : [ post?.author || null , [ Validators.required ] ],
      is_active : [ post.is_active, [ Validators.required ] ]
    });
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error!', 'Los campos del formulario no son validos','error');
    return false;
  }

  get(){
    this.postService.get().subscribe(
    ( res : Post[] ) => { 
      this.posts = res ;
      this.getPostsByPage( this.posts, this.idPage, this.paginationPosts.status );
    },
    ( error : any ) => { this.errorHandler( error ) });
  }

  create = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.postService.create( form.value ).subscribe(
      ( res : Post ) => {
        this.posts.push( res ); 
        this.paginationPosts.collectionSize ++ ;
        this.getPostsByPage( this.posts, this.idPage, this.paginationPosts.status, this.paginationPosts.page )
        this.closeModals();
        Swal.fire('Exito!', 'Se ha creado el post exitosamente', 'success');
      }, 
      ( error : any ) => { this.errorHandler( error ) });
    }
  }

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      this.postService.edit( form.value ).subscribe( 
      ( res : Post ) => {
        this.posts = this.posts.map( ( post : Post) => post.id === res.id ? { ...res } : post );
        this.getPostsByPage(this.posts, this.idPage, this.paginationPosts.status, this.paginationPosts.page)
        this.closeModals();
        Swal.fire('Exito!', 'Se ha actualizado el post exitosamente!', 'success');
      }, ( error : any ) => { this.errorHandler( error ) });
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
    console.log( error )
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

}
