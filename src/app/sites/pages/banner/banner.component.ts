import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebPagesService } from 'src/app/web-pages/services/web-pages.service';
import Swal from 'sweetalert2';
import { BannerService }  from '../../services/banner.service'
import { Banner } from './banner';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  selectedST: Banner | undefined = Object.create(null);
  titleTaskSection = '';
  public webPages : Array <any> = [];
  public webBanner    : Array <any> = [];
  public formBannerCreate      : FormGroup;
  private formBannerEdit        : FormGroup;
  private totalWebBanner: number = 0;
  private totalWebPage: number = 0;
  charging: boolean = true;

  closeResult: string;

  idView: string = '';
  modal: NgbModalRef;

  //Paginación
  page =1;
  pageSize = 8;
  pageP = 1;
  pageSizeP = 8;
  collectionSize = 0;
  collectionSizePage = 0;
  _searchTerm = '';

  constructor(

    private formBuilder : FormBuilder, private BannerService: BannerService,
    private modalService: NgbModal, private webPagesService: WebPagesService,
    private activeModal: NgbActiveModal

  ) {{this.loadformBannerCreate(); this.loadformBannerEdit();}}

  ngOnInit(): void {
    this.getWebBanner();
    this.getWebPages();
    this.loadformBannerCreate();
   this.loadformBannerEdit();
  }

  loadformBannerCreate(){
    this.formBannerCreate = this.formBuilder.group({ 
      page:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      name:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
    })
  
  }


  loadformBannerEdit(){
    this.formBannerEdit = this.formBuilder.group({
      id: [''],
      page:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      name:['name',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      is_active:[null,[Validators.required,]],
    })
  }


  edit(){
    if(this.formBannerEdit.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{

      console.log(this.formBannerEdit.value);
      const { ...data } = this.formBannerEdit.value;
      // is_active === 'true' ? data.is_active = true : data.is_active = false;
      console.log(data);

      this.BannerService.updateBanner(data, this.formBannerEdit.value.id).subscribe(
        (res:any)=>{
          console.log(res);
          this.getWebBanner();
          this.closeModal();
          Swal.fire(' Success','Editado correctamente','success');
        },
        (error:any)=>{
          console.log(error)
          Swal.fire('Error','vuelva a intentarlo','error');
        }
      )
    }
  }

  create(){
      
    console.log (this.formBannerCreate.value)
    if(this.formBannerCreate.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')    
    }else{
      
      this.BannerService.createBanner(this.formBannerCreate.value).subscribe(
        (res:any)=>{
          console.log(res)
          
          this.getWebBanner()
          this.closeRightMenu();
          Swal.fire(' Success','Guardado correctamente','success')
        },
        (error:any)=>{
          console.log(error)
          Swal.fire('Error','vuelva a intentarlo','error')
        }
      )
    }
}
  getWebBanner = () =>{
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
    this.BannerService.getBanner().subscribe(
      (res:any) =>{
        this.webBanner = res;
        this.totalWebBanner = res.length;
        this.collectionSize = this.webBanner.length;
        this.charging = false;
        Swal.close();
        console.log(res);
      },
    (error:any) =>{})
  }

  getWebPages = () =>{
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
    this.webPagesService.get().subscribe(
      (res:any) =>{
        this.webPages = res;
        
        this.totalWebPage = res.length;
        this.collectionSizePage = this.webPages.length;
        this.charging = false;
        Swal.close();
        console.log(res);
      },
    (error:any) =>{})
  }



  openModal(content1: string, data: any) {
    if (data == 0) {
      this.idView = 'create';
    } else if (data == 1){    
      this.idView = 'edit';
    }
    
    this.modal = this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
  }

  openModalEdit(content1: string, data: any) {
    console.log(data);
    this.formBannerEdit.patchValue({
      id: data.id,
      page: data.page,
      name: data.name,
      is_active: data.is_active,
    })
    
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
  }

  closeModal(){
    this.modalService.dismissAll()
  }

  private getDismissReason(reason: ModalDismissReasons): string {
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

  getName(pageId) {
    let siteName = '';

    if (pageId != '' && pageId != null) {
      const siteName = this.webPages.find(page => page.id === pageId);
      return siteName.name
    } else {
      return siteName;
    }
  }

  addTaskSection() {

    this.formBannerCreate.reset();

    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '300px') {
        this.closeRightMenu();
        return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '300px';

    this.titleTaskSection = 'Task';

    const banner = new Banner();
    banner.name = 'bla@bla.com';
    banner.status = true;

  }

  seleccionar(Page){
    console.log(Page);
    if (this.idView == 'create') {
      this.formBannerCreate.get('page').setValue(Page.id);
      this.modalService.dismissAll();
    } else {
      this.formBannerEdit.get('page').setValue(Page.id);
      this.modal.close()
    }
  }
}
