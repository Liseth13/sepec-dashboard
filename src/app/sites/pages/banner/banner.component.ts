import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  public webBanner    : Array <any> = [];
  public formBannerCreate      : FormGroup;
  private formBannerEdit        : FormGroup;
  private totalWebBanner: number = 0;
  charging: boolean = true;
  private webbannerId: number = 0;

  //Paginación
  page =1;
  pageSize = 8;
  collectionSize = 0;
  _searchTerm = '';

  constructor(

    private formBuilder : FormBuilder, private bannerService: BannerService,
    private modalService: NgbModal

  ) {{this.loadformBannerCreate(); this.loadformBannerEdit();}}

  ngOnInit(): void {
    this.getWebBanner();
  }

  loadformBannerCreate(){
    this.formBannerCreate = this.formBuilder.group({ 
      name:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      slogan:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:['']
    })
  
  }


  loadformBannerEdit(){
    this.formBannerEdit = this.formBuilder.group({
      name:['name',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      slogan:['slogan',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:['icon'],
      is_active:[null,[Validators.required,]],
    })
  }

  getWebSite = () =>{
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
    this.bannerService.getBanner().subscribe(
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

  edit(){
    if(this.formBannerEdit.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{

      console.log(this.formBannerEdit.value);
      const { ...data } = this.formBannerEdit.value;
      // is_active === 'true' ? data.is_active = true : data.is_active = false;
      console.log(data);

      this.bannerService.updateBanner(data, this.webbannerId).subscribe(
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
      
      this.bannerService.createBanner(this.formBannerCreate.value).subscribe(
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
    this.bannerService.getBanner().subscribe(
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

  // getName(siteId) {
  //   let siteName = '';

  //   if (siteId != '' && siteId != null) {
  //     const siteName = this.webPages.find(page => page.id === pageId);
  //     return siteName.name
  //   } else {
  //     return siteName;
  //   }
  // }

}
