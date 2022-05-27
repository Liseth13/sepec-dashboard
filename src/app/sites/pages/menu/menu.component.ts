import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons,  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import Swal from 'sweetalert2';
import { menuService } from '../../services/menu.service';
import { WebSitesService } from '../../services/web-sites.service';
import { Menu } from './menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  formMenuCreate: FormGroup;
  formMenuEdit: FormGroup;
  formSubmenuCreate : FormGroup;
  formSubmenuEdit : FormGroup;

  menus : Array <any> = [];
  submenus : Array <any> = [];
  fathers : Array <any> = [];
  webSites: Array <any> = [];


  paginationMenu = new Pagination();
  paginationSites = new Pagination();
  paginationSubmenus = new Pagination();
  paginationFathers = new Pagination();

  mode : 'create' | 'edit' | 'subCreate' | 'subEdit' | string = '';
  
  constructor(
    private formBuilder : FormBuilder, private menuService : menuService,
    private webSiteService: WebSitesService,private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadformMenuCreate();
    this.loadformMenuEdit();
    this.getWebMenu();
    this.getWebSite();
  }

  // generateSlug = ( control : FormControl ) => {
  //   //const patter
  //   const urlPrev : string = control.toLowerCase()
  //   this.formMenuCreate.get('slug').setValue(urlPrev.replace(/\s+/g, '-'))
  // }

  generateSlug = ( value : string, form : FormGroup ) => {
    const xvalue : string = value.toLowerCase();
    form.get('slug').setValue( xvalue.replace(/\s+/g, '-'));
  }

  loadformMenuCreate(){
    this.formMenuCreate = this.formBuilder.group({ 
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(100),Validators.minLength(4)]],
      slug:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      weight : ['', Validators.required ],
      level:['',[Validators.required, Validators.min(1), Validators.max(3)]],
      order:['',[Validators.required]],
      father:[null]
    })
  }



  loadformMenuEdit(){
    this.formMenuEdit = this.formBuilder.group({
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(100),Validators.minLength(4)]],
      slug:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      level:['',[Validators.required]],
      weight:['',[Validators.required]],
      order:['',[Validators.required]],
      is_active:['',[Validators.required,]],
    })
  }

  getWebMenu = () =>{
    this.menuService.getMenu().subscribe(
      (res:any) =>{
    this.menus = res;
    this.paginationMenu.collectionSize = this.menus.length;
    },
    (error:any) =>{})
  }

  getWebSite = () => {
    this.webSiteService.getWebSites().subscribe(
      (res:any) =>{
        this.webSites = res;
      },
      (error) => {
        
      }
    )
  }

  getSubMenus = (fatherId  :string) => {
    this.submenus = this.menus.filter(m => m.father === fatherId);
    this.paginationSubmenus.collectionSize = this.submenus.length;
  }

  openSidebar( mode : 'create' | 'edit' | string ) {

    this.mode = mode;

    this.formMenuCreate.reset();

    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '300px') {
        this.closeRightMenu();
        return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '300px';

  }

  openModal (content1: string, mode : 'sites' | 'father' | 'edit' | string, data : any ) {

    if ( mode === 'father' ) {
      const arr : any [] = this.menus.filter( m => m.level === this.formMenuCreate.get('level').value -1)
      this.paginationMenu.collectionSize = arr.length;
      this.paginationMenu.page = 1;
      this.paginationMenu.pageSize=2;
    }

    if (mode === 'edit' && data) {
      this.formMenuEdit.patchValue({
        id: data.id,
        site: data.site,
        title: data.title,
        slug: data.slug,
        level: data.level,
        weight: data.weight,
        is_active: data.is_active,
      })
    }

    this.modalService.open(content1)
  }
  closeModal() { 
    this.modalService.dismissAll()
  }

  closeRightMenu() {
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '0';
  }

  create(){
      
    if(this.formMenuCreate.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{
      
      this.menuService.createMenu(this.formMenuCreate.value).subscribe(
        (res:any)=>{
          
          this.getWebMenu()
          this.closeRightMenu();
          Swal.fire(' Success','Guardado correctamente','success')
        },
        (error:any)=>{
          Swal.fire('Error','vuelva a intentarlo','error')
        }
      )
    }
}

selectSite(site : any, mode : string){
  if (mode== 'create') {
    this.formMenuCreate.get('site').setValue(site.id);
  }
  if(mode== 'edit'){
    this.formMenuEdit.get('site').setValue(site.id);
  }
}
getName(siteId) {
  let siteName = '';

  if (siteId != '' && siteId != null) {
    const siteName = this.webSites.find(site => site.id === siteId);
    return siteName.name
  } else {
    return siteName;
  }
}

edit(){
  if(this.formMenuEdit.invalid){
    Swal.fire('Error','Faltan Campos Por Validar','warning')
  }else{


    this.menuService.updateMenu('data', 555).subscribe(
      (res:any)=>{
        this.getWebMenu();
        this.closeModal();
        Swal.fire(' Success','Editado correctamente','success');
      },
      (error : any)=>{
        Swal.fire('Error','vuelva a intentarlo','error');
      }
      )
    }
  }

  changeLevel = ( level : number, form : FormGroup ) => {
    const validLevels : number[] =  [ 1, 2, 3 ];
    if ( validLevels.includes( level ) && level === 1 ){
      form.get('father').setValue(null);
    } 
  }

  linkMenu = ( menu : any, form : FormGroup ) => {
    form.get('father').setValue( menu.id );
    this.modalService.dismissAll();
    
  }
}
