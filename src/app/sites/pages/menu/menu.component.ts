import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import Swal from 'sweetalert2';
import { Menu } from '../../interfaces/menu';
import { menuService } from '../../services/menu.service';
import { WebSitesService } from '../../services/web-sites.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {



  private formMenuCreate: FormGroup;
  private formMenuEdit: FormGroup;
  
  menusPadre : Array<Menu> =[];
  menus : Array<Menu> = [];
  sites : Array<any>  = [];

  level : 1 | 2 | 3 | number = 1;
  levelFather : boolean= false;
  sidebarMode : 'create' | 'edit' | string = 'create';
  public webSites: Array<any> = [];
  
  //Paginación
  paginationSites = new Pagination();
  paginationMenu = new Pagination();
  
  constructor(
    private formBuilder : FormBuilder, private menuService : menuService,
    private webSiteService: WebSitesService, private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.get()
    this.getSites();
    this.loadformMenuCreate();
  }

  get = () => {
    this.menuService.get()
    .subscribe( ( res : Menu[] ) => {
      this.menus = res;
      console.log(res); 
    }, ( error : any ) => {
      this.errorHandler( error );
    });
  }

  getSites = () => {
    this.webSiteService.get()
    .subscribe(( res : any ) => {
      this.sites = res;
    }, ( error : any ) => { this.errorHandler( error ) });
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

  closeRightSidebar() {
    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
   rightMenu.style.width = '0px';
  }
  validateForms(form: FormGroup): boolean {
   if ( form.valid ) {
     return true;
   }
   Swal.fire('Error','Faltan Campos Por Validar','warning')
   return false;
  }

  
  loadformMenuCreate(){
    this.formMenuCreate = this.formBuilder.group({ 
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(100),Validators.minLength(4)]],
      level:['',[Validators.required, Validators.min(1), Validators.max(3)]],
      weight:['',[Validators.required, Validators.min(0)]],
      father:[null],
      page:[null]
    })
  }



  loadformMenuEdit(){
    this.formMenuEdit = this.formBuilder.group({
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(100),Validators.minLength(4)]],
      level:['',[Validators.required]],
      weight:['',[Validators.required, Validators.min(0)]],
      father:[null],
      page:[null],
      is_active:['',[Validators.required,]],
    })
  }

  create = ( form : FormGroup ) => {
    console.log(form);
    console.log(form.value);
    
    const isValid : boolean = this.validateForms( form );
    if( isValid ) { 
      this.menuService.createMenu( form.value ).subscribe(
      ( res : any ) => {  
        this.get();
        this.closeRightSidebar();
        Swal.fire('Exito!','Guardado correctamente','success')
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }
  
  edit( form : FormGroup ){
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      this.menuService.updateMenu(form.value.id, form.value).subscribe(
      ( res : any )=>{
        this.get();
        this.closeRightSidebar();
        Swal.fire(' Success','Editado correctamente','success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }
  openRightSidebar( mode: string) {
    if ( mode === 'edit' ){
      this.sidebarMode = mode;
      this.loadformMenuEdit();
    } else if ( mode === 'create' ) {
      this.sidebarMode = mode;
      this.loadformMenuCreate();
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

  openModal (content1: string, mode : 'sites' | 'father' | 'edit' | 'menu' | string, data : any ) {

    if (mode === 'sites') {
      this.paginationSites.collectionSize = this.sites.length;
      this.paginationSites.page = 1;
      this.paginationSites.pageSize=5;
    }

    if (mode === 'menu') {
      this.paginationMenu.collectionSize = this.menusPadre.length;
      this.paginationMenu.page = 1;
      this.paginationMenu.pageSize=5;
    }

    if (mode === 'edit' && data) {
      this.formMenuEdit.patchValue({
        id: data.id,
        site: data.site,
        title: data.title,
        level: data.level,
        is_active: data.is_active,
      })
    }

    this.modalService.open(content1)
  }
  closeModal() { 
    this.modalService.dismissAll()
  }



    selectSite(site : any, mode : string){
      if (mode== 'create') {
        this.formMenuCreate.get('site').setValue(site.id);
      }
      if(mode== 'edit'){
        this.formMenuEdit.get('site').setValue(site.id);
      }
      this.closeModal();
    }

    selectMenu(menu : any, mode : string){
      console.log(menu);
      
      if (mode== 'create') {
        this.formMenuCreate.get('father').setValue(menu.id);
      }
      if(mode== 'edit'){
        this.formMenuEdit.get('father').setValue(menu.id);
      }
      this.closeModal();
    }


  changeLevel = ( level ) => {

    this.formMenuCreate.get('father').setValue(null)
    this.formMenuCreate.get('level').setValue(level);
    if (level === "2"){
      this.menusPadre = this.menus.filter( m => m.level === 1);
      this.levelFather= true;
    }else if(level == "3"){
      this.menusPadre = this.menus.filter( m => m.level === 2);
      this.levelFather= true;
    } else {
      this.levelFather= false;
    }

  }

  changeView = ( level ) => {
    if (level === "1") {
      this.level  = 1
    }else
    if (level === "2") {
      this.level = 2
    }else
    if (level === "3") {
      this.level = 3
    }
  }


   
}



