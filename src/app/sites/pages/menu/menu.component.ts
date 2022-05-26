import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons,  NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  private webMenuId: number = 0;
  selectedST: Menu | undefined = Object.create(null);
  formMenuCreate: FormGroup;
  formMenuEdit: FormGroup;
  menus: Array <any> = [];
  totalMenu: number = 0;
  charging: boolean= true;
  titleTaskSection: string = '';
  sectionTask: Menu[] | null = null;
  webSites: Array <any> = [];

  //Paginación
  page =1;
  pageSize = 8;
  pageP = 1;
  pageSizeP = 8;
  collectionSize = 0;
  collectionSizePage = 0;
  _searchTerm = '';
  closeResult: string;
  idView: string;
  modal: any;



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

  
  loadformMenuCreate(){
    this.formMenuCreate = this.formBuilder.group({ 
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(40),Validators.minLength(4)]],
      slug:['',[Validators.required, Validators.maxLength(40),Validators.minLength(3)]],
      level:['',[Validators.required]],
      weight:['',[Validators.required]]
    })
  }

  loadformMenuEdit(){
    this.formMenuEdit = this.formBuilder.group({
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      title:['',[Validators.required, Validators.maxLength(40),Validators.minLength(4)]],
      slug:['',[Validators.required, Validators.maxLength(40),Validators.minLength(3)]],
      level:['',[Validators.required]],
      weight:['',[Validators.required]],
      is_active:[null,[Validators.required,]],
    })
  }

  getWebMenu = () =>{
    Swal.fire({
      title: 'Cargando',
      html: 'Por favor espera un momento...',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.menuService.getMenu().subscribe(
      (res:any) =>{
    this.menus = res;
    this.totalMenu = res.length;
    this.collectionSize = this.menus.length;
    this.charging = false;
    Swal.close();

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
  addTaskSection() {

    this.formMenuCreate.reset();

    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '300px') {
        this.closeRightMenu();
        return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '300px';

    this.titleTaskSection = 'Task';

    const menu = new Menu();
    menu.title = 'bla@bla.com';
    menu.slug = 'bla@bla.com';
    menu.level = 'bla@bla.com';
    menu.weight = '';
    menu.status = true;

  }

  openModal(content1: string, data: any) {

    if(data === 0){
      this.idView = 'create';
    }

    if (data != 0) {
      this.idView = 'edit';
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
    
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }
  closeModal() { 
    this.modalService.dismissAll()
  }


  getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
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

seleccionar(site){
  if (this.idView == 'create') {
    this.formMenuCreate.get('site').setValue(site.id);
  } else {
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
    this.webMenuId=this.formMenuEdit.value.id;
    const { ...data } = this.formMenuEdit.value;

    this.menuService.updateMenu(data, this.webMenuId).subscribe(
      (res:any)=>{
        this.getWebMenu();
        this.closeModal();
        Swal.fire(' Success','Editado correctamente','success');
      },
      (error:any)=>{
        Swal.fire('Error','vuelva a intentarlo','error');
      }
    )
  }
}

}
