import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import { WebPagesService } from 'src/app/web-pages/services/web-pages.service';
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
  pages : Array<any>  = [];
  pageFilter : Array<any> = [];

  level : 1 | 2 | 3 | number = 1;
  levelFather : boolean= false;
  swError: boolean = false;
  sidebarMode : 'create' | 'edit' | string = 'create';
  public webSites: Array<any> = [];
  menuIdTemp: number = 0;
  
  //Paginación
  paginationSites = new Pagination();
  paginationMenu = new Pagination();
  paginationPage = new Pagination();
  
  constructor(
    private formBuilder : FormBuilder, private menuService : menuService,
    private webSiteService: WebSitesService, private modalService: NgbModal, private pageService: WebPagesService
  ) { }

  ngOnInit(): void {
    this.get()
    this.getSites();
    this.loadFormMenuCreate();
    this.loadFormMenuEdit();
    this.getPage();
  }

  getPage= () => {
    this.pageService.get()
    .subscribe( ( res : any[] ) => {
      this.pages = res;
      console.log('PAGINAS', res); 
    }, ( error : any ) => {
      this.errorHandler( error );
    });
  }

  get = () => {
    this.menuService.get()
    .subscribe( ( res : Menu[] ) => {
      this.menus = res;
      console.log('MENUS', res); 
    }, ( error : any ) => {
      this.errorHandler( error );
    });
  }

  getSites = () => {
    this.webSiteService.get()
    .subscribe(( res : any ) => {
      this.sites = res;
      console.log('SITIOS:', res); 
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

  
  loadFormMenuCreate(){
    this.formMenuCreate = this.formBuilder.group({ 
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(100),Validators.minLength(4)]],
      level:['',[Validators.required, Validators.min(1), Validators.max(3)]],
      weight:['',[Validators.required, Validators.min(0)]],
      father:[null],
      page:[null]
    })
  }



  loadFormMenuEdit(){
    this.formMenuEdit = this.formBuilder.group({
      id: [''],
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
    
    const isValid : boolean = this.validateForms( form );
    if( isValid ) { 
      if (form.value.level == 2) {
        const siteFather = this.menus.find((m) => m.level == 1 && m.father != null && m.id === this.menuIdTemp);
        console.log(siteFather);
        if (siteFather != undefined) {
          siteFather.page = null;
          this.formMenuEdit.patchValue({
            id: siteFather.id,
            site: siteFather.site,
            title: siteFather.title,
            level: siteFather.level,
            weight: siteFather.weight,
            father: siteFather.father,
            page: siteFather.page,
            is_active: true
          })
          this.edit(this.formMenuEdit, true);
        }
      }
      if (form.value.level == 3) {
        const siteFather = this.menus.find((m) => m.level == 2 && m.father != null && m.id === this.menuIdTemp);
        console.log(siteFather);
        if (siteFather != undefined) {
          siteFather.page = null;
          this.formMenuEdit.patchValue({
            id: siteFather.id,
            site: siteFather.site,
            title: siteFather.title,
            level: siteFather.level,
            weight: siteFather.weight,
            father: siteFather.father,
            page: siteFather.page,
            is_active: true
          })
          this.edit(this.formMenuEdit, true);
        }
      }
      if (!this.swError) {
        this.menuService.createMenu( form.value ).subscribe(
          ( res : any ) => {  
            this.get();
            this.closeRightSidebar();
            Swal.fire(' Success','Guardado correctamente','success');
          }, ( error : any ) => { this.errorHandler( error ) });
      }
    }
    this.swError = false;
  }
  
  edit( form : FormGroup, mess?: boolean ){
    const isValid : boolean = this.validateForms( form );
    
    if ( isValid ){
      this.menuService.updateMenu(form.value, form.value.id).subscribe(
      ( res : any )=>{       
        this.get();
        this.closeRightSidebar();
        if (!mess) {
          Swal.fire(' Success','Editado correctamente','success');
        }
      }, ( error : any ) => { this.errorHandler( error ), this.swError = true });
    }
  }
  openRightSidebar( mode: string) {
    this.levelFather = false;
    if ( mode === 'edit' ){
      this.sidebarMode = mode;
      this.loadFormMenuEdit();
    } else if ( mode === 'create' ) {
      this.sidebarMode = mode;
      this.loadFormMenuCreate();
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

  openModal (content1: string, mode : 'sites' | 'father' | 'edit' | 'menus' | string, data : any ) {

    if (mode === 'sites') {
      this.paginationSites.collectionSize = this.sites.length;
      this.paginationSites.page = 1;
      this.paginationSites.pageSize=5;
    }
    
    if (mode === 'menus') {
      this.paginationMenu.collectionSize = this.menusPadre.length;
      this.paginationMenu.page = 1;
      this.paginationMenu.pageSize= 5;
    }
    if (mode === 'pages') {
      this.paginationPage.collectionSize = this.pageFilter.length;
      this.paginationPage.page = 1;
      this.paginationPage.pageSize=5;
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
        this.pageFilter = this.pages.filter( m => m.site === this.formMenuCreate.value.site);
      }
      if(mode== 'edit'){
        this.formMenuEdit.get('site').setValue(site.id);
        this.pageFilter = this.pages.filter( m => m.site === this.formMenuEdit.value.site);
      }
      this.closeModal();
    }

    selectMenu(menu: any, mode : string){
      this.menuIdTemp = menu.id;
      console.log(this.menuIdTemp);
      

      if (mode== 'create') {
        this.formMenuCreate.get('father').setValue(menu.id);
      }
      if(mode== 'edit'){
        this.formMenuEdit.get('father').setValue(menu.id);
      }
      this.closeModal();
    }

    selectPage(page : any, mode : string){
      
      if (mode== 'create') {
        this.formMenuCreate.get('page').setValue(page.id);
      }
      if(mode== 'edit'){
        this.formMenuEdit.get('page').setValue(page.id);
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



